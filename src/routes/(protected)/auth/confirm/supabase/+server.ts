import { dev } from '$app/environment';
import { PUBLIC_TWITCH_CLIENT_ID } from '$env/static/public';
import { PLATFORM_SCOPES } from '$lib/platform/scopes';
import { linkManagedPlatform } from '$lib/platform/tokenState';
import { createOAuthState, validateOAuthState } from '$lib/server/oauthState';
import type { Database } from '$lib/supabase/database.types';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Fetch Twitch user profile, store in user_info, and return platform user ID
 */
async function fetchTwitchProfile(
	client: SupabaseClient<Database>,
	userId: string,
	providerToken: string
): Promise<string | null> {
	const response = await fetch('https://api.twitch.tv/helix/users', {
		headers: {
			Authorization: `Bearer ${providerToken}`,
			'Client-Id': PUBLIC_TWITCH_CLIENT_ID
		}
	});

	if (!response.ok) {
		if (dev) {
			const errorText = await response.text();
			console.error('[Twitch API Error]', { status: response.status, error: errorText });
		}
		return null;
	}

	const data = await response.json();
	const twitchUser = data.data?.[0];

	if (!twitchUser) {
		if (dev) {
			console.error('[Twitch Profile Error] User not found:', { userId });
		}
		return null;
	}

	await client.from('user_info').upsert({
		user_id: userId,
		platform: 'twitch',
		platform_user_id: twitchUser.id,
		login: twitchUser.login,
		display_name: twitchUser.display_name,
		profile_image_url: twitchUser.profile_image_url,
		broadcaster_type: twitchUser.broadcaster_type || ''
	});

	return twitchUser.id;
}

/**
 * Fetch YouTube channel profile, store in user_info, and return platform user ID
 * Falls back to OAuth metadata if YouTube API fails (e.g., insufficient scopes)
 */
async function fetchYouTubeProfile(
	client: SupabaseClient<Database>,
	userId: string,
	providerToken: string,
	session: Session
): Promise<string | null> {
	const response = await fetch(
		'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
		{
			headers: {
				Authorization: `Bearer ${providerToken}`
			}
		}
	);

	if (!response.ok) {
		// YouTube API failed - use OAuth metadata as fallback
		if (dev) {
			console.error('[YouTube API Error] Using metadata fallback:', { status: response.status });
		}

		// Extract user info from OAuth metadata
		const metadata = session.user.user_metadata;
		const identityId = session.user.id; // Use Supabase user ID as fallback
		const displayName = metadata.name || metadata.full_name || 'YouTube User';
		const avatar = metadata.picture || metadata.avatar_url || '';

		await client.from('user_info').upsert({
			user_id: userId,
			platform: 'youtube',
			platform_user_id: identityId,
			login: '',
			display_name: displayName,
			profile_image_url: avatar,
			broadcaster_type: ''
		});

		return identityId;
	}

	const data = await response.json();
	const channel = data.items?.[0];

	if (!channel) {
		if (dev) {
			console.error('[YouTube Profile Error] Channel not found:', { userId });
		}
		return null;
	}

	await client.from('user_info').upsert({
		user_id: userId,
		platform: 'youtube',
		platform_user_id: channel.id,
		login: channel.snippet?.customUrl?.replace('@', '') || '',
		display_name: channel.snippet?.title || '',
		profile_image_url: channel.snippet?.thumbnails?.default?.url || '',
		broadcaster_type: ''
	});

	return channel.id;
}

/**
 * Fetch Kick user profile, store in user_info, and return platform user ID
 */
