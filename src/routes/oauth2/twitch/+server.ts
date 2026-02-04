import { users } from '$lib/server/kv';
import { getUserID } from '$lib/userID';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url: { searchParams }, cookies }) => {
	const userID = getUserID(cookies);

	if (typeof userID === 'undefined') return redirect(303, '/');

	const userData = await users.get(userID);

	if (typeof userData === 'undefined') return redirect(303, '/');

	const code = searchParams.get('code');
	const state = searchParams.get('state');

	if (code === null || state !== userData.lastState) return redirect(303, '/');

	console.log('STATE: ', state);
	console.log('CODE: ', code);

	return redirect(303, '/config');
};
