<script module lang="ts">
	import { PUBLIC_TWITCH_CLIENT_ID } from '$env/static/public';
	import type { PageProps } from './$types';
</script>

<script lang="ts">
	let { data }: PageProps = $props();

	const { twitch } = $derived(data);
</script>

<div class="size-full px-4 pb-2">
	<h2 class="py-6 text-center text-2xl font-semibold tracking-wider text-neutral-300">Config</h2>

	<div class="items-centers flex justify-between gap-2 rounded-md border border-neutral-700 p-4">
		<h3 class="inline-flex items-center text-lg font-semibold text-neutral-200">Twitch</h3>

		<div class="flex grow items-center justify-center gap-4">
			{#if twitch === null}
				{@const params = new URLSearchParams({
					client_id: PUBLIC_TWITCH_CLIENT_ID,
					redirect_uri: 'http://localhost:5173/oauth2/twitch',
					response_type: 'code',
					scope: 'channel:manage:broadcast'
					// state: ''
				})}

				<a href="https://id.twitch.tv/oauth2/authorize?{params.toString()}">Login</a>
			{:else}
				<div class="size-16 overflow-hidden rounded-full">
					<img src={twitch.profile_image_url} alt="Twitch profile" draggable="false" />
				</div>
				<p>{twitch.display_name}</p>
			{/if}
		</div>

		{#if twitch !== null}
			<form class="inline-flex items-center" method="POST" action="?/twitch-logout">
				<button>Logout</button>
			</form>
		{/if}
	</div>
</div>
