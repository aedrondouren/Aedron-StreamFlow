import type { Database } from '$lib/supabase/database.types';
import type { JwtPayload, SupabaseClient } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			claims?: JwtPayload;
		}
		interface PageData {
			supabase: SupabaseClient<Database>;
			claims?: JwtPayload;
		}
	}
}

export {};
