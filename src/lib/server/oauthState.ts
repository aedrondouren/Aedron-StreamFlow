import { createHash } from 'crypto';
import { dev } from '$app/environment';

const STATE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

interface OAuthState {
	h: string; // Hash of user ID (first 8 chars)
	n: string; // Next path
	t: number; // Timestamp
	u?: boolean; // Upgrade flag (true when upgrading from managed_basic to managed_linked)
}

/**
 * Create a simple hash of the user ID (first 8 characters of SHA-256)
 */
function hashUserId(userId: string): string {
	return createHash('sha256').update(userId).digest('hex').substring(0, 8);
}

/**
 * Create OAuth state token containing user hash, next path, timestamp, and optional upgrade flag
 */
export function createOAuthState(userId: string, next: string, upgrade?: boolean): string {
	const state: OAuthState = {
		h: hashUserId(userId),
		n: next,
		t: Date.now()
	};

	if (upgrade) {
		state.u = true;
	}

	const jsonString = JSON.stringify(state);
	const base64State = btoa(jsonString);

	return base64State;
}

interface ValidatedState {
	next: string;
	upgrade: boolean;
}

/**
 * Validate OAuth state and return next path and upgrade flag if valid
 * @returns ValidatedState if valid, null if invalid
 */
export function validateOAuthState(state: string, userId: string): ValidatedState | null {
	try {
		// Decode base64
		const jsonString = atob(state);
		const data: OAuthState = JSON.parse(jsonString);

		// Check expiry
		const now = Date.now();
		if (now - data.t > STATE_EXPIRY_MS) {
			return null;
		}

		// Validate hash
		const expectedHash = hashUserId(userId);
		if (data.h !== expectedHash) {
			return null;
		}

		return {
			next: data.n,
			upgrade: data.u ?? false
		};
	} catch (error) {
		if (dev) {
			console.error('[DEV] Failed to validate OAuth state:', error);
		}
		return null;
	}
}
