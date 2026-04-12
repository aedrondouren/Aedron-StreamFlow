import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/supabase/database.types';
import { validateClaims } from '$lib/supabase/validateClaims';
import { createServerClient } from '@supabase/ssr';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const { locals, cookies, url } = event;

	locals.supabase = createServerClient<Database>(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_PUBLISHABLE_KEY,
		{
			cookies: {
				getAll: () => cookies.getAll(),
				setAll: (cookiesToSet) => {
					cookiesToSet.forEach(({ name, value, options }) => {
						cookies.set(name, value, { ...options, path: '/' });
					});
				}
			}
		}
	);

	locals.claims = await validateClaims(locals.supabase);

	// If user is authenticated and tries to access auth routes (except logout, link, and oauth callbacks), redirect to /app
	if (
		locals.claims &&
		url.pathname.startsWith('/auth') &&
		!url.pathname.startsWith('/auth/logout') &&
		!url.pathname.startsWith('/auth/link') &&
		!url.pathname.startsWith('/auth/confirm/twitch')
	) {
		redirect(303, '/app');
	}

	// If user is not authenticated and tries to access protected /app routes, redirect to /auth
	if (!locals.claims && url.pathname.startsWith('/app')) {
		redirect(303, '/auth/signin');
	}

	return resolve(event, {
		filterSerializedResponseHeaders: (name) =>
			name === 'content-range' || name === 'x-supabase-api-version'
	});
};
