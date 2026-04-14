import { getKickAuthorizeUrl } from '$lib/platform/kickAuth';
import { getTwitchAuthorizeUrl } from '$lib/platform/twitchAuth';
import { getYouTubeAuthorizeUrl } from '$lib/platform/youtubeAuth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const platform = url.searchParams.get('platform');
	const next = url.searchParams.get('next') ?? '/app';

	if (!platform) {
		return redirect(303, '/app?error=platform_required');
	}

	const {
		data: { user },
		error: userError
	} = await supabase.auth.getUser();

	if (userError || !user) {
		return redirect(303, '/auth/signin?error=auth_required');
	}

	// Check if already linked
	const { data: existingLink } = await supabase
		.from('user_auth')
		.select('id')
		.eq('user_id', user.id)
		.eq('platform', platform)
		.maybeSingle();

	if (existingLink) {
		return redirect(303, `${next}?info=already_linked`);
	}

	const state = JSON.stringify({ userId: user.id, next });

	switch (platform) {
		case 'twitch': {
			const redirectUri = `${url.origin}/auth/confirm/twitch`;
			const authUrl = getTwitchAuthorizeUrl(redirectUri, state);
			return redirect(303, authUrl);
		}

		case 'youtube': {
			const redirectUri = `${url.origin}/auth/confirm/youtube`;
			const authUrl = getYouTubeAuthorizeUrl(redirectUri, state);
			return redirect(303, authUrl);
		}

		case 'kick': {
			const redirectUri = `${url.origin}/auth/confirm/kick`;
			const authUrl = getKickAuthorizeUrl(redirectUri, state);
			return redirect(303, authUrl);
		}

		default:
			return redirect(303, '/app?error=unsupported_platform');
	}
};
