<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { createReactiveTable } from '$lib/stores/reactiveTable.svelte';
	import type { Tables } from '$lib/supabase/database.types';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

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

	// Merge server data with realtime updates - use $derived.by for function-based derivation
	const platforms = $derived.by(() => {
		const basePlatforms = data.platforms;
		const realtimeInfos = userInfoStore?.data ?? [];

		if (realtimeInfos.length === 0) {
			return basePlatforms.map((p) => ({
				...p,
				login: p.user_info?.login,
				display_name: p.user_info?.display_name,
				profile_image_url: p.user_info?.profile_image_url,
				broadcaster_type: p.user_info?.broadcaster_type
			}));
		}

		// Create map of realtime updates
		const infoMap = new Map(realtimeInfos.map((info) => [info.platform, info]));

		return basePlatforms.map((p) => {
			const info = infoMap.get(p.platform) ?? p.user_info;
			return {
				...p,
				login: info?.login,
				display_name: info?.display_name,
				profile_image_url: info?.profile_image_url,
				broadcaster_type: info?.broadcaster_type
			};
		});
	});

	const linkedPlatforms = $derived(platforms.map((p) => p.platform));
	const isTwitchLinked = $derived(linkedPlatforms.includes('twitch'));

	const infoMessage = $derived($page.url.searchParams.get('info'));

	function handleRetry() {
		userInfoStore?.retry();
	}
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-bold">Platform Management</h2>
	</div>

	<p class="text-neutral-400">Connect and manage your streaming platforms here.</p>

	{#if form?.error}
		<div class="rounded-md bg-red-500/20 p-3 text-sm text-red-400">
			{form.error}
		</div>
	{/if}

	{#if infoMessage === 'already_linked'}
		<div class="rounded-md bg-yellow-500/20 p-3 text-sm text-yellow-400">
			Twitch is already connected. Use Disconnect to remove.
		</div>
	{/if}

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		<div class="rounded-lg border border-neutral-700 bg-neutral-800 p-4">
			<div class="mb-3 flex items-center gap-3">
				<svg class="h-6 w-6 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"
					/>
				</svg>
				<div>
					<h3 class="font-semibold">Twitch</h3>
					<p class="text-sm text-neutral-400">Streaming Platform</p>
				</div>
			</div>

			{#if userInfoStore?.error}
				<div class="mb-3 rounded-md bg-red-500/20 p-3 text-sm text-red-400">
					<p>Failed to sync profile data</p>
					<button onclick={handleRetry} class="mt-2 text-xs underline hover:text-red-300">
						Retry connection
					</button>
				</div>
			{/if}

			{#if isTwitchLinked}
				{@const twitch = platforms.find((p) => p.platform === 'twitch')}
				<div class="mb-3 flex items-center gap-3">
					{#if twitch?.profile_image_url}
						<img src={twitch.profile_image_url} alt="" class="h-10 w-10 rounded-full" />
					{/if}
					<div>
						<div class="text-sm font-medium text-green-400">
							Connected as {twitch?.display_name || twitch?.login}
						</div>
						{#if twitch?.platform_user_id}
							<div class="text-xs text-neutral-500">ID: {twitch.platform_user_id}</div>
						{/if}
					</div>
				</div>
				<div class="space-y-2">
					<form method="POST" action="?/refresh" class="flex gap-2">
						<input type="hidden" name="platform" value="twitch" />
						<button
							type="submit"
							class="flex-1 rounded-md bg-neutral-700 px-4 py-2 text-sm font-medium transition-colors hover:bg-neutral-600"
						>
							Refresh Profile
						</button>
					</form>
					<form method="POST" action="?/unlink">
						<input type="hidden" name="platform" value="twitch" />
						<button
							type="submit"
							class="w-full rounded-md border border-red-500/50 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
						>
							Disconnect
						</button>
					</form>
				</div>
			{:else}
				<a
					href={resolve('/auth/link?platform=twitch&next=/app/platforms')}
					data-sveltekit-reload
					class="block rounded-md bg-purple-600 px-4 py-2 text-center text-sm font-medium transition-colors hover:bg-purple-700"
				>
					Connect Twitch
				</a>
			{/if}
		</div>
	</div>
</div>
