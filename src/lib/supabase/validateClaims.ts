import type { SupabaseClient } from '@supabase/supabase-js';

export async function validateClaims(supabase: SupabaseClient) {
	const { data: claimsData, error } = await supabase.auth.getClaims();
	return error ? undefined : claimsData?.claims;
}
