import { createOAuthState } from '$lib/server/oauthState';
import { redirect } from '@sveltejs/kit';

export const load = async ({ url, locals: { supabase } }) => {
	// Get platform and flowType from query params
	// flowType: 'signup' (initial signup) | 'upgrade' (complete setup) | 'connect' (explicit connection) | undefined
	const platform = url.searchParams.get('platform') as 'twitch' | 'youtube' | 'kick' | null;
	const flowType = url.searchParams.get('flowType') as 'signup' | 'upgrade' | 'connect' | null;

	// Determine redirect target based on flowType
	// 'signup' goes to /app (finish onboarding), everything else returns to /app/platforms
	const next = flowType === 'signup' ? '/app' : '/app/platforms';

	if (!platform) {
		return {
			platform: null,
			flowType,
			next,
			oauthState: null,
			error: 'Invalid platform'
		};
	}

	// Check if user is authenticated
	const {
		data: { user },
		error: authError
	} = await supabase.auth.getUser();

	if (authError || !user) {
		throw redirect(303, '/auth/signin');
	}

	// Check current platform state in user_auth table
	const { data: authData } = await supabase
		.from('user_auth')
		.select('auth_source, is_linked')
		.eq('user_id', user.id)
		.eq('platform', platform)
		.maybeSingle();

	// Determine current state
	let currentState: 'new' | 'managed_basic' | 'managed_linked';
	if (!authData) {
		currentState = 'new';
	} else if (authData.is_linked) {
		currentState = 'managed_linked';
	} else {
		currentState = 'managed_basic';
	}

	// If already fully linked, redirect away (shouldn't happen, but handle gracefully)
	if (currentState === 'managed_linked') {
		throw redirect(303, next);
	}

	// Create OAuth state
	const oauthState = createOAuthState(user.id, next);

	return {
		platform,
		flowType,
		next,
		oauthState,
		currentState,
		userId: user.id
	};
};
