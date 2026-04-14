import type { TablesInsert } from '$lib/supabase/database.types';

// Twitch API response types
export interface TwitchUser {
	id: string;
	login: string;
	display_name: string;
	profile_image_url: string;
	broadcaster_type: string;
}

// YouTube API response types
export interface YouTubeChannel {
	id: string;
	snippet?: {
		title?: string;
		customUrl?: string;
		thumbnails?: {
			default?: {
				url?: string;
			};
		};
	};
}

// Kick API response types
export interface KickUser {
	user_id?: string;
	id?: string;
	username?: string;
	login?: string;
	name?: string;
	display_name?: string;
	profile_picture?: string;
	profile_image_url?: string;
}

/**
 * Transforms Twitch API user data to database schema
 */
export function transformTwitchUser(
	userId: string,
	twitchUser: TwitchUser
): TablesInsert<'user_info'> {
	return {
		user_id: userId,
		platform: 'twitch',
		platform_user_id: twitchUser.id,
		login: twitchUser.login,
		display_name: twitchUser.display_name,
		profile_image_url: twitchUser.profile_image_url,
		broadcaster_type: twitchUser.broadcaster_type || ''
	};
}

/**
 * Transforms YouTube API channel data to database schema
 */
export function transformYouTubeChannel(
	userId: string,
	channel: YouTubeChannel
): TablesInsert<'user_info'> {
	return {
		user_id: userId,
		platform: 'youtube',
		platform_user_id: channel.id,
		login: channel.snippet?.customUrl?.replace('@', '') || '',
		display_name: channel.snippet?.title || '',
		profile_image_url: channel.snippet?.thumbnails?.default?.url || '',
		broadcaster_type: ''
	};
}

/**
 * Transforms Kick API user data to database schema
 */
export function transformKickUser(userId: string, kickUser: KickUser): TablesInsert<'user_info'> {
	return {
		user_id: userId,
		platform: 'kick',
		platform_user_id: kickUser.user_id || kickUser.id || '',
		login: kickUser.username || kickUser.login || '',
		display_name: kickUser.name || kickUser.display_name || '',
		profile_image_url: kickUser.profile_picture || kickUser.profile_image_url || '',
		broadcaster_type: ''
	};
}
