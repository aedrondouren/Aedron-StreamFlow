import { PUBLIC_TWITCH_CLIENT_ID } from '$env/static/public';

export type TwitchUserType = 'admin' | 'global_mod' | 'staff' | '';

export type TwitchBroadcasterType = 'affiliate' | 'partner' | '';

export type TwitchCCLabel =
	| 'DebatedSocialIssuesAndPolitics'
	| 'DrugsIntoxication'
	| 'SexualThemes'
	| 'ViolentGraphic'
	| 'Gambling'
	| 'ProfanityVulgarity';

export interface StreamClient {
	// Twitch - users/id: '141981764',
	// Twitch - channels/broadcaster_id: '141981764',
	// Twitch - streams/user_id: '98765',
	// Kick - users/user_id: 123
	// Kick - channels/broadcaster_user_id: 123,
	// Kick - streams/broadcaster_user_id: 123,
	readonly id?: string | number;

	// Twitch - users/login: 'twitchdev',
	// Twitch - channels/broadcaster_login: 'twitchdev',
	// Twitch - streams/user_login: 'sandysanderman',
	// Kick - channels/slug: 'john-doe',
	// Kick - streams/slug: 'john-doe',
	readonly tag?: string;

	// Twitch - users/display_name: 'TwitchDev',
	// Twitch - channels/broadcaster_name: 'TwitchDev',
	// Twitch - streams/user_name: 'SandySanderman',
	// Kick - users/name: 'John Doe',
	readonly displayName?: string;

	// Twitch - users/type: '',
	readonly userType?: TwitchUserType;

	// Twitch - users/broadcaster_type: 'partner',
	readonly broadcasterType?: TwitchBroadcasterType;

	// Twitch - users/description: 'Supporting third-party developers building Twitch integrations from chatbots to game integrations.',
	// Kick - channels/channel_description: 'Channel description',
	readonly channelDescription?: string;

	// Twitch - users/profile_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/8a6381c7-d0c0-4576-b179-38bd5ce1d6af-profile_image-300x300.png',
	// Kick - users/profile_picture: 'https://kick.com/img/default-profile-pictures/default-avatar-2.webp',
	// Kick - streams/profile_picture: 'https://kick.com/img/default-profile-pictures/default2.jpeg',
	readonly profileImageURL?: string;

	// Twitch - users/offline_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/3f13ab61-ec78-4fe6-8481-8682cb3b0ac2-channel_offline_image-1920x1080.png',
	readonly offlineImageURL?: string;

	// Kick -   channels/banner_picture: 'https://kick.com/img/default-banner-pictures/default2.jpeg',
	readonly bannerImageURL?: string;

	// Twitch - users/email: 'not-real@email.com',
	// Kick - users/email: 'john.doe@example.com',
	readonly email?: string;

	// Twitch - users/created_at: '2016-12-14T20:32:28Z'
	readonly createdAt?: string;

	// Kick - streams/channel_id: 456,
	readonly channelID?: number;

	readonly stream?: {
		// Twitch - streams/id: '123456789',
		readonly id?: string;

		// Twitch - channels/broadcaster_language: 'en',
		// Twitch - streams/language: 'es',
		// Kick - channels/stream.language: 'en',
		// Kick - streams/language: 'en',
		readonly language?: string;

		readonly category?: {
			// Twitch - channels/game_id: '509670',
			// Twitch - streams/game_id: '494131',
			// Kick - channels/category.id: 101,
			// Kick - streams/category.id: 101,
			readonly id?: string | number;

			// Twitch - channels/game_name: 'Science & Technology',
			// Twitch - streams/game_name: 'Little Nightmares',
			// Kick - channels/category.name: 'Old School Runescape',
			// Kick - streams/category.name: 'Old School Runescape',
			readonly name?: string;

			// Kick - channels/category.thumbnail: 'https://kick.com/img/categories/old-school-runescape.jpeg'
			// Kick - streams/category.thumbnail: 'https://kick.com/img/categories/old-school-runescape.jpeg'
			readonly thumbnail?: string;
		};

		// Twitch - channels/title: 'TwitchDev Monthly Update // May 6, 2021',
		// Twitch - streams/title: 'hablamos y le damos a Little Nightmares 1',
		// Kick - channels/stream_title: 'My first stream'
		// Kick - streams/stream_title: 'My first stream',
		readonly title?: string;

		// Twitch - streams/thumbnail_url: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_auronplay-{width}x{height}.jpg',
		// Kick - channels/stream.thumbnail: 'https://kick.com/img/default-thumbnail-pictures/default2.jpeg',
		// Kick - streams/thumbnail: 'https://kick.com/img/default-thumbnail-pictures/default2.jpeg',
		readonly thumbnail?: string;

		// Twitch - channels/delay: 0,
		readonly delay?: number;

		// Twitch - channels/tags: ['DevsInTheKnow'],
		// Twitch - streams/tags: ['Español'],
		// Kick - channels/stream.custom_tags: ['tag1', 'tag2'],
		// Kick - streams/custom_tags: ['tag1', 'tag2'],
		readonly tags?: string[];

		// Twitch - streams/is_mature: false
		// Kick - channels/stream.is_mature: true,
		// Kick - streams/has_mature_content: true,
		readonly isMature?: boolean;

		// Twitch - channels/content_classification_labels: ['Gambling', 'DrugsIntoxication', 'MatureGame'],
		readonly ccLabel?: TwitchCCLabel[];

		// Twitch - channels/is_branded_content: false
		readonly isBranded?: boolean;

		// Twitch - streams/type: 'live',
		// Kick - channels/stream.is_live: true,
		readonly live?: 'live' | boolean;

		// Twitch - streams/started_at: '2021-03-10T15:04:21Z',
		// Kick - channels/stream.start_time: '0001-01-01T00:00:00Z',
		// Kick - streams/started_at: '0001-01-01T00:00:00Z',
		readonly startedAt?: string;

		// Twitch - streams/viewer_count: 78365,
		// Kick - channels/stream.viewer_count: 67
		// Kick - streams/viewer_count: 73
		readonly views?: number;

		// Kick - channels/stream.url: 'rtmps://stream.kick.com/1234567890',
		readonly url?: string;

		// Kick - channels/stream.key: 'super-secret-stream-key',
		readonly streamKey?: string;
	};

