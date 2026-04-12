import { PUBLIC_TWITCH_CLIENT_ID } from '$env/static/public';
import type { Database } from '$lib/supabase/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

async function shouldAutoLinkTwitch(
	client: SupabaseClient<Database>,
	userId: string,
	accessToken: string,
	provider: string
): Promise<boolean> {
	const { data: authRecord } = await client
		.from('user_auth')
		.select('id')
		.eq('user_id', userId)
		.eq('platform', provider)
		.limit(1);

	if (authRecord && authRecord.length > 0) {
		return true;
	}

	const { data: userData, error: userError } = await client.auth.getUser(accessToken);
	if (userError || !userData.user) {
		return false;
	}

	const createdAt = new Date(userData.user.created_at).getTime();
	const now = Date.now();
	const isNewUser = now - createdAt < 60000;

	return isNewUser;
}

async function linkTwitchPlatform(
	client: SupabaseClient<Database>,
	userId: string,
	providerToken: string,
	providerRefreshToken: string | null,
	expiresIn: number | null
): Promise<void> {
	const expiresAt = Math.floor(Date.now() / 1000) + (expiresIn ?? 3600);

	const authPromise = client.from('user_auth').upsert({
		user_id: userId,
		platform: 'twitch',
		platform_user_id: userId,
		access_token: providerToken,
		refresh_token: providerRefreshToken ?? null,
		expires_in: expiresIn,
		expires_at: expiresAt,
		scope: ''
	});

	const twitchResponsePromise = fetch('https://api.twitch.tv/helix/users', {
		headers: {
			Authorization: `Bearer ${providerToken}`,
			'Client-Id': PUBLIC_TWITCH_CLIENT_ID
		}
	});

	const [, twitchResponse] = await Promise.all([authPromise, twitchResponsePromise]);

	if (twitchResponse.ok) {
		const twitchData = await twitchResponse.json();
		const twitchUser = twitchData.data?.[0];

		if (twitchUser) {
			await client.from('user_info').upsert({
				user_id: userId,
				platform: 'twitch',
				platform_user_id: twitchUser.id,
				login: twitchUser.login,
				display_name: twitchUser.display_name,
				profile_image_url: twitchUser.profile_image_url,
				broadcaster_type: twitchUser.broadcaster_type || ''
			});
		}
	}
}

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/app';

	if (!code) {
		redirect(303, '/auth/signin?error=auth_callback_failed');
	}

	const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

	if (error || !sessionData.session) {
		redirect(303, '/auth/signin?error=auth_callback_failed');
	}

	const user = sessionData.session.user;
	const providerToken = sessionData.session.provider_token;
	const providerRefreshToken = sessionData.session.provider_refresh_token;

	if (providerToken) {
		const client = supabase as unknown as SupabaseClient<Database>;
		const shouldLink = await shouldAutoLinkTwitch(
			client,
			user.id,
			sessionData.session.access_token,
			'twitch'
		);

		if (shouldLink) {
			await linkTwitchPlatform(
				client,
				user.id,
				providerToken,
				providerRefreshToken ?? null,
				sessionData.session.expires_in
			);
		}
	}

	redirect(303, next);
};
