import type { PageLoad } from './$types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/supabase/database.types';

export const load: PageLoad = async ({ parent }) => {
	const { supabase, claims } = (await parent()) as {
		supabase: SupabaseClient<Database>;
		claims: { sub: string } | undefined;
	};

	// Auth is validated in layout, but double-check here for type safety
	if (!claims?.sub) return { platforms: [], supabase };

	const userId = claims.sub;

	// Fetch user auth and info data in parallel
	const [{ data: auths }, { data: infos }] = await Promise.all([
		supabase.from('user_auth').select().eq('user_id', userId),
		supabase.from('user_info').select().eq('user_id', userId)
	]);

	if (!auths?.length) return { platforms: [], supabase };

	const infoMap = new Map((infos ?? []).map((info) => [info.platform, info]));

	const platforms = auths.map((auth) => ({
		...auth,
		user_info: infoMap.get(auth.platform)
	}));

	return { platforms, supabase };
};
