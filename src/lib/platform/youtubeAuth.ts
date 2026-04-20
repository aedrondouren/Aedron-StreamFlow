import { dev } from '$app/environment';
import { PRIVATE_GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';
import { parseScopes } from './scopes';
import type { PlatformOAuthToken } from './types';

export type YouTubeOAuthToken = PlatformOAuthToken;

export interface YouTubeChannel {
	id: string;
	title: string;
	customUrl: string;
	thumbnailUrl: string;
}

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

export const YOUTUBE_SCOPES = {
	YOUTUBE_READONLY: 'https://www.googleapis.com/auth/youtube.readonly',
	PROFILE: 'profile',
	EMAIL: 'email'
} as const;

export function getYouTubeAuthorizeUrl(
	redirectUri: string,
	state: string,
	scope: string[] = [YOUTUBE_SCOPES.YOUTUBE_READONLY, YOUTUBE_SCOPES.PROFILE, YOUTUBE_SCOPES.EMAIL]
): string {
	const params = new URLSearchParams({
		client_id: PUBLIC_GOOGLE_CLIENT_ID,
		redirect_uri: redirectUri,
		response_type: 'code',
		scope: scope.join(' '),
		state,
		access_type: 'offline',
		prompt: 'consent'
	});
	return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(
	code: string,
	redirectUri: string
): Promise<YouTubeOAuthToken | null> {
	const response = await fetch(GOOGLE_TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: PUBLIC_GOOGLE_CLIENT_ID,
			client_secret: PRIVATE_GOOGLE_CLIENT_SECRET,
			code,
			grant_type: 'authorization_code',
			redirect_uri: redirectUri
		})
	});

	if (!response.ok) {
		if (dev) {
			console.error('[YouTube Token Error]', { status: response.status });
		}
		return null;
	}

	const data = await response.json();
	return {
		access_token: data.access_token,
		refresh_token: data.refresh_token,
		expires_in: data.expires_in,
		scope: parseScopes(data.scope)
	};
}

export async function refreshToken(refreshToken: string): Promise<YouTubeOAuthToken | null> {
	const response = await fetch(GOOGLE_TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: PUBLIC_GOOGLE_CLIENT_ID,
			client_secret: PRIVATE_GOOGLE_CLIENT_SECRET,
			grant_type: 'refresh_token',
			refresh_token: refreshToken
		})
	});

	if (!response.ok) {
		if (dev) {
			console.error('[YouTube Refresh Error]', { status: response.status });
		}
		return null;
	}

	const data = await response.json();
	return {
		access_token: data.access_token,
		refresh_token: data.refresh_token || refreshToken,
		expires_in: data.expires_in,
		scope: parseScopes(data.scope)
	};
}

export async function getCurrentChannel(accessToken: string): Promise<YouTubeChannel | null> {
	const response = await fetch(`${YOUTUBE_API_URL}/channels?part=snippet&mine=true`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (!response.ok) {
		if (dev) {
			console.error('[YouTube Channel Error]', { status: response.status });
		}
		return null;
	}

	const data = await response.json();
	const channel = data.items?.[0];
	if (!channel) {
		if (dev) {
			console.error('[YouTube Channel Error] No channel data returned');
		}
		return null;
	}

	return {
		id: channel.id,
		title: channel.snippet?.title || '',
		customUrl: channel.snippet?.customUrl?.replace('@', '') || '',
		thumbnailUrl: channel.snippet?.thumbnails?.default?.url || ''
	};
}
