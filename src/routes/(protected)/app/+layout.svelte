<script lang="ts" module>
	import { invalidate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { LayoutProps } from './$types';
</script>

<script lang="ts">
	import { browser } from '$app/environment';
	import favicon from '$lib/assets/favicon.png';

	let { data, children }: LayoutProps = $props();
	let { supabase, claims } = $derived(data);

	function toggleSidebar() {
		if (!browser) return;
		const html = document.documentElement;
		const isOpen = html.dataset.sidebarOpen === 'true';
		const newState = !isOpen;
		html.dataset.sidebarOpen = String(newState);
		localStorage.setItem('streamflow:sidebarOpen', String(newState));
	}

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

<div class="flex h-screen bg-base-900">
	<aside
		class="flex w-16 flex-col border-r border-base-700 bg-base-800 transition-all duration-300 sidebar-open:w-64 sidebar-closed:w-16"
	>
		<!-- Logo Header - Fixed icon width, overflow text container -->
		<div class="flex h-16 shrink-0 items-center border-b border-base-700 px-3">
			<div class="flex w-full items-center">
				<!-- Icon - Fixed 48px width, always centered -->
				<div class="flex w-12 flex-none items-center justify-center">
					<img src={favicon} alt="" class="h-10 w-10 flex-none" />
				</div>
				<!-- Text container - transitions width and opacity -->
				<div
					class="overflow-hidden transition-all duration-200 ease-in-out sidebar-open:w-auto sidebar-open:opacity-100 sidebar-closed:w-0 sidebar-closed:opacity-0"
				>
					<span class="pl-2 text-lg font-bold whitespace-nowrap text-primary-400">
						StreamFlow
					</span>
				</div>
			</div>
		</div>

		<!-- Navigation - Fixed icon columns, overflow text containers -->
		<nav class="flex flex-1 flex-col gap-1 overflow-hidden p-2">
			<a
				href={resolve('/app')}
				class="flex cursor-pointer items-center rounded-md px-3 py-2 text-base-300 transition-colors hover:bg-base-700"
			>
				<!-- Icon - Fixed 48px width, always centered -->
				<div class="flex w-12 flex-none items-center justify-center">
					<svg class="h-5 w-5 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
						/>
					</svg>
				</div>
				<!-- Text container - transitions width and opacity -->
				<div
					class="overflow-hidden transition-all duration-200 ease-in-out sidebar-open:w-auto sidebar-open:opacity-100 sidebar-closed:w-0 sidebar-closed:opacity-0"
				>
					<span class="pl-2 whitespace-nowrap">Dashboard</span>
				</div>
			</a>

			<a
				href={resolve('/app/platforms')}
				class="flex cursor-pointer items-center rounded-md px-3 py-2 text-base-300 transition-colors hover:bg-base-700"
			>
				<!-- Icon - Fixed 48px width, always centered -->
				<div class="flex w-12 flex-none items-center justify-center">
					<svg class="h-5 w-5 flex-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
						/>
					</svg>
				</div>
				<!-- Text container - transitions width and opacity -->
				<div
					class="overflow-hidden transition-all duration-200 ease-in-out sidebar-open:w-auto sidebar-open:opacity-100 sidebar-closed:w-0 sidebar-closed:opacity-0"
				>
					<span class="pl-2 whitespace-nowrap">Platforms</span>
				</div>
			</a>
		</nav>

		<!-- Collapse Button - Fixed icon width, overflow text container -->
		<div class="shrink-0 border-t border-base-700 p-2">
			<button
				onclick={toggleSidebar}
				class="flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-base-300 transition-colors hover:bg-base-700"
			>
				<!-- Icon - Fixed 48px width, always centered -->
				<div class="flex w-12 flex-none items-center justify-center">
					<svg
						class="h-5 w-5 flex-none transition-transform duration-300 sidebar-closed:rotate-180"
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
				</div>
				<!-- Text container - transitions width and opacity -->
				<div
					class="overflow-hidden transition-all duration-200 ease-in-out sidebar-open:w-auto sidebar-open:opacity-100 sidebar-closed:w-0 sidebar-closed:opacity-0"
				>
					<span class="pl-2 whitespace-nowrap">Collapse</span>
				</div>
			</button>
		</div>
	</aside>

	<div class="flex flex-1 flex-col overflow-hidden">
		<header
			class="flex h-16 items-center justify-between border-b border-base-700 bg-base-800 px-6"
		>
			<h1 class="text-xl font-semibold text-base-50">Dashboard</h1>

			<div class="flex items-center gap-4">
				<form method="POST" action="/auth/logout">
					<button
						type="submit"
						class="cursor-pointer rounded-md bg-base-700 px-4 py-2 text-sm font-medium text-base-300 transition-colors hover:bg-base-600"
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
