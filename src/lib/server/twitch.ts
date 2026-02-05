import { PRIVATE_TWITCH_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_TWITCH_CLIENT_ID } from '$env/static/public';

export type TwitchMetadata = {
	data: TwitchData;
	auth: TwitchAuth;
};

export type TwitchData = {
	id: string;
	display_name: string;
	profile_image_url: string;
};

export type TwitchAuth = {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	scope?: string[];
	token_type: string;
};

export async function getAuthToken(code: string) {
	const params = new URLSearchParams({
		client_id: PUBLIC_TWITCH_CLIENT_ID,
		client_secret: PRIVATE_TWITCH_CLIENT_SECRET,
		code,
		grant_type: 'authorization_code',
		redirect_uri: 'http://localhost:5173/config'
	});

	const response = await fetch('https://id.twitch.tv/oauth2/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: params.toString()
	});

	if (response.ok) {
		return (await response.json()) as TwitchAuth;
	}

	return null;
}

export async function getUserData(token: string) {
	const response = await fetch('https://api.twitch.tv/helix/users', {
		method: 'GET',
		headers: {
			'Client-Id': PUBLIC_TWITCH_CLIENT_ID,
			Authorization: `Bearer ${token}`
		}
	});

	if (response.ok) {
		const { id, display_name, profile_image_url } = (await response.json()).data[0] as TwitchData;

		return { id, display_name, profile_image_url } as TwitchData;
	}

	return null;
}

export async function getStreamTitle(user: TwitchMetadata) {
	const {
		data: { id },
		auth: { access_token }
	} = user;

	const params = new URLSearchParams({ broadcaster_id: id });

	const response = await fetch(`https://api.twitch.tv/helix/channels?${params.toString()}`, {
		method: 'GET',
		headers: {
			'Client-Id': PUBLIC_TWITCH_CLIENT_ID,
			Authorization: `Bearer ${access_token}`
		}
	});

	if (response.ok) {
		const { title } = (await response.json()).data[0];

		return title as string;
	}

	return null;
}

export async function setStreamTitle(user: TwitchMetadata, title: string) {
	const {
		data: { id },
		auth: { access_token }
	} = user;

	const params = new URLSearchParams({ broadcaster_id: id });

	const response = await fetch(`https://api.twitch.tv/helix/channels?${params.toString()}`, {
		method: 'PATCH',
		headers: {
			'Client-Id': PUBLIC_TWITCH_CLIENT_ID,
			Authorization: `Bearer ${access_token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ title })
	});

	console.log(response);
}
