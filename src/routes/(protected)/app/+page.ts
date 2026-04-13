import type { PageLoad } from './$types';

export const load = (async () => {
	// const { supabase } = await parent();

	// const [streamsResult, platformsResult] = await Promise.all([
	// 	supabase.from('streams').select('*'),
	// 	supabase.from('platforms').select('*')
	// ]);

	return {
		// streams: streamsResult.data ?? [],
		// platforms: platformsResult.data ?? []
	};
}) satisfies PageLoad;
