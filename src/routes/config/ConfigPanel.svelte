<script module lang="ts">
	import type { Snippet } from 'svelte';

	export type ConfigPanelProps = {
		title: string;

		children: Snippet;
	};
</script>

<script lang="ts">
	let { title, children }: ConfigPanelProps = $props();
</script>

<div class="flex flex-col gap-4 rounded-md border border-neutral-700 p-5">
	<h3 class="text-center text-xl">{title}</h3>

	<div>
		{@render children()}
	</div>
</div>