	readonly subscribers?: {
		// Kick - channels/active_subscribers_count: 150,
		readonly total?: number;

		// Kick - channels/canceled_subscribers_count: 25,
		readonly cancelled?: number;
	};
}

export class ExcessParamsError extends Error {
	readonly message!: `Too Many Params - ${number}/${number}`;

	constructor(current: number, total: number) {
		super(`Too Many Params - ${current}/${total}`);
	}
}

export class HTTP400Error extends Error {
	readonly message!: '400 - Bad Request';

	constructor() {
		super('400 - Bad Request');
	}
}

export class HTTP401Error extends Error {
	readonly message!: '401 - Unauthorized';

	constructor() {
		super('401 - Unauthorized');
	}
}

export class HTTP429Error extends Error {
	readonly message!: '429 - Too Many Requests';

	constructor() {
		super('429 - Too Many Requests');
	}
}

export class HTTP500Error extends Error {
	readonly message!: '500 - Internal Server Error';

	constructor() {
		super('500 - Internal Server Error');
	}
}

export type TwitchGetUserParams = {
	id?: string[];
	login?: string[];
};

export type TwitchGetUserResult = {
	id: string;
	login: string;
	display_name: string;
	type: 'admin' | 'global_mod' | 'staff' | '';
	broadcaster_type: 'affiliate' | 'partner' | '';
	description: string;
	profile_image_url: string;
	offline_image_url: string;
	// view_count: number; - No longer valid
	email?: string; // user:read:email
	created_at: string;
};

export type TwitchGetChannelResult = {
	broadcaster_id: string;
	broadcaster_login: string;
	broadcaster_name: string;
	broadcaster_language: string;
	game_id: string;
	game_name: string;
	title: string;
	delay: number;
	tags: string[];
	content_classification_labels: TwitchCCLabel[];
	is_branded_content: boolean;
};

export type TwitchGetStreamResult = {
	id: string;
	user_id: string;
	user_login: string;
	user_name: string;
	game_id: string;
	game_name: string;
	type: string;
	title: string;
	tags: string[];
	viewer_count: number;
	started_at: string;
	language: string;
	thumbnail_url: string;
	// tag_ids: []; - No longer valid
	is_mature: boolean;
};

export class TwitchClient implements StreamClient {
	#token: string;

	async getUsers(params?: TwitchGetUserParams) {
		const totalParams = params?.id?.length ?? 0 + (params?.login?.length ?? 0);

		if (totalParams > 100) return new ExcessParamsError(totalParams, 100);

		let i: number = 0;
		const paramsArray: string[][] = [];

		params?.id?.forEach((id) => {
			paramsArray[i++] = ['id', id];
		});

		params?.login?.forEach((login) => {
			paramsArray[i++] = ['login', login];
		});

		const searchParams = new URLSearchParams(paramsArray);

		const response = await fetch(`https://api.twitch.tv/helix/users?${searchParams.toString()}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${this.#token}`,
				'Client-Id': PUBLIC_TWITCH_CLIENT_ID
			}
		});

		if (response.ok) {
			const { data } = (await response.json()) as { data: TwitchGetUserResult[] };

			data.forEach((d) => {
				delete (d as { view_count?: 0 }).view_count;
			});

			if (data.length === 1) return data[0];
			return data;
		}

		switch (response.status) {
			case 400:
				return new HTTP400Error();
			case 401:
				return new HTTP401Error();
			default:
				throw new Error('Unhandled in "getUsers()"');
		}
	}

	async getChannels(...ids: string[]) {
		const totalParams = ids.length;

		if (totalParams > 100) return new ExcessParamsError(totalParams, 100);

		const paramsArray = ids.map((id) => ['broadcaster_id', id]);

		const searchParams = new URLSearchParams(paramsArray);

		const response = await fetch(
			`https://api.twitch.tv/helix/channels?${searchParams.toString()}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${this.#token}`,
					'Client-Id': PUBLIC_TWITCH_CLIENT_ID
				}
			}
		);

		if (response.ok) {
			const { data } = (await response.json()) as { data: TwitchGetChannelResult[] };

			if (data.length === 1) return data[0];
			return data;
		}

		switch (response.status) {
			case 400:
				return new HTTP400Error();
			case 401:
				return new HTTP401Error();
			case 429:
				return new HTTP429Error();
			case 500:
				return new HTTP500Error();
			default:
				throw new Error('Unhandled in "getChannels()"');
		}
	}

	async getStreams() {}

	constructor(token: string) {
		this.#token = token;
	}
}

// export function mergeClients<T extends StreamClient[]>(clients: T) {
// 	return clients;
// }
