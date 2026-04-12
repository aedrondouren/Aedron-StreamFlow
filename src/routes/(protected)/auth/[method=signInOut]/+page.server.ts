import { fail, redirect, type Actions } from '@sveltejs/kit';

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
	signinWithOAuth: async ({ locals: { supabase }, url }) => {
		const provider = url.searchParams.get('provider');

		if (!provider) {
			return fail(400, { error: 'Provider is required' });
		}

		const redirectTo = `${url.origin}/auth/confirm/supabase`;

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: provider as 'google' | 'twitch',
			options: {
				redirectTo
			}
		});

		if (error) {
			return fail(400, { error: error.message });
		}

		if (data.url) {
			redirect(303, data.url);
		}

		return fail(500, { error: 'Failed to generate OAuth URL' });
	}
};
