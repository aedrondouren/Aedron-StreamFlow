import { users } from '$lib/server/kv';
import { getUserID } from '$lib/userID';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	const userID = getUserID(cookies);

	if (typeof userID === 'undefined') return redirect(303, '/');

	const userData = await users.get(userID);

	if (typeof userData === 'undefined') return redirect(303, '/');

	const connected = 'twitch_auth' in userData;

	if (!connected) {
		userData.lastState = crypto.randomUUID();
		await users.set(userID, userData);
	}

	const twitch = connected
		? ({
				connected: true,
				scope: userData.twitch_auth?.scope
			} as const)
		: ({
				connected: false,
				state: userData.lastState
			} as const);

	return { twitch };
}) satisfies PageServerLoad;
