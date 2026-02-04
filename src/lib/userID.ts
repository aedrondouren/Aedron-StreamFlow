import type { Cookies } from '@sveltejs/kit';

const USER_KEY = 'user-id';

export function setUserID(cookies: Cookies) {
	let userID = cookies.get(USER_KEY);

	if (typeof userID === 'undefined') {
		userID = crypto.randomUUID();

		cookies.set(USER_KEY, userID, { path: '/' });
	}

	return userID;
}

export function getUserID(cookies: Cookies) {
	return cookies.get(USER_KEY);
}
