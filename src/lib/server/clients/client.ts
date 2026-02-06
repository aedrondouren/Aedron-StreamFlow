// type LiveData<T> = {
// 	data: T;
// 	expires_at: number;
// };

// Twitch

/**
 * If you don’t specify IDs or login names, the request
 * returns information about the user in the access token
 * if you specify a user access token.
 *
 * -H 'Authorization: Bearer cfabdegwdoklmawdzdo98xt2fo512y'
 * -H 'Client-Id: uo6dggojyb8d6soh92zknwmi5ej1q2'
 */
// const getUsers = (params: { id?: string[]; login: string[] }) => ({
// 	data: [
// 		{
// 			id: '141981764',
// 			login: 'twitchdev',
// 			display_name: 'TwitchDev',
// 			type: '',
// 			broadcaster_type: 'partner',
// 			description:
// 				'Supporting third-party developers building Twitch integrations from chatbots to game integrations.',
// 			profile_image_url:
// 				'https://static-cdn.jtvnw.net/jtv_user_pictures/8a6381c7-d0c0-4576-b179-38bd5ce1d6af-profile_image-300x300.png',
// 			offline_image_url:
// 				'https://static-cdn.jtvnw.net/jtv_user_pictures/3f13ab61-ec78-4fe6-8481-8682cb3b0ac2-channel_offline_image-1920x1080.png',
// 			email: 'not-real@email.com',
// 			created_at: '2016-12-14T20:32:28Z'
// 		}
// 	]
// });

/**
 * -H 'Authorization: Bearer 2gbdx6oar67tqtcmt49t3wpcgycthx'
 * -H 'Client-Id: wbmytr93xzw8zbg0p1izqyzzc5mbiz'
 */
// const getChannelInformation = (params: { broadcaster_id: string[] }) => ({
// 	data: [
// 		{
// 			broadcaster_id: '141981764',
// 			broadcaster_login: 'twitchdev',
// 			broadcaster_name: 'TwitchDev',
// 			broadcaster_language: 'en',
// 			game_id: '509670',
// 			game_name: 'Science & Technology',
// 			title: 'TwitchDev Monthly Update // May 6, 2021',
// 			delay: 0,
// 			tags: ['DevsInTheKnow'],
// 			content_classification_labels: ['Gambling', 'DrugsIntoxication', 'MatureGame'],
// 			is_branded_content: false
// 		}
// 	]
// });

/**
 * -H 'Authorization: Bearer 2gbdx6oar67tqtcmt49t3wpcgycthx'
 * -H 'Client-Id: wbmytr93xzw8zbg0p1izqyzzc5mbiz'
 */
// const getStreams = (params: {
// 	user_id?: string | string[];
// 	user_login?: string | string[];
// 	game_id?: string | string[];
// 	type?: 'all' | 'live';
// 	language?: string | string[];
// 	first?: number;
// 	before?: string;
// 	after?: string;
// }) => ({
// 	data: [
// 		{
// 			id: '123456789',
// 			user_id: '98765',
// 			user_login: 'sandysanderman',
// 			user_name: 'SandySanderman',
// 			game_id: '494131',
// 			game_name: 'Little Nightmares',
// 			type: 'live',
// 			title: 'hablamos y le damos a Little Nightmares 1',
// 			tags: ['Español'],
// 			viewer_count: 78365,
// 			started_at: '2021-03-10T15:04:21Z',
// 			language: 'es',
// 			thumbnail_url:
// 				'https://static-cdn.jtvnw.net/previews-ttv/live_user_auronplay-{width}x{height}.jpg',
// 			tag_ids: [],
// 			is_mature: false
// 		}
// 	],
// 	pagination: {
// 		cursor:
// 			'eyJiIjp7IkN1cnNvciI6ImV5SnpJam8zT0RNMk5TNDBORFF4TlRjMU1UY3hOU3dpWkNJNlptRnNjMlVzSW5RaU9uUnlkV1Y5In0sImEiOnsiQ3Vyc29yIjoiZXlKeklqb3hOVGs0TkM0MU56RXhNekExTVRZNU1ESXNJbVFpT21aaGJITmxMQ0owSWpwMGNuVmxmUT09In19'
// 	}
// });

// Kick

/**
 * If no user IDs are specified, the information for the currently
 * authorised user will be returned by default.
 *
 * Host: api.kick.com
 * Authorization: Bearer YOUR_OAUTH2_TOKEN
 * Accept: *\/*
 */
// const getUsers = (params: { id?: number[] }) => ({
// 	data: [
// 		{
// 			email: 'john.doe@example.com',
// 			name: 'John Doe',
// 			profile_picture: 'https://kick.com/img/default-profile-pictures/default-avatar-2.webp',
// 			user_id: 123
// 		}
// 	],
// 	message: 'text'
// });

/**
 * If no user IDs are specified, the information for the currently
 * authorised user will be returned by default.
 *
 * Host: api.kick.com
 * Authorization: Bearer YOUR_OAUTH2_TOKEN
 * Accept: *\/*
 */
// const getChannels = (params: { broadcaster_user_id?: number[]; slug?: string[] }) => ({
// 	data: [
// 		{
// 			active_subscribers_count: 150,
// 			banner_picture: 'https://kick.com/img/default-banner-pictures/default2.jpeg',
// 			broadcaster_user_id: 123,
// 			canceled_subscribers_count: 25,
// 			category: {
// 				id: 101,
// 				name: 'Old School Runescape',
// 				thumbnail: 'https://kick.com/img/categories/old-school-runescape.jpeg'
// 			},
// 			channel_description: 'Channel description',
// 			slug: 'john-doe',
// 			stream: {
// 				custom_tags: ['tag1', 'tag2'],
// 				is_live: true,
// 				is_mature: true,
// 				key: 'super-secret-stream-key',
// 				language: 'en',
// 				start_time: '0001-01-01T00:00:00Z',
// 				thumbnail: 'https://kick.com/img/default-thumbnail-pictures/default2.jpeg',
// 				url: 'rtmps://stream.kick.com/1234567890',
// 				viewer_count: 67
// 			},
// 			stream_title: 'My first stream'
// 		}
// 	],
// 	message: 'text'
// });

/**
 * Host: api.kick.com
 * Authorization: Bearer YOUR_OAUTH2_TOKEN
 * Accept: *\/*
 */
// const getLivestreams = (params: {
// 	broadcaster_user_id?: number[];
// 	category_id?: number;
// 	language?: string;
// 	limit?: number;
// 	sort?: 'viewer_count' | 'started_at';
// }) => ({
// 	data: [
// 		{
// 			broadcaster_user_id: 123,
// 			category: {
// 				id: 101,
// 				name: 'Old School Runescape',
// 				thumbnail: 'https://kick.com/img/categories/old-school-runescape.jpeg'
// 			},
// 			channel_id: 456,
// 			custom_tags: ['tag1', 'tag2'],
// 			has_mature_content: true,
// 			language: 'en',
// 			profile_picture: 'https://kick.com/img/default-profile-pictures/default2.jpeg',
// 			slug: 'john-doe',
// 			started_at: '0001-01-01T00:00:00Z',
// 			stream_title: 'My first stream',
// 			thumbnail: 'https://kick.com/img/default-thumbnail-pictures/default2.jpeg',
// 			viewer_count: 73
// 		}
// 	],
// 	message: 'text'
// });