async function fetchKickProfile(
	client: SupabaseClient<Database>,
	userId: string,
	providerToken: string
): Promise<string | null> {
	const response = await fetch('https://api.kick.com/public/v1/users', {
		headers: {
			Authorization: `Bearer ${providerToken}`
		}
	});

	if (!response.ok) {
		if (dev) {
			const errorText = await response.text();
			console.error('[Kick API Error]', { status: response.status, error: errorText });
		}
		return null;
	}

	const data = await response.json();
	const kickUser = data.data?.[0];

	if (!kickUser) {
		if (dev) {
			console.error('[Kick Profile Error] User not found:', { userId });
		}
		return null;
	}

	const platformUserId = kickUser.user_id || kickUser.id;

	await client.from('user_info').upsert({
		user_id: userId,
		platform: 'kick',
		platform_user_id: platformUserId,
		login: kickUser.username || kickUser.login || '',
		display_name: kickUser.name || kickUser.display_name || '',
		profile_image_url: kickUser.profile_picture || '',
		broadcaster_type: ''
	});

	return platformUserId;
}

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	if (!code) {
		return redirect(303, '/auth/signin?error=auth_callback_failed');
	}

	const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

	if (error || !sessionData.session) {
		if (dev) {
			console.error('[Supabase Auth Error] Callback failed:', { error });
		}
		return redirect(303, '/auth/signin?error=auth_callback_failed');
	}

	// CRITICAL FIX: Refresh session and get FRESH session data
	// This fixes Supabase issue #1676 where provider_token can be stale when using multiple OAuth providers
	// The refresh updates the server-side session, then we get fresh user data
	await supabase.auth.refreshSession();
	const { data: freshSessionData } = await supabase.auth.getSession();

	if (!freshSessionData.session) {
		if (dev) {
			console.error('[Supabase Auth Error] Failed to refresh session');
		}
		return redirect(303, '/auth/signin?error=auth_callback_failed');
	}

	// Use fresh session for user (ensures correct data), but get provider_token from exchangeCodeForSession
	// because getSession() doesn't return provider_token (not stored in cookie for security)
	const session = freshSessionData.session;
	const user = session.user;
	const providerToken = sessionData.session.provider_token;

	// CRITICAL: app_metadata.provider returns the PRIMARY provider, not the current OAuth provider
	// For linked identities, we must identify the provider from the most recently updated identity
	const provider = user.identities?.length
		? user.identities.sort((a, b) => {
				const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
				const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
				return dateB - dateA;
			})[0].provider
		: user.app_metadata.provider;

	// Read flowType from query params to determine behavior
	// flowType: 'signup' (initial signup) | 'upgrade' (complete setup) | 'connect' (explicit connection) | 'unlink' (re-auth after unlink) | undefined
	const flowType = url.searchParams.get('flowType') as
		| 'signup'
		| 'upgrade'
		| 'connect'
		| 'unlink'
		| null;

	// Determine redirect target based on flowType
	// 'signup' goes to /app (finish onboarding), everything else returns to /app/platforms
	const redirectTarget = flowType === 'signup' ? '/app' : '/app/platforms';

	// Validate OAuth state for security (mandatory)
	if (state) {
		const validatedState = validateOAuthState(state, user.id);
		if (!validatedState) {
			if (dev) {
				console.error('[OAuth Security Error] State validation failed');
			}
			return redirect(303, '/auth/signin?error=invalid_state');
		}
	}

	if (providerToken && provider) {
		const client = supabase as unknown as SupabaseClient<Database>;

		// Map provider to platform
		const platformMap: Record<string, string> = {
			twitch: 'twitch',
			google: 'youtube',
			'custom:kick': 'kick'
		};

		const platform = platformMap[provider];
		if (!platform) {
			return redirect(303, redirectTarget);
		}

		// Fetch profile and get platform user ID first
		let platformUserId: string | null = null;
		switch (platform) {
			case 'twitch':
				platformUserId = await fetchTwitchProfile(client, user.id, providerToken);
				break;
			case 'youtube':
				platformUserId = await fetchYouTubeProfile(client, user.id, providerToken, session);
				break;
			case 'kick':
				platformUserId = await fetchKickProfile(client, user.id, providerToken);
				break;
		}

		if (!platformUserId) {
			if (dev) {
				console.error('[Platform Profile Error] Failed to fetch user ID:', { platform });
			}
			// For Kick OAuth failures, redirect to signin with oauth_provider_failed error
			if (platform === 'kick') {
				return redirect(303, '/auth/signin?error=oauth_provider_failed');
			}
			return redirect(303, '/app/platforms?error=profile_fetch_failed');
		}

		// Check if user already has this platform in user_auth
		// This is the source of truth for whether this is a new or existing OAuth connection
		const { data: existingAuth } = await supabase
			.from('user_auth')
			.select('is_linked')
			.eq('user_id', user.id)
			.eq('platform', platform)
			.maybeSingle();

		if (!existingAuth) {
			// NEW PROVIDER: First-time OAuth or re-auth after unlink

			if (flowType === 'upgrade' || flowType === 'connect') {
				// UPGRADE or CONNECT: User clicked "Connect" from platforms page
				// Complete in one step with full scopes, skip the prompt
				const fullScopes =
					platform === 'youtube' ? PLATFORM_SCOPES.youtube.full : PLATFORM_SCOPES.twitch.full;

				await linkManagedPlatform(user.id, platform, platformUserId, fullScopes, true, client);

				// Force session refresh to ensure fresh JWT claims for RLS policies
				await supabase.auth.refreshSession();

				return redirect(303, redirectTarget);
			} else if (flowType === 'signup') {
				// SIGNUP: Initial signup flow - show prompt first with basic scopes
				const basicScopes =
					platform === 'youtube' ? PLATFORM_SCOPES.youtube.auth : PLATFORM_SCOPES.twitch.auth;

				await linkManagedPlatform(user.id, platform, platformUserId, basicScopes, false, client);

				// Force session refresh to ensure fresh JWT claims for RLS policies
				await supabase.auth.refreshSession();

				const promptState = createOAuthState(user.id, redirectTarget);
				return redirect(
					303,
					`/auth/oauth-prompt?platform=${platform}&state=${promptState}&flowType=signup`
				);
			} else {
				// UNLINK (null/undefined): Re-auth after unlinking - skip prompt, create managed_basic
				const authScopes =
					platform === 'youtube' ? PLATFORM_SCOPES.youtube.auth : PLATFORM_SCOPES.twitch.auth;

				await linkManagedPlatform(user.id, platform, platformUserId, authScopes, false, client);

				// Force session refresh to ensure fresh JWT claims for RLS policies
				await supabase.auth.refreshSession();

				return redirect(303, redirectTarget);
			}
		} else if (existingAuth && !existingAuth.is_linked) {
			// User has managed_basic - determine if this is an upgrade or just re-auth
			// Use flowType to determine behavior
			// 'signup' = user clicked "Allow access" from signup prompt
			// 'upgrade' = user clicked "Complete Setup" from platforms
			// 'connect' = user clicked "Connect" from platforms
			if (flowType === 'upgrade' || flowType === 'connect' || flowType === 'signup') {
				// UPGRADE SCENARIO: User clicked "Complete Setup" or is connecting from platforms
				const fullScopes =
					platform === 'youtube' ? PLATFORM_SCOPES.youtube.full : PLATFORM_SCOPES.twitch.full;

				await linkManagedPlatform(user.id, platform, platformUserId, fullScopes, true, client);

				// Force session refresh to ensure fresh JWT claims
				await supabase.auth.refreshSession();
			} else {
				// RE-AUTH SCENARIO: User signed in again with basic scopes (signup flow, no prompt yet)
				const basicScopes =
					platform === 'youtube' ? PLATFORM_SCOPES.youtube.auth : PLATFORM_SCOPES.twitch.auth;

				await linkManagedPlatform(user.id, platform, platformUserId, basicScopes, false, client);

				// Force session refresh to ensure fresh JWT claims
				await supabase.auth.refreshSession();
			}
		} else {
			// EXISTING PROVIDER: Maintain current linked state (re-authentication)
			const isLinked = existingAuth?.is_linked ?? true;
			const scopes = isLinked
				? platform === 'youtube'
					? PLATFORM_SCOPES.youtube.full
					: PLATFORM_SCOPES.twitch.full
				: platform === 'youtube'
					? PLATFORM_SCOPES.youtube.auth
					: PLATFORM_SCOPES.twitch.auth;

			await linkManagedPlatform(user.id, platform, platformUserId, scopes, isLinked, client);

			// Force session refresh to ensure fresh JWT claims
			await supabase.auth.refreshSession();
		}
	}

	return redirect(303, redirectTarget);
};
