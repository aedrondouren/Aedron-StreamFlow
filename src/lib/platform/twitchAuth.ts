import { PUBLIC_TWITCH_CLIENT_ID } from '$env/static/public';
import { PRIVATE_TWITCH_CLIENT_SECRET } from '$env/static/private';
import { parseScopes } from './scopes';

export interface TwitchOAuthToken {
	access_token: string;
	refresh_token: string;
	expires_in: number;
	scope: string[];
}

export interface TwitchUser {
	id: string;
	login: string;
	display_name: string;
	profile_image_url: string;
	broadcaster_type: string;
}

const TWITCH_AUTH_URL = 'https://id.twitch.tv/oauth2/authorize';
const TWITCH_TOKEN_URL = 'https://id.twitch.tv/oauth2/token';
const TWITCH_API_URL = 'https://api.twitch.tv/helix';

export const TWITCH_SCOPES = {
	USER_READ_EMAIL: 'user:read:email'
} as const;

export function getTwitchAuthorizeUrl(
	redirectUri: string,
	state: string,
	scope: string[] = [TWITCH_SCOPES.USER_READ_EMAIL]
): string {
	const params = new URLSearchParams({
		client_id: PUBLIC_TWITCH_CLIENT_ID,
		redirect_uri: redirectUri,
		response_type: 'code',
		scope: scope.join(' '),
		state
	});
	return `${TWITCH_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(
	code: string,
	redirectUri: string
): Promise<TwitchOAuthToken | null> {
	const response = await fetch(TWITCH_TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: PUBLIC_TWITCH_CLIENT_ID,
			client_secret: PRIVATE_TWITCH_CLIENT_SECRET,
			code,
			grant_type: 'authorization_code',
			redirect_uri: redirectUri
		})
	});

	if (!response.ok) {
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

export async function refreshToken(refreshToken: string): Promise<TwitchOAuthToken | null> {
	const response = await fetch(TWITCH_TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: PUBLIC_TWITCH_CLIENT_ID,
			client_secret: PRIVATE_TWITCH_CLIENT_SECRET,
			grant_type: 'refresh_token',
			refresh_token: refreshToken
		})
	});

	if (!response.ok) {
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

export async function getCurrentUser(accessToken: string): Promise<TwitchUser | null> {
	const response = await fetch(`${TWITCH_API_URL}/users`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Client-Id': PUBLIC_TWITCH_CLIENT_ID
		}
	});

	if (!response.ok) {
		return null;
	}

	const data = await response.json();
	const user = data.data?.[0];
	if (!user) {
		return null;
	}

	return {
		id: user.id,
		login: user.login,
		display_name: user.display_name,
		profile_image_url: user.profile_image_url,
		broadcaster_type: user.broadcaster_type
	};
}
