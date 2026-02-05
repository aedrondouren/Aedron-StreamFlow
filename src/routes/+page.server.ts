import { getStreamTitle, setStreamTitle } from '$lib/server/twitch';
import { getUser } from '$lib/server/users';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	const user = await getUser(cookies);

	if (user === null) return redirect(303, '/');

	const twitchTitle = typeof user.twitch === 'undefined' ? null : await getStreamTitle(user.twitch);

	return { twitchTitle };
}) satisfies PageServerLoad;

export const actions = {
	'update-title': async ({ request, cookies }) => {
		const data = await request.formData();
		const title = data.get('title');

		const user = await getUser(cookies);

		if (user === null || typeof user.twitch == 'undefined' || title === null) return;

		await setStreamTitle(user.twitch, title as string);
	}
} satisfies Actions;
