import type { Database } from '$lib/supabase/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Saves platform authentication data to the database
 */
export async function savePlatformAuth(
	client: SupabaseClient<Database>,
	data: {
		user_id: string;
		platform: string;
		platform_user_id: string;
		access_token: string;
		refresh_token: string;
		expires_in: number;
		scope: string;
	}
): Promise<void> {
	const expiresAt = Math.floor(Date.now() / 1000) + data.expires_in;

	const { error } = await client.from('user_auth').upsert({
		user_id: data.user_id,
		platform: data.platform,
		platform_user_id: data.platform_user_id,
		access_token: data.access_token,
		refresh_token: data.refresh_token,
		expires_in: data.expires_in,
		expires_at: expiresAt,
		scope: data.scope
	});

	if (error) {
		throw new Error(`Failed to save platform auth: ${error.message}`);
	}
}

/**
 * Saves platform user info to the database
 */
export async function savePlatformUserInfo(
	client: SupabaseClient<Database>,
	data: {
		user_id: string;
		platform: string;
		platform_user_id: string;
		login?: string;
		display_name?: string;
		profile_image_url?: string;
		broadcaster_type?: string;
	}
): Promise<void> {
	const { error } = await client.from('user_info').upsert({
		user_id: data.user_id,
		platform: data.platform,
		platform_user_id: data.platform_user_id,
		login: data.login || '',
		display_name: data.display_name || '',
		profile_image_url: data.profile_image_url || '',
		broadcaster_type: data.broadcaster_type || ''
	});

	if (error) {
		throw new Error(`Failed to save platform user info: ${error.message}`);
	}
}

/**
 * Checks if a platform is already linked for a user
 */
export async function isPlatformLinked(
	client: SupabaseClient<Database>,
	userId: string,
	platform: string
): Promise<boolean> {
	const { data } = await client
		.from('user_auth')
		.select('id')
		.eq('user_id', userId)
		.eq('platform', platform)
		.maybeSingle();

	return !!data;
}
