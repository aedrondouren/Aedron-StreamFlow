<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Aedron StreamFlow</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-dvh w-dvw flex-col overflow-hidden select-none">
	<header class="flex items-center justify-between border-b border-neutral-700 px-4 py-2">
		<h1 class="font-semibold tracking-wider text-neutral-400 hover:text-blue-300 hover:underline">
			<a href="/" draggable="false">Aedron StreamFlow</a>
		</h1>

		<a class="text-neutral-400 hover:text-blue-300 hover:underline" href="/config" draggable="false"
			>Config</a
		>
	</header>

	<main class="grow overflow-hidden">
		{@render children()}
	</main>
</div>
