import { fail, redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	unlink: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const platform = formData.get('platform') as string;

		if (!platform) {
			return fail(400, { error: 'Platform is required' });
		}

		const {
			data: { user }
		} = await supabase.auth.getUser();
		if (!user) {
			return fail(401, { error: 'Unauthorized' });
		}

		const { error: authError } = await supabase
			.from('user_auth')
			.delete()
			.eq('user_id', user.id)
			.eq('platform', platform);

		if (authError) {
			return fail(500, { error: 'Failed to unlink platform' });
		}

		const { error: infoError } = await supabase
			.from('user_info')
			.delete()
			.eq('user_id', user.id)
			.eq('platform', platform);

		if (infoError) {
			return fail(500, { error: 'Failed to unlink platform info' });
		}

		redirect(303, '/app/platforms');
	}
};
