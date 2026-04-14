import { exchangeCodeForToken, getCurrentChannel } from '$lib/platform/youtubeAuth';
import type { Database } from '$lib/supabase/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dev } from '$app/environment';

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
			console.error('[YouTube OAuth Error] Callback failed:', { error });
		}
		return redirect(303, `/auth/signin?error=youtube_auth_failed`);
	}

	const redirectUri = `${url.origin}/auth/confirm/youtube`;
	const token = await exchangeCodeForToken(code, redirectUri);

	if (!token) {
		if (dev) {
			console.error('[YouTube OAuth Error] Token exchange failed');
		}
		return redirect(303, `/auth/signin?error=youtube_token_exchange_failed`);
	}

	const channelInfo = await getCurrentChannel(token.access_token);
	if (!channelInfo) {
		if (dev) {
			console.error('[YouTube OAuth Error] Channel fetch failed');
		}
		return redirect(303, `/auth/signin?error=youtube_channel_fetch_failed`);
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
			platform: 'youtube',
			platform_user_id: channelInfo.id,
			access_token: token.access_token,
			refresh_token: token.refresh_token,
			expires_in: token.expires_in,
			expires_at: expiresAt,
			scope: token.scope.join(' ')
		}),
		client.from('user_info').upsert({
			user_id: user.id,
			platform: 'youtube',
			platform_user_id: channelInfo.id,
			login: channelInfo.customUrl,
			display_name: channelInfo.title,
			profile_image_url: channelInfo.thumbnailUrl,
			broadcaster_type: ''
		})
	]);

	if (authResult.error || infoResult.error) {
		if (dev) {
			console.error('[YouTube OAuth Error] Failed to save auth data');
		}
		return redirect(303, `/auth/signin?error=youtube_auth_save_failed`);
	}

	return redirect(303, next);
};
