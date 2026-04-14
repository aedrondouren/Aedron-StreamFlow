import type { Tables } from '$lib/supabase/database.types';

export interface PlatformData {
	auth: Tables<'user_auth'>;
	user_info?: Tables<'user_info'>;
	login?: string | null;
	display_name?: string | null;
	profile_image_url?: string | null;
	broadcaster_type?: string | null;
}

/**
 * Merges platform auth data with user info data
 * Creates a map of user info by platform for efficient lookup
 */
export function mergePlatformData(
	auths: Tables<'user_auth'>[],
	infos: Tables<'user_info'>[]
): PlatformData[] {
	const infoMap = new Map(infos.map((info) => [info.platform, info]));

	return auths.map((auth) => {
		const info = infoMap.get(auth.platform);
		return {
			auth,
			user_info: info,
			login: info?.login,
			display_name: info?.display_name,
			profile_image_url: info?.profile_image_url,
			broadcaster_type: info?.broadcaster_type
		};
	});
}

/**
 * Creates a map of user info by platform for efficient lookup
 */
export function createInfoMap(infos: Tables<'user_info'>[]): Map<string, Tables<'user_info'>> {
	return new Map(infos.map((info) => [info.platform, info]));
}

/**
 * Checks if a platform is linked based on the list of linked platforms
 */
export function isPlatformLinked(linkedPlatforms: string[], platform: string): boolean {
	return linkedPlatforms.includes(platform);
}
