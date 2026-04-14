/**
 * Parse OAuth scope string or array into normalized array.
 * Handles multiple input formats from different OAuth providers.
 */
export function parseScopes(scope: string | string[] | undefined | null): string[] {
	if (Array.isArray(scope)) return scope;
	if (typeof scope === 'string') return scope.split(' ');
	return [];
}

/**
 * Platform scope definitions for OAuth flows
 * auth: Basic scopes for sign-in only
 * full: Complete scopes for platform feature access
 */
export const PLATFORM_SCOPES = {
	twitch: {
		auth: ['user:read:email'] as string[],
		full: ['user:read:email', 'channel:read:subscriptions', 'moderator:read:followers'] as string[]
	},
	youtube: {
		auth: ['openid', 'profile', 'email'] as string[],
		full: [
			'openid',
			'profile',
			'email',
			'https://www.googleapis.com/auth/youtube.readonly'
		] as string[]
	},
	kick: {
		auth: ['user:read'] as string[],
		full: ['user:read', 'channel:read'] as string[]
	}
} as const;

export type Platform = keyof typeof PLATFORM_SCOPES;
export type ScopeType = 'auth' | 'full';

/**
 * User-friendly descriptions for OAuth scopes
 */
const SCOPE_DESCRIPTIONS: Record<string, string> = {
	// Twitch
	'user:read:email': 'Read your email address',
	'channel:read:subscriptions': 'Read your channel subscribers',
	'moderator:read:followers': 'Read your followers list',
	// YouTube
	openid: 'Verify your identity',
	profile: 'Read your basic profile information',
	email: 'Read your email address',
	'https://www.googleapis.com/auth/youtube.readonly': 'Read your YouTube channel information',
	// Kick
	'user:read': 'Read your Kick profile information',
	'channel:read': 'Read your Kick channel information'
};

/**
 * Get user-friendly description for a scope
 */
export function getScopeDescription(scope: string): string {
	return SCOPE_DESCRIPTIONS[scope] || scope;
}

/**
 * Get scopes for a platform and type
 */
export function getScopes(platform: Platform, type: ScopeType): string[] {
	const platformConfig = PLATFORM_SCOPES[platform];
	const scopes = platformConfig[type];
	if (Array.isArray(scopes)) {
		return [...scopes];
	}
	return [];
}

/**
 * Get all scope descriptions for a platform scope set
 */
export function getScopeDescriptions(platform: Platform, type: ScopeType): string[] {
	const scopes = getScopes(platform, type);
	return scopes.map(getScopeDescription);
}

/**
 * Format scopes as JSON for display
 */
export function formatScopesJson(platform: Platform, type: ScopeType): string {
	const scopes = getScopes(platform, type);
	return JSON.stringify({ scopes }, null, 2);
}
