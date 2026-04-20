import type { Database } from '$lib/supabase/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { error } from '@sveltejs/kit';

/**
 * Require authentication for server actions/load functions.
 * Returns the authenticated user or throws a 401 error.
 */
export async function requireAuth(supabase: SupabaseClient<Database>): Promise<{
	id: string;
	email?: string;
}> {
	const {
		data: { user },
		error: authError
	} = await supabase.auth.getUser();

	if (authError || !user) {
		throw error(401, 'Unauthorized');
	}

	return {
		id: user.id,
		email: user.email
	};
}

/**
 * Get current user from session without throwing.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(
	supabase: SupabaseClient<Database>
): Promise<{ id: string; email?: string } | null> {
	const {
		data: { user }
	} = await supabase.auth.getUser();

	if (!user) return null;

	return {
		id: user.id,
		email: user.email
	};
}
