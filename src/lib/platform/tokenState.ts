import type { Database } from '$lib/supabase/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';

export type PlatformState = 'unlinked' | 'managed_basic' | 'managed_linked' | 'manual_linked';

export interface PlatformStatus {
	state: PlatformState;
	authSource: 'manual' | 'managed' | null;
	isLinked: boolean;
	scopeGranted: string[];
}

/**
 * Get the current state of a platform link for a user
 */
export async function getPlatformState(
	platform: string,
	supabase: SupabaseClient<Database>
): Promise<PlatformStatus> {
	const { data: authData } = await supabase
		.from('user_auth')
		.select('auth_source, is_linked, scope_granted')
		.eq('platform', platform)
		.maybeSingle();

	if (!authData) {
		return {
			state: 'unlinked',
			authSource: null,
			isLinked: false,
			scopeGranted: []
		};
	}

	let state: PlatformState;
	if (authData.auth_source === 'manual') {
		state = 'manual_linked';
	} else if (authData.auth_source === 'managed') {
		state = authData.is_linked ? 'managed_linked' : 'managed_basic';
	} else {
		state = 'unlinked';
	}

	return {
		state,
		authSource: authData.auth_source as 'manual' | 'managed' | null,
		isLinked: authData.is_linked,
		scopeGranted: authData.scope_granted || []
	};
}

/**
 * Check if platform is in any linked state
 */
export function isPlatformLinked(status: PlatformStatus): boolean {
	return status.state === 'managed_linked' || status.state === 'manual_linked';
}

/**
 * Check if platform is managed by Supabase
 */
export function isPlatformManaged(status: PlatformStatus): boolean {
	return status.authSource === 'managed';
}

/**
 * Transition: Link a managed platform (upgrade from basic or new link)
 */
export async function linkManagedPlatform(
	userId: string,
	platform: string,
	platformUserId: string,
	scopeGranted: string[],
	isLinked: boolean,
	supabase: SupabaseClient<Database>
): Promise<void> {
	// Check if record exists
	const { data: existing } = await supabase
		.from('user_auth')
		.select('id')
		.eq('user_id', userId)
		.eq('platform', platform)
		.maybeSingle();

	if (existing) {
		// Update existing record
		await supabase
			.from('user_auth')
			.update({
				is_linked: isLinked,
				scope_granted: scopeGranted,
				platform_user_id: platformUserId,
				updated_at: new Date().toISOString()
			})
			.eq('id', existing.id);
	} else {
		// Create new managed record
		await supabase.from('user_auth').insert({
			user_id: userId,
			platform,
			auth_source: 'managed',
			is_linked: isLinked,
			scope_granted: scopeGranted,
			access_token: null,
			refresh_token: null,
			platform_user_id: platformUserId // Actual platform user ID from API
		});
	}
}

/**
 * Transition: Unlink a managed platform (downgrade to basic)
 */
export async function unlinkManagedPlatform(
	userId: string,
	platform: string,
	supabase: SupabaseClient<Database>
): Promise<void> {
	await supabase.from('user_auth').delete().eq('user_id', userId).eq('platform', platform);
}

/**
 * Transition: Create manual platform link
 */
export async function linkManualPlatform(
	userId: string,
	platform: string,
	tokenData: {
		access_token: string;
		refresh_token: string | null;
		expires_in: number;
		scope: string[];
	},
	supabase: SupabaseClient<Database>
): Promise<void> {
	const expiresAt = Math.floor(Date.now() / 1000) + tokenData.expires_in;

	await supabase.from('user_auth').upsert({
		user_id: userId,
		platform,
		auth_source: 'manual',
		is_linked: true,
		access_token: tokenData.access_token,
		refresh_token: tokenData.refresh_token,
		expires_in: tokenData.expires_in,
		expires_at: expiresAt,
		scope_granted: tokenData.scope
	});
}

/**
 * Get all platform statuses for a user
 */
export async function getAllPlatformStates(
	supabase: SupabaseClient<Database>
): Promise<Record<string, PlatformStatus>> {
	const { data: auths } = await supabase
		.from('user_auth')
		.select('platform, auth_source, is_linked, scope_granted');

	const states: Record<string, PlatformStatus> = {};

	// Default all to unlinked
	['twitch', 'youtube', 'kick'].forEach((platform) => {
		states[platform] = {
			state: 'unlinked',
			authSource: null,
			isLinked: false,
			scopeGranted: []
		};
	});

	// Update with actual data
	auths?.forEach((auth) => {
		let state: PlatformState = 'unlinked';
		if (auth.auth_source === 'manual') {
			state = 'manual_linked';
		} else if (auth.auth_source === 'managed') {
			state = auth.is_linked ? 'managed_linked' : 'managed_basic';
		}

		states[auth.platform] = {
			state,
			authSource: auth.auth_source as 'manual' | 'managed' | null,
			isLinked: auth.is_linked,
			scopeGranted: auth.scope_granted || []
		};
	});

	return states;
}
