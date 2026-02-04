<script module lang="ts">
	import { PUBLIC_TWITCH_CLIENT_ID } from '$env/static/public';
	import type { PageProps } from './$types';
	import ConfigPanel from './ConfigPanel.svelte';
</script>

<script lang="ts">
	let { data }: PageProps = $props();

	const { twitch } = $derived(data);
</script>

<div class="size-full px-4 pb-2">
	<h2 class="py-6 text-center text-2xl font-semibold tracking-wider text-neutral-300">Config</h2>

	<ConfigPanel title="Twitch">
		<p>Connected: {twitch.connected}</p>

		{#if !twitch.connected}
			{@const params = new URLSearchParams({
				client_id: PUBLIC_TWITCH_CLIENT_ID,
				redirect_uri: 'http://localhost:5173/oauth2/twitch',
				response_type: 'code',
				scope: '',
				state: twitch.state
			})}

			<a href="https://id.twitch.tv/oauth2/authorize?{params.toString()}">Login</a>
		{/if}

		{#if twitch.connected}
			<p>Scope: {twitch.scope}</p>
		{/if}
	</ConfigPanel>
</div>
