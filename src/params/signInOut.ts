import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string) => {
	return param === 'signin' || param === 'signup';
}) satisfies ParamMatcher;
