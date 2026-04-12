import { fail, redirect, type Actions } from '@sveltejs/kit';
import { refreshToken, getCurrentUser } from '$lib/platform/twitchAuth';

export const actions: Actions = {
	unlink: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const platform = formData.get('platform') as string;

		if (!platform) {
			return fail(400, { error: 'Platform is required' });
		}

		const {
			data: { user }
		} = await supabase.auth.getUser();
		if (!user) {
			return fail(401, { error: 'Unauthorized' });
		}

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

		redirect(303, '/app/platforms');
	},

	refresh: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const platform = formData.get('platform') as string;

		if (!platform) {
			return fail(400, { error: 'Platform is required' });
		}

		const {
			data: { user }
		} = await supabase.auth.getUser();
		if (!user) {
			return fail(401, { error: 'Unauthorized' });
		}

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

		let accessToken = authData.access_token;

		// Refresh token if we have a refresh token
		if (authData.refresh_token) {
			const refreshed = await refreshToken(authData.refresh_token);
			if (refreshed) {
				accessToken = refreshed.access_token;

				// Update stored tokens
				await supabase
					.from('user_auth')
					.update({
						access_token: refreshed.access_token,
						refresh_token: refreshed.refresh_token,
						expires_in: refreshed.expires_in,
						updated_at: new Date().toISOString()
					})
					.eq('id', authData.id);
			}
		}

		// Fetch fresh user data from Twitch
		if (platform === 'twitch') {
			const twitchUser = await getCurrentUser(accessToken);
			if (!twitchUser) {
				return fail(500, { error: 'Failed to fetch user data from Twitch' });
			}

			// Update user_info with fresh data
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

			// Return fresh data for optimistic update
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

		return fail(400, { error: 'Unsupported platform' });
	}
};
