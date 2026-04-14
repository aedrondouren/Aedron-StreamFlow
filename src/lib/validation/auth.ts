/**
 * Validates that two passwords match
 * @returns Error message if passwords don't match, null if they do
 */
export function validatePasswordMatch(password: string, confirm: string): string | null {
	if (password !== confirm) {
		return 'Passwords do not match';
	}
	return null;
}

/**
 * Validates password strength
 * @returns Error message if password is too weak, null if it's strong enough
 */
export function validatePasswordStrength(password: string): string | null {
	if (password.length < 6) {
		return 'Password must be at least 6 characters';
	}
	return null;
}

/**
 * Validates email format
 * @returns true if email is valid, false otherwise
 */
export function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}
