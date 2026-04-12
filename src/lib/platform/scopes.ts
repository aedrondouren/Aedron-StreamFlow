/**
 * Parse OAuth scope string or array into normalized array.
 * Handles multiple input formats from different OAuth providers.
 */
export function parseScopes(scope: string | string[] | undefined | null): string[] {
	if (Array.isArray(scope)) return scope;
	if (typeof scope === 'string') return scope.split(' ');
	return [];
}
