import { refreshToken as refreshKickToken } from './kickAuth';
import { refreshToken as refreshTwitchToken } from './twitchAuth';
import { refreshToken as refreshYouTubeToken } from './youtubeAuth';

export interface TokenResponse {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	scope: string[];
}

/**
 * Refreshes platform token based on platform type
 */
export async function refreshPlatformToken(
	platform: string,
	refreshToken: string
): Promise<TokenResponse | null> {
	switch (platform) {
		case 'twitch':
			return refreshTwitchToken(refreshToken);
		case 'youtube':
			return refreshYouTubeToken(refreshToken);
		case 'kick':
			return refreshKickToken(refreshToken);
		default:
			return null;
	}
}
