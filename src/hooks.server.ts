import { syncUser } from '$lib/server/users';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ resolve, event }) => {
	syncUser(event.cookies);

	return await resolve(event);
};
