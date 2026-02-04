import { users } from '$lib/server/kv';
import { setUserID } from '$lib/userID';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ resolve, event }) => {
	const userID = setUserID(event.cookies);

	if (!(await users.has(userID))) {
		await users.set(userID, {
			lastState: crypto.randomUUID()
		});
	}

	return await resolve(event);
};
