<script lang="ts" module>
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import PlatformCard from '$lib/components/PlatformCard.svelte';
	import { createReactiveTable } from '$lib/stores/reactiveTable.svelte';
	import type { Tables } from '$lib/supabase/database.types';
	import type { PageProps, ActionData } from './$types';

	const platformList = ['twitch', 'youtube', 'kick'] as const;
</script>

<script lang="ts">
	let { data, form }: { data: PageProps['data']; form: ActionData | undefined } = $props();

	// Track user info updates from realtime
	let userInfoStore = $state<ReturnType<typeof createReactiveTable<'user_info'>> | null>(null);

	// Initialize reactive table on client only
	$effect(() => {
		if (!browser) return;

		const userId = data.platforms[0]?.user_id;
		if (!userId || !data.supabase) return;

		const store = createReactiveTable(data.supabase, {
			table: 'user_info',
			filter: { column: 'user_id', value: userId },
			initialData: data.platforms.map((p) => p.user_info).filter(Boolean) as Tables<'user_info'>[],
			keyField: 'id'
		});

		userInfoStore = store;
		store.start();

		return () => {
			store.stop();
			userInfoStore = null;
		};
	});

	// Merge server data with realtime updates
	const platforms = $derived.by(() => {
		const basePlatforms = data.platforms;
		const realtimeInfos = userInfoStore?.data ?? [];

		if (realtimeInfos.length === 0) {
			return basePlatforms;
		}

		const infoMap = new Map(realtimeInfos.map((info) => [info.platform, info]));

		return basePlatforms.map((p) => ({
			...p,
			user_info: infoMap.get(p.platform) ?? p.user_info
		}));
	});

	const { platformStates, linkedProviders } = $derived(data);
	const infoMessage = $derived(page.url.searchParams.get('info'));

	function handleRetry() {
		userInfoStore?.retry();
	}

	function isPlatformLinked(platform: string): boolean {
		const state = platformStates[platform];
		return state?.state === 'managed_linked' || state?.state === 'manual_linked';
	}

	function getConnectFlowType(platform: string): string {
		return linkedProviders.has(platform) ? 'upgrade' : 'connect';
	}
</script>

<svelte:head>
	<title>Platforms - StreamFlow</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-bold text-base-900 dark:text-base-50">Platform Management</h2>
	</div>

	<p class="text-base-700 dark:text-base-300">Connect and manage your streaming platforms here.</p>

	{#if form?.error}
		<div class="rounded-md border border-error-600/30 bg-error-500/10 p-3 text-sm text-error-400">
			{form.error}
		</div>
	{/if}

	{#if infoMessage === 'already_linked'}
		<div
			class="rounded-md border border-warning-600/30 bg-warning-500/10 p-3 text-sm text-warning-400"
		>
			Platform is already connected. Use Disconnect to remove.
		</div>
	{/if}

	{#if userInfoStore?.error}
		<div
			class="mb-3 rounded-md border border-error-600/30 bg-error-500/10 p-3 text-sm text-error-400"
		>
			<p>Failed to sync profile data</p>
			<button
				onclick={handleRetry}
				class="mt-2 cursor-pointer text-xs underline hover:text-error-300"
				aria-label="Retry connection"
			>
				Retry connection
			</button>
		</div>
	{/if}

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each platformList as platform (platform)}
			<PlatformCard
				{platform}
				platformData={platforms.find((p) => p.platform === platform)}
				platformState={platformStates[platform] ?? {
					state: 'unlinked',
					authSource: null,
					isLinked: false,
					scopeGranted: []
				}}
				isLinked={isPlatformLinked(platform)}
				flowType={getConnectFlowType(platform)}
			/>
		{/each}
	</div>
</div>
