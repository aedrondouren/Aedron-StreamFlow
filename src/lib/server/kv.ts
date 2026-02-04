import { kvsLocalStorage } from '@kvs/node-localstorage';

export type UserData = {
	lastState: string;
	twitch_auth?: {
		access_token: string;
		expires_in: number;
		refresh_token: string;
		scope?: string[];
		token_type: string;
	};
};

export const users = await kvsLocalStorage<Record<string, UserData>>({
	name: 'Users',
	version: 1
});
