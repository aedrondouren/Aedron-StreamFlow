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

	// Check if this is an allowed auth route for authenticated users
	// Allow: /auth/logout, /auth/link, /auth/confirm/*, /auth/oauth-prompt
	// Also allow form actions (URLs starting with ?/ like ?/initiateOAuth)
	let isFormAction = false;
	try {
		// Accessing url.search can fail during prerendering
		isFormAction = url.search.startsWith('?/');
	} catch {
		// During prerendering, url.search is not available
		isFormAction = false;
	}

	const isAllowedAuthRoute =
		// Regex matches: /auth/logout, /auth/link, /auth/confirm/<any>, /auth/oauth-prompt (with optional query params)
		/^\/auth\/(logout|link|confirm\/\w+|oauth-prompt)(\?.*)?$/.test(url.pathname) ||
		// Form actions use ?/ prefix (e.g., ?/initiateOAuth)
		isFormAction;

	// Redirect authenticated users away from auth pages (except allowed routes)
	if (locals.claims && url.pathname.startsWith('/auth') && !isAllowedAuthRoute) {
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
