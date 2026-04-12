import { getTwitchAuthorizeUrl } from '$lib/platform/twitchAuth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const platform = url.searchParams.get('platform');
	const next = url.searchParams.get('next') ?? '/app';

	const {
		data: { user },
		error: userError
	} = await supabase.auth.getUser();

	if (userError || !user) {
		redirect(303, '/auth/signin?error=auth_required');
	}

	if (platform === 'twitch') {
		const { data: existingLink } = await supabase
			.from('user_auth')
			.select('id')
			.eq('user_id', user.id)
			.eq('platform', 'twitch')
			.maybeSingle();

		if (existingLink) {
			redirect(303, `${next}?info=already_linked`);
		}

		const redirectUri = `${url.origin}/auth/confirm/twitch`;
		const authUrl = getTwitchAuthorizeUrl(redirectUri, JSON.stringify({ userId: user.id, next }));

		redirect(303, authUrl);
	}

	redirect(303, '/app?error=unsupported_platform');
};
