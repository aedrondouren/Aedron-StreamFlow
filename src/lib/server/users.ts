import { kvsLocalStorage } from '@kvs/node-localstorage';
import type { Cookies } from '@sveltejs/kit';
import type { UUID } from 'crypto';
import type { TwitchMetadata } from './twitch';

export type UserData = {
	uuid: UUID;

	twitch?: TwitchMetadata;
};

export const users = await kvsLocalStorage<Record<UUID, UserData>>({
	name: 'user-data',
	version: 1
});

export function getUserUUID(cookies: Cookies) {
	return cookies.get('user-id') as UUID | undefined;
}

export async function syncUser(cookies: Cookies) {
	let uuid = getUserUUID(cookies);

	if (typeof uuid === 'undefined') {
		uuid = crypto.randomUUID();
		cookies.set('user-id', uuid, { path: '/' });
	}

	if (!(await users.has(uuid))) {
		await users.set(uuid, { uuid });
	}
}

export async function getUser(cookies: Cookies) {
	const uuid = getUserUUID(cookies);

	if (typeof uuid === 'undefined') return null;

	return (await users.get(uuid)) ?? null;
}

export async function saveUser(user: UserData) {
	await users.set(user.uuid, user);
}
