import type { Database } from '$lib/supabase/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { refreshToken as refreshKickToken } from './kickAuth';
import { refreshToken as refreshTwitchToken } from './twitchAuth';
import { refreshToken as refreshYouTubeToken } from './youtubeAuth';

// Simple in-memory cache for tokens
const tokenCache = new Map<
	string,
	{
		token: string;
		expiresAt: number;
	}
>();

const CACHE_BUFFER_MS = 60000; // 1 minute buffer before expiry

/**
 * Get platform token for API calls
 * For manual: Returns stored token, refreshes if needed
 * For managed: Returns token from Supabase session (never stored)
 */
export async function getPlatformToken(
	platform: string,
	supabase: SupabaseClient<Database>
): Promise<string | null> {
	// 1. Check if manual linked (we store and manage these tokens)
	const { data: manualAuth } = await supabase
		.from('user_auth')
		.select('*')
		.eq('platform', platform)
		.eq('auth_source', 'manual')
		.maybeSingle();

	if (manualAuth) {
		return await getManualToken(manualAuth, platform, supabase);
	}

	// 2. Check if managed linked (get from Supabase session)
	const { data: managedAuth } = await supabase
		.from('user_auth')
		.select('*')
		.eq('platform', platform)
		.eq('auth_source', 'managed')
		.eq('is_linked', true)
		.maybeSingle();

	if (managedAuth) {
		return await getManagedToken(supabase);
	}

	return null;
}

/**
 * Get manual token with caching and refresh
 */
async function getManualToken(
	authData: Database['public']['Tables']['user_auth']['Row'],
	platform: string,
	supabase: SupabaseClient<Database>
): Promise<string | null> {
	const cacheKey = `${authData.user_id}:${platform}`;

	// Check cache first
	const cached = tokenCache.get(cacheKey);
	if (cached && cached.expiresAt > Date.now() + CACHE_BUFFER_MS) {
		return cached.token;
	}

	// Check if token needs refresh
	const now = Date.now();
	const expiresAt = authData.expires_at ? authData.expires_at * 1000 : 0;

	if (expiresAt > 0 && expiresAt < now + CACHE_BUFFER_MS && authData.refresh_token) {
		// Token expired or expiring soon, refresh it
		const refreshed = await refreshPlatformToken(platform, authData.refresh_token);

		if (refreshed) {
			// Update database with new token
			const newExpiresAt = Math.floor(Date.now() / 1000) + refreshed.expires_in;
			await supabase
				.from('user_auth')
				.update({
					access_token: refreshed.access_token,
					refresh_token: refreshed.refresh_token,
					expires_in: refreshed.expires_in,
					expires_at: newExpiresAt,
					updated_at: new Date().toISOString()
				})
				.eq('id', authData.id);

			// Cache and return
			const cacheExpiry = newExpiresAt * 1000;
			tokenCache.set(cacheKey, {
				token: refreshed.access_token,
				expiresAt: cacheExpiry
			});

			return refreshed.access_token;
		}
	}

	// Token still valid, cache and return
	if (authData.access_token) {
		tokenCache.set(cacheKey, {
			token: authData.access_token,
			expiresAt: expiresAt || Date.now() + 3600000 // Default 1 hour
		});
		return authData.access_token;
	}

	return null;
}

/**
 * Get managed token from Supabase session
 * CRITICAL: Never store managed tokens in database
 */
async function getManagedToken(supabase: SupabaseClient<Database>): Promise<string | null> {
	const { data, error } = await supabase.auth.getSession();

	if (error || !data.session) {
		return null;
	}

	// Return the provider token from Supabase session
	// Supabase handles refresh automatically
	return data.session.provider_token || null;
}

/**
 * Refresh token for a specific platform
 */
async function refreshPlatformToken(
	platform: string,
	refreshToken: string
): Promise<{ access_token: string; refresh_token: string; expires_in: number } | null> {
	switch (platform) {
		case 'twitch': {
			const result = await refreshTwitchToken(refreshToken);
			return result
				? {
						access_token: result.access_token,
						refresh_token: result.refresh_token,
						expires_in: result.expires_in
					}
				: null;
		}
		case 'youtube': {
			const result = await refreshYouTubeToken(refreshToken);
			return result
				? {
						access_token: result.access_token,
						refresh_token: result.refresh_token,
						expires_in: result.expires_in
					}
				: null;
		}
		case 'kick': {
			const result = await refreshKickToken(refreshToken);
			return result
				? {
						access_token: result.access_token,
						refresh_token: result.refresh_token,
						expires_in: result.expires_in
					}
				: null;
		}
		default:
			return null;
	}
}

/**
 * Clear token cache for a user/platform
 */
export function clearTokenCache(userId: string, platform: string): void {
	tokenCache.delete(`${userId}:${platform}`);
}

/**
 * Clear all token cache
 */
export function clearAllTokenCache(): void {
	tokenCache.clear();
}
