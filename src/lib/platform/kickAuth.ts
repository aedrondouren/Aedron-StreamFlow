import { dev } from '$app/environment';
import { PRIVATE_KICK_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_KICK_CLIENT_ID } from '$env/static/public';
import { parseScopes } from './scopes';
import type { PlatformOAuthToken } from './types';

export type KickOAuthToken = PlatformOAuthToken;

export interface KickUser {
	user_id: string;
	username: string;
	name: string;
	profile_picture: string;
}

const KICK_AUTH_URL = 'https://kick.com/oauth/authorize';
const KICK_TOKEN_URL = 'https://kick.com/oauth/token';
const KICK_API_URL = 'https://api.kick.com/public/v1';

export const KICK_SCOPES = {
	USER_READ: 'user:read'
} as const;

export function getKickAuthorizeUrl(
	redirectUri: string,
	state: string,
	scope: string[] = [KICK_SCOPES.USER_READ]
): string {
	const params = new URLSearchParams({
		client_id: PUBLIC_KICK_CLIENT_ID,
		redirect_uri: redirectUri,
		response_type: 'code',
		scope: scope.join(' '),
		state
	});
	return `${KICK_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(
	code: string,
	redirectUri: string
): Promise<KickOAuthToken | null> {
	const response = await fetch(KICK_TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: PUBLIC_KICK_CLIENT_ID,
			client_secret: PRIVATE_KICK_CLIENT_SECRET,
			code,
			grant_type: 'authorization_code',
			redirect_uri: redirectUri
		})
	});

	if (!response.ok) {
		if (dev) {
			console.error('[Kick Token Error]', { status: response.status });
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

export async function refreshToken(refreshToken: string): Promise<KickOAuthToken | null> {
	const response = await fetch(KICK_TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: PUBLIC_KICK_CLIENT_ID,
			client_secret: PRIVATE_KICK_CLIENT_SECRET,
			grant_type: 'refresh_token',
			refresh_token: refreshToken
		})
	});

	if (!response.ok) {
		if (dev) {
			console.error('[Kick Refresh Error]', { status: response.status });
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

export async function getCurrentUser(accessToken: string): Promise<KickUser | null> {
	const response = await fetch(`${KICK_API_URL}/users`, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (!response.ok) {
		if (dev) {
			console.error('[Kick User Error]', { status: response.status });
		}
		return null;
	}

	const data = await response.json();
	const user = data.data?.[0];
	if (!user) {
		if (dev) {
			console.error('[Kick User Error] No user data returned');
		}
		return null;
	}

	return {
		user_id: user.user_id || user.id,
		username: user.username || user.login || '',
		name: user.name || user.display_name || '',
		profile_picture: user.profile_picture || user.profile_image_url || ''
	};
}
