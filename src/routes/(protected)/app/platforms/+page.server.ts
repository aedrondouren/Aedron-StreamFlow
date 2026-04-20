import { dev } from '$app/environment';
import {
	getCurrentUser as getKickUser,
	refreshToken as refreshKickToken
} from '$lib/platform/kickAuth';
import { PLATFORM_SCOPES, type Platform } from '$lib/platform/scopes';
import {
	getCurrentUser as getTwitchUser,
	refreshToken as refreshTwitchToken
} from '$lib/platform/twitchAuth';
import {
	getCurrentChannel as getYouTubeChannel,
	refreshToken as refreshYouTubeToken
} from '$lib/platform/youtubeAuth';
import { requireAuth } from '$lib/server/auth';
import { createOAuthState } from '$lib/server/oauthState';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	unlink: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData();
		const platform = formData.get('platform') as string;

		if (!platform) {
			return fail(400, { error: 'Platform is required' });
		}

		const user = await requireAuth(supabase);

		// Check if this is a managed platform
		const { data: authData } = await supabase
			.from('user_auth')
			.select('auth_source')
			.eq('user_id', user.id)
			.eq('platform', platform)
			.single();

		const isManaged = authData?.auth_source === 'managed';

		// Delete the platform records
		const { error: authError } = await supabase
			.from('user_auth')
			.delete()
			.eq('user_id', user.id)
			.eq('platform', platform);

		if (authError) {
			return fail(500, { error: 'Failed to unlink platform' });
		}

		const { error: infoError } = await supabase
			.from('user_info')
			.delete()
			.eq('user_id', user.id)
			.eq('platform', platform);

		if (infoError) {
			return fail(500, { error: 'Failed to unlink platform info' });
		}

		// If managed, trigger re-auth with basic scopes to downgrade permissions
		if (isManaged) {
			// Kick is manual-only, so we shouldn't reach here for Kick
			if (platform === 'kick') {
				redirect(303, '/app/platforms');
			}

			const provider = platform === 'youtube' ? 'google' : platform;
			const platformScopes = PLATFORM_SCOPES[platform as 'twitch' | 'youtube'];
			const authScopes = platformScopes?.auth || [];

			// No flowType = unlink behavior (skip prompt, create managed_basic)
			const redirectTo = `${url.origin}/auth/confirm/supabase`;

			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: provider as 'google' | 'twitch',
				options: {
					redirectTo,
					queryParams: {
						scope: authScopes.join(' ')
					}
				}
			});

			if (error) {
				return fail(500, { error: 'Failed to initiate re-authentication' });
			}

			if (data.url) {
				redirect(303, data.url);
			}
		}

		redirect(303, '/app/platforms');
	},

	refresh: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const platform = formData.get('platform') as string;

		if (!platform) {
			return fail(400, { error: 'Platform is required' });
		}

		const user = await requireAuth(supabase);

		// Get current auth data
		const { data: authData } = await supabase
			.from('user_auth')
			.select('*')
			.eq('user_id', user.id)
			.eq('platform', platform)
			.single();

		if (!authData) {
			return fail(404, { error: 'Platform not connected' });
		}

		let accessToken: string | null = null;

		// Handle manual vs managed tokens differently
		if (authData.auth_source === 'managed') {
			// For managed: get token from Supabase session
			const { data: sessionData } = await supabase.auth.getSession();
			accessToken = sessionData.session?.provider_token || null;

			if (!accessToken) {
				return fail(401, {
					error: 'Session expired. Please sign in again to refresh your connection.'
				});
			}
		} else {
			// For manual: use stored token with refresh logic
			accessToken = authData.access_token;
			const refreshTokenValue = authData.refresh_token;

			// Refresh token if we have a refresh token and it's expiring
			if (
				refreshTokenValue &&
				authData.expires_at &&
				authData.expires_at < Date.now() / 1000 + 60
			) {
				let refreshed = null;

				switch (platform) {
					case 'twitch':
						refreshed = await refreshTwitchToken(refreshTokenValue);
						break;
					case 'youtube':
						refreshed = await refreshYouTubeToken(refreshTokenValue);
						break;
					case 'kick':
						refreshed = await refreshKickToken(refreshTokenValue);
						break;
				}

				if (refreshed) {
					accessToken = refreshed.access_token;

					// Update stored tokens
					await supabase
						.from('user_auth')
						.update({
							access_token: refreshed.access_token,
							refresh_token: refreshed.refresh_token,
							expires_in: refreshed.expires_in,
							expires_at: Math.floor(Date.now() / 1000) + refreshed.expires_in,
							updated_at: new Date().toISOString()
						})
						.eq('id', authData.id);
				}
			}
		}

		if (!accessToken) {
			return fail(500, { error: 'Failed to get access token' });
		}

		// Fetch fresh user data based on platform
		switch (platform) {
			case 'twitch': {
				const twitchUser = await getTwitchUser(accessToken);
				if (!twitchUser) {
					return fail(500, { error: 'Failed to fetch user data from Twitch' });
				}

				const { error: updateError } = await supabase.from('user_info').upsert(
					{
						user_id: user.id,
						platform: 'twitch',
						platform_user_id: twitchUser.id,
						login: twitchUser.login,
						display_name: twitchUser.display_name,
						profile_image_url: twitchUser.profile_image_url,
						broadcaster_type: twitchUser.broadcaster_type,
						updated_at: new Date().toISOString()
					},
					{
						onConflict: 'user_id,platform'
					}
				);

				if (updateError) {
					return fail(500, { error: 'Failed to update user info' });
				}

				return {
					success: true,
					platform: {
						...authData,
						user_info: {
							user_id: user.id,
							platform: 'twitch',
							platform_user_id: twitchUser.id,
							login: twitchUser.login,
							display_name: twitchUser.display_name,
							profile_image_url: twitchUser.profile_image_url,
							broadcaster_type: twitchUser.broadcaster_type
						}
					}
				};
			}

			case 'youtube': {
				const channel = await getYouTubeChannel(accessToken);
				if (!channel) {
					return fail(500, { error: 'Failed to fetch channel data from YouTube' });
				}

				const { error: updateError } = await supabase.from('user_info').upsert(
					{
						user_id: user.id,
						platform: 'youtube',
						platform_user_id: channel.id,
						login: channel.customUrl,
						display_name: channel.title,
						profile_image_url: channel.thumbnailUrl,
						broadcaster_type: '',
						updated_at: new Date().toISOString()
					},
					{
						onConflict: 'user_id,platform'
					}
				);

				if (updateError) {
					return fail(500, { error: 'Failed to update user info' });
				}

				return {
					success: true,
					platform: {
						...authData,
						user_info: {
							user_id: user.id,
							platform: 'youtube',
							platform_user_id: channel.id,
							login: channel.customUrl,
							display_name: channel.title,
							profile_image_url: channel.thumbnailUrl,
							broadcaster_type: ''
						}
					}
				};
			}

			case 'kick': {
				const kickUser = await getKickUser(accessToken);
				if (!kickUser) {
					return fail(500, { error: 'Failed to fetch user data from Kick' });
				}

				const { error: updateError } = await supabase.from('user_info').upsert(
					{
						user_id: user.id,
						platform: 'kick',
						platform_user_id: kickUser.user_id,
						login: kickUser.username,
						display_name: kickUser.name,
						profile_image_url: kickUser.profile_picture,
						broadcaster_type: '',
						updated_at: new Date().toISOString()
					},
					{
						onConflict: 'user_id,platform'
					}
				);

				if (updateError) {
					return fail(500, { error: 'Failed to update user info' });
				}

				return {
					success: true,
					platform: {
						...authData,
						user_info: {
							user_id: user.id,
							platform: 'kick',
							platform_user_id: kickUser.user_id,
							login: kickUser.username,
							display_name: kickUser.name,
							profile_image_url: kickUser.profile_picture,
							broadcaster_type: ''
						}
					}
				};
			}

			default:
				return fail(400, { error: 'Unsupported platform' });
		}
	},

	/**
	 * Initiate platform connection from platforms page
	 * Creates OAuth state and redirects to OAuth flow
	 */
	initiatePlatformConnect: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData();
		const platform = formData.get('platform') as Platform;
		const scopeType = formData.get('scopeType') as 'full' | 'manual' | null;

		if (!platform) {
			return fail(400, { error: 'Platform is required' });
		}

		const user = await requireAuth(supabase);

		// Map platform to provider
		const providerMap: Record<string, string> = {
			twitch: 'twitch',
			youtube: 'google',
			kick: 'custom:kick'
		};
		const provider = providerMap[platform];

		if (!provider) {
			return fail(400, { error: 'Invalid platform' });
		}

		// Kick is manual-only
		if (platform === 'kick') {
			// Redirect to manual link page
			redirect(303, `/auth/link?platform=kick&next=/app/platforms`);
		}

		// Determine scopes
		let scopes: string[] = [];
		if (scopeType === 'full' || !scopeType) {
			scopes = PLATFORM_SCOPES[platform as 'twitch' | 'youtube'].full;
		} else {
			scopes = PLATFORM_SCOPES[platform as 'twitch' | 'youtube'].auth;
		}

		// Create OAuth state for redirect back to platforms page
		const oauthState = createOAuthState(user.id, '/app/platforms');

		const redirectTo = `${url.origin}/auth/confirm/supabase`;

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: provider as 'google' | 'twitch',
			options: {
				redirectTo,
				queryParams: {
					scope: scopes.join(' ')
				},
				// Pass state for redirect validation after OAuth callback
				state: oauthState
			} as { redirectTo: string; queryParams: { scope: string }; state: string }
		});

		if (error) {
			if (dev) {
				console.error('[DEV] initiatePlatformConnect error:', error);
			}
			return fail(500, { error: 'Failed to initiate OAuth flow' });
		}

		if (data.url) {
			redirect(303, data.url);
		}

		return fail(500, { error: 'Failed to generate OAuth URL' });
	}
};
