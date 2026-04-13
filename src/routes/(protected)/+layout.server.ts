import type { LayoutServerLoad } from './$types';

export const load = (async ({ cookies, locals: { claims } }) => {
	return {
		cookies: cookies.getAll(),
		claims
	};
}) satisfies LayoutServerLoad;
