import { getUser, saveUser } from '$lib/server/users';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	const user = await getUser(cookies);

	if (user === null) return redirect(303, '/');

	const twitch = typeof user.twitch === 'undefined' ? null : user.twitch.data;

	return { twitch };
}) satisfies PageServerLoad;

export const actions = {
	'twitch-logout': async ({ cookies }) => {
		const user = await getUser(cookies);

		if (user !== null) {
			delete user.twitch;
			saveUser(user);
		}
	}
} satisfies Actions;
