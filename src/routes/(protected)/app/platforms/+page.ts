import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { supabase } = await parent();
	const {
		data: { user }
	} = await supabase.auth.getUser();
	if (!user) return { platforms: [] };

	const { data: auths } = await supabase.from('user_auth').select().eq('user_id', user.id);

	if (!auths) return { platforms: [] };

	const { data: infos } = await supabase.from('user_info').select().eq('user_id', user.id);

	const infoMap = new Map((infos ?? []).map((info) => [info.platform, info]));

	const platforms = auths.map((auth) => ({
		...auth,
		user_info: infoMap.get(auth.platform)
	}));

	return { platforms };
};
