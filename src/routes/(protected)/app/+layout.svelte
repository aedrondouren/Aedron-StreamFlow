<script lang="ts" module>
	import { invalidate } from '$app/navigation';
	import type { LayoutProps } from './$types';
</script>

<script lang="ts">
	let { data, children }: LayoutProps = $props();
	let { supabase, claims } = $derived(data);

	let sidebarOpen = $state(true);

	$effect(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== claims?.exp) {
				invalidate('supabase:auth');
			}
		});

		return () => subscription.unsubscribe();
	});
</script>

<div class="flex h-screen bg-neutral-900">
	<aside
		class="flex flex-col border-r border-neutral-700 bg-neutral-800 transition-all duration-300"
		class:w-64={sidebarOpen}
		class:w-16={!sidebarOpen}
	>
		<div class="flex h-16 items-center border-b border-neutral-700 px-4">
			{#if sidebarOpen}
				<span class="text-lg font-bold text-purple-400">StreamFlow</span>
			{:else}
				<span class="text-lg font-bold text-purple-400">SF</span>
			{/if}
		</div>

		<nav class="flex-1 space-y-1 p-2">
			<a
				href="/app"
				class="flex items-center gap-3 rounded-md px-3 py-2 text-neutral-300 hover:bg-neutral-700"
			>
				<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
					/>
				</svg>
				{#if sidebarOpen}
					<span>Dashboard</span>
				{/if}
			</a>

			<a
				href="/app/platforms"
				class="flex items-center gap-3 rounded-md px-3 py-2 text-neutral-300 hover:bg-neutral-700"
			>
				<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
					/>
				</svg>
				{#if sidebarOpen}
					<span>Platforms</span>
				{/if}
			</a>
		</nav>

		<div class="border-t border-neutral-700 p-2">
			<button
				onclick={() => {
					sidebarOpen = !sidebarOpen;
				}}
				class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-neutral-300 hover:bg-neutral-700"
			>
				<svg
					class="h-5 w-5 shrink-0 transition-transform"
					class:rotate-180={!sidebarOpen}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
					/>
				</svg>
				{#if sidebarOpen}
					<span>Collapse</span>
				{/if}
			</button>
		</div>
	</aside>

	<div class="flex flex-1 flex-col overflow-hidden">
		<header
			class="flex h-16 items-center justify-between border-b border-neutral-700 bg-neutral-800 px-6"
		>
			<h1 class="text-xl font-semibold">Dashboard</h1>

			<div class="flex items-center gap-4">
				<form method="POST" action="/auth/logout">
					<button
						type="submit"
						class="rounded-md bg-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-600"
					>
						Sign Out
					</button>
				</form>
			</div>
		</header>

		<main class="flex-1 overflow-auto p-6">
			{@render children()}
		</main>
	</div>
</div>
