import { TwitchClient } from '$lib/server/clients/streamClient';
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
	},
	'test-user': async ({ cookies }) => {
		const user = await getUser(cookies);

		if (user === null || user.twitch === undefined) return;

		const client = new TwitchClient(user.twitch.auth.access_token);

		const userDataResult = await client.getUsers();

		if (userDataResult instanceof Error) throw userDataResult;

		const userData = Array.isArray(userDataResult) ? userDataResult[0] : userDataResult;

		console.log(userData);

		const channelDataResult = await client.getChannels(userData.id);

		if (channelDataResult instanceof Error) throw channelDataResult;

		const channelData = Array.isArray(channelDataResult) ? channelDataResult[0] : channelDataResult;

		console.log(channelData);
	}
} satisfies Actions;
