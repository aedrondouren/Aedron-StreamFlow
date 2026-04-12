import { browser } from '$app/environment';
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/supabase/database.types';
import { validateClaims } from '$lib/supabase/validateClaims';
import { createBrowserClient, createServerClient } from '@supabase/ssr';
import type { LayoutLoad } from './$types';

export const load = (async ({ data, fetch, depends }) => {
	depends('supabase:auth');

	const global = { fetch } as const;

	const supabase = browser
		? createBrowserClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
				global
			})
		: createServerClient<Database>(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
				global,
				cookies: { getAll: () => data.cookies }
			});

	const claims = browser ? await validateClaims(supabase) : data.claims;

	return { supabase, claims };
}) satisfies LayoutLoad;
