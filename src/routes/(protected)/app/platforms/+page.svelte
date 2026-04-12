<script lang="ts">
	import { page } from '$app/stores';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const platforms = $derived(
		data.platforms.map((p) => {
			const info = p.user_info;
			return {
				...p,
				login: info?.login,
				display_name: info?.display_name,
				profile_image_url: info?.profile_image_url,
				broadcaster_type: info?.broadcaster_type
			};
		})
	);

	const linkedPlatforms = $derived(platforms.map((p) => p.platform));
	const isTwitchLinked = $derived(linkedPlatforms.includes('twitch'));

	const infoMessage = $derived($page.url.searchParams.get('info'));
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
				<form method="POST" action="?/unlink">
					<input type="hidden" name="platform" value="twitch" />
					<button
						type="submit"
						class="w-full rounded-md border border-red-500/50 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
					>
						Disconnect
					</button>
				</form>
			{:else}
				<a
					href="/auth/link?platform=twitch&next=/app/platforms"
					class="block rounded-md bg-purple-600 px-4 py-2 text-center text-sm font-medium transition-colors hover:bg-purple-700"
				>
					Connect Twitch
				</a>
			{/if}
		</div>
	</div>
</div>
