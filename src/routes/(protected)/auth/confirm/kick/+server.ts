import { dev } from '$app/environment';
import { exchangeCodeForToken, getCurrentUser } from '$lib/platform/kickAuth';
import type { Database } from '$lib/supabase/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const error = url.searchParams.get('error');
	const state = url.searchParams.get('state');

	let next = '/app';
	if (state) {
		try {
			const parsed = JSON.parse(state);
			next = parsed.next ?? '/app';
		} catch {
			next = '/app';
		}
	}

	if (error || !code) {
		if (dev) {
			console.error('[Kick OAuth Error] Callback failed:', { error });
		}
		return redirect(303, `/auth/signin?error=kick_auth_failed`);
	}

	const redirectUri = `${url.origin}/auth/confirm/kick`;
	const token = await exchangeCodeForToken(code, redirectUri);

	if (!token) {
		if (dev) {
			console.error('[Kick OAuth Error] Token exchange failed');
		}
		return redirect(303, `/auth/signin?error=kick_token_exchange_failed`);
	}

	const userInfo = await getCurrentUser(token.access_token);
	if (!userInfo) {
		if (dev) {
			console.error('[Kick OAuth Error] User fetch failed');
		}
		return redirect(303, `/auth/signin?error=kick_user_fetch_failed`);
	}

	const expiresAt = Math.floor(Date.now() / 1000) + token.expires_in;

	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) {
		return redirect(303, `/auth/signin?error=no_user_session`);
	}

	const client = supabase as unknown as SupabaseClient<Database>;

	const [authResult, infoResult] = await Promise.all([
		client.from('user_auth').upsert({
			user_id: user.id,
			platform: 'kick',
			platform_user_id: userInfo.user_id,
			access_token: token.access_token,
			refresh_token: token.refresh_token,
			expires_in: token.expires_in,
			expires_at: expiresAt,
			scope: token.scope.join(' ')
		}),
		client.from('user_info').upsert({
			user_id: user.id,
			platform: 'kick',
			platform_user_id: userInfo.user_id,
			login: userInfo.username,
			display_name: userInfo.name,
			profile_image_url: userInfo.profile_picture,
			broadcaster_type: ''
		})
	]);

	if (authResult.error || infoResult.error) {
		if (dev) {
			console.error('[Kick OAuth Error] Failed to save auth data');
		}
		return redirect(303, `/auth/signin?error=kick_auth_save_failed`);
	}

	return redirect(303, next);
};
