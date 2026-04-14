import { fail, redirect, type Actions } from '@sveltejs/kit';
import { PLATFORM_SCOPES, type Platform } from '$lib/platform/scopes';
import { dev } from '$app/environment';

export const actions: Actions = {
	signUp: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email });
		}

		if (password.length < 6) {
			return fail(400, { error: 'Password must be at least 6 characters', email });
		}

		const { error } = await supabase.auth.signUp({
			email,
			password
		});

		if (error) {
			return fail(400, { error: error.message, email });
		}

		redirect(303, '/app');
	},
	signIn: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required', email });
		}

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			return fail(400, { error: error.message, email });
		}

		redirect(303, '/app');
	},
	signinWithOAuth: async ({ request, locals: { supabase }, url }) => {
		const provider = url.searchParams.get('provider');

		if (!provider) {
			return fail(400, { error: 'Provider is required' });
		}

		// Get scope from form data (for linking flows)
		const formData = await request.formData();
		const scope = formData.get('scope') as string | null;

		// Map provider to platform for default scopes
		const providerToPlatform: Record<string, string> = {
			twitch: 'twitch',
			google: 'youtube'
		};
		const platform = providerToPlatform[provider];

		// Use provided scope or default to basic scopes
		let finalScope: string;
		if (scope) {
			finalScope = scope;
		} else if (platform && platform !== 'kick') {
			// Default to basic scopes for initial OAuth
			finalScope =
				platform === 'youtube'
					? PLATFORM_SCOPES.youtube.auth.join(' ')
					: PLATFORM_SCOPES.twitch.auth.join(' ');
		} else {
			finalScope = '';
		}

		const redirectTo = `${url.origin}/auth/confirm/supabase?flowType=signup`;

		const options: { redirectTo: string; queryParams?: Record<string, string> } = {
			redirectTo
		};

		// Add scope to query params
		if (finalScope) {
			options.queryParams = { scope: finalScope };
		}

		// Map kick to custom:kick for Supabase custom provider
		const supabaseProvider = provider === 'kick' ? 'custom:kick' : provider;

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: supabaseProvider as 'google' | 'twitch' | 'custom:kick',
			options
		});

		if (error) {
			if (dev) {
				console.error('[DEV] signinWithOAuth error:', error);
			}
			return fail(400, { error: error.message });
		}

		if (data.url) {
			redirect(303, data.url);
		}

		return fail(500, { error: 'Failed to generate OAuth URL' });
	},

	/**
	 * Initiate OAuth flow from oauth-prompt page
	 * Handles both "Connect & Grant Access" (link=true) and "Continue without linking" (link=false)
	 */
	initiateOAuth: async ({ request, locals: { supabase }, url }) => {
		const formData = await request.formData();
		const platform = formData.get('platform') as Platform;
		const link = formData.get('link') === 'true';
		const state = formData.get('state') as string;
		const flowType = formData.get('flowType') as 'signup' | 'upgrade' | 'connect' | null;

		if (!platform) {
			return fail(400, { error: 'Platform is required' });
		}

		// Map platform to provider
		const providerMap: Record<string, string> = {
			twitch: 'twitch',
			youtube: 'google',
			kick: 'custom:kick'
		};
		const provider = providerMap[platform];

		if (!provider) {
			return fail(400, { error: 'Invalid platform' });
		}

		// Get user to validate state
		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (!user) {
			return fail(401, { error: 'User not authenticated' });
		}

		// Validate state
		const { validateOAuthState } = await import('$lib/server/oauthState');
		const validatedState = validateOAuthState(state, user.id);

		if (!validatedState) {
			return fail(400, { error: 'Invalid or expired session. Please try again.' });
		}

		// If user chooses to skip linking, redirect based on flowType
		if (!link) {
			// For signup flow, always redirect to /app even when skipping
			const skipRedirectTarget = flowType === 'signup' ? '/app' : validatedState.next;
			return redirect(303, skipRedirectTarget);
		}

		// User wants to link - use flowType from form or default to 'signup'
		// flowType determines redirect destination in callback
		const effectiveFlowType = flowType || 'signup';
		const redirectTo = `${url.origin}/auth/confirm/supabase?flowType=${effectiveFlowType}`;

		// Determine scopes for linking
		const scopes =
			platform === 'youtube' ? PLATFORM_SCOPES.youtube.full : PLATFORM_SCOPES.twitch.full;

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: provider as 'google' | 'twitch',
			options: {
				redirectTo,
				queryParams: {
					scope: scopes.join(' ')
				}
			}
		});

		if (error) {
			if (dev) {
				console.error('[DEV] initiateOAuth error:', error);
			}
			return fail(500, { error: 'Failed to initiate OAuth flow' });
		}

		if (data.url) {
			redirect(303, data.url);
		}

		return fail(500, { error: 'Failed to generate OAuth URL' });
	}
};
