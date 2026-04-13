<script lang="ts" module>
	import type { LayoutProps } from './$types';
</script>

<script lang="ts">
	import favicon from '$lib/assets/favicon.png';
	import '../app.css';

	let { children }: LayoutProps = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{@render children()}
