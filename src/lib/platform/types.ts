/**
 * Shared types for platform integration
 */

export interface PlatformOAuthToken {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	scope: string[];
}

export type Platform = 'twitch' | 'youtube' | 'kick';
