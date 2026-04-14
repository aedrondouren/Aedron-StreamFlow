import type { PageLoad } from './$types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/supabase/database.types';
import { type PlatformStatus } from '$lib/platform/tokenState';

export const load: PageLoad = async ({ parent }) => {
	const { supabase, claims } = (await parent()) as {
		supabase: SupabaseClient<Database>;
		claims: { sub: string } | undefined;
	};

	// Auth is validated in layout, but double-check here for type safety
	if (!claims?.sub) {
		const defaultStates: Record<string, PlatformStatus> = {
			twitch: { state: 'unlinked', authSource: null, isLinked: false, scopeGranted: [] },
			youtube: { state: 'unlinked', authSource: null, isLinked: false, scopeGranted: [] },
			kick: { state: 'unlinked', authSource: null, isLinked: false, scopeGranted: [] }
		};
		return { platforms: [], platformStates: defaultStates, linkedProviders: new Set<string>() };
	}

	const userId = claims.sub;

	// Fetch user auth, info data, and identities in parallel
	const [{ data: auths }, { data: infos }, { data: identitiesData }] = await Promise.all([
		supabase.from('user_auth').select().eq('user_id', userId),
		supabase.from('user_info').select().eq('user_id', userId),
		supabase.auth.getUserIdentities()
	]);

	// Get platform states (unlinked/managed_basic/managed_linked/manual_linked)
	// Initialize with default unlinked states for all platforms
	const platformStates: Record<string, PlatformStatus> = {
		twitch: { state: 'unlinked', authSource: null, isLinked: false, scopeGranted: [] },
		youtube: { state: 'unlinked', authSource: null, isLinked: false, scopeGranted: [] },
		kick: { state: 'unlinked', authSource: null, isLinked: false, scopeGranted: [] }
	};

	// Update with actual data from user_auth
	auths?.forEach((auth) => {
		let state: PlatformStatus['state'] = 'unlinked';
		if (auth.auth_source === 'manual') {
			state = 'manual_linked';
		} else if (auth.auth_source === 'managed') {
			state = auth.is_linked ? 'managed_linked' : 'managed_basic';
		}

		platformStates[auth.platform] = {
			state,
			authSource: auth.auth_source as 'manual' | 'managed' | null,
			isLinked: auth.is_linked,
			scopeGranted: auth.scope_granted || []
		};
	});

	// Build a set of linked OAuth providers for flowType detection
	// Maps provider names to platforms (google -> youtube, twitch -> twitch)
	const linkedProviders = new Set(
		identitiesData?.identities
			?.filter((identity: { provider: string }) => identity.provider !== 'email')
			?.map((identity: { provider: string }) => {
				// Map provider names to platform names
				if (identity.provider === 'google') return 'youtube';
				if (identity.provider === 'twitch') return 'twitch';
				if (identity.provider === 'custom:kick') return 'kick';
				return identity.provider;
			}) ?? []
	);

	if (!auths?.length) {
		return { platforms: [], platformStates, linkedProviders };
	}

	const infoMap = new Map((infos ?? []).map((info) => [info.platform, info]));

	const platforms = auths.map((auth) => ({
		...auth,
		user_info: infoMap.get(auth.platform)
	}));

	return { platforms, platformStates, linkedProviders };
};
