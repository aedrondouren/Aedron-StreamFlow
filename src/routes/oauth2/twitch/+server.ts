import { getAuthToken, getUserData } from '$lib/server/twitch';
import { getUser, saveUser } from '$lib/server/users';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url: { searchParams }, cookies }) => {
	const user = await getUser(cookies);
	const authCode = searchParams.get('code');

	if (user === null || authCode === null) return redirect(303, '/');

	const tokenData = await getAuthToken(authCode);

	if (tokenData === null) return redirect(303, '/');

	const userData = await getUserData(tokenData.access_token);

	if (userData === null) return redirect(303, '/');

	user.twitch = {
		data: userData,
		auth: tokenData
	};

	saveUser(user);

	return redirect(303, '/config');
};
