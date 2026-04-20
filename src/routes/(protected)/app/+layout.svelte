<script lang="ts" module>
	import { browser } from '$app/environment';
	import { invalidate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button, ThemeToggle, Tooltip } from '$lib/components';
	import type { LayoutProps } from './$types';
</script>

<script lang="ts">
	import favicon from '$lib/assets/favicon.png';

	let { data, children }: LayoutProps = $props();
	let { supabase, claims } = $derived(data);

	let sidebarOpen = $state(true);

	function toggleSidebar() {
		if (!browser) return;
		const newState = !sidebarOpen;
		document.documentElement.dataset.sidebarOpen = String(newState);
		localStorage.setItem('streamflow:sidebarOpen', String(newState));
		sidebarOpen = newState;
	}

	$effect(() => {
		if (!browser) return;
		const stored = localStorage.getItem('streamflow:sidebarOpen');
		sidebarOpen = stored !== null ? stored === 'true' : true;
	});

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

<Tooltip.Provider>
	<div class="flex h-screen bg-base-50 dark:bg-base-900">
		<aside
			class="flex shrink-0 flex-col overflow-hidden border-r border-base-200 bg-base-50 transition-[width] duration-300 ease-in-out dark:border-base-700 dark:bg-base-800"
		>
			<!-- Logo Header - Grid layout with uniform icon sizing -->
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<a
							{...props}
							href={resolve('/')}
							class="grid h-16 w-full shrink-0 grid-cols-[auto_auto] items-center border-b border-base-200 px-3 transition-colors hover:bg-base-100 dark:border-base-700 dark:hover:bg-base-700/50"
						>
							<!-- Icon - Auto-sized column, centered content -->
							<div class="flex items-center justify-center">
								<img src={favicon} alt="" class="h-10 w-10 flex-none" />
							</div>
							<!-- Text - Fades in/out with gap -->
							<div
								class="w-0 overflow-hidden opacity-0 transition-all duration-200 ease-in-out sidebar-open:w-auto sidebar-open:opacity-100"
							>
								<span class="pl-2 text-lg font-bold whitespace-nowrap text-primary-400"
									>StreamFlow</span
								>
							</div>
						</a>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content
					side="right"
					class="hidden rounded-md border border-base-300 bg-base-50 px-2 py-1 text-sm text-base-900 shadow-md dark:border-base-600 dark:bg-base-800 dark:text-base-100 sidebar-closed:block"
				>
					<p>Home</p>
				</Tooltip.Content>
			</Tooltip.Root>

			<!-- Navigation - Fixed icon columns, overflow text containers -->
			<nav class="flex flex-1 flex-col gap-1 overflow-hidden p-2">
				<Tooltip.Provider>
					<Tooltip.Root>
						<Tooltip.Trigger>
							{#snippet child({ props })}
								<a
									{...props}
									href={resolve('/app')}
									class="grid w-full cursor-pointer grid-cols-[auto_auto] items-center rounded-md px-3 py-2 text-base-700 transition-colors hover:bg-base-100 dark:text-base-200 dark:hover:bg-base-700"
								>
									<!-- Icon - Auto-sized column, centered content -->
									<div class="flex items-center justify-center">
										<svg
											class="h-6 w-6 flex-none"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
											/>
										</svg>
									</div>
									<!-- Text - Fades in/out with gap -->
									<div
										class="w-0 overflow-hidden opacity-0 transition-all duration-200 ease-in-out sidebar-open:w-auto sidebar-open:opacity-100"
									>
										<span class="pl-2 whitespace-nowrap">Dashboard</span>
									</div>
								</a>
							{/snippet}
						</Tooltip.Trigger>
						<Tooltip.Content
							side="right"
							class="hidden rounded-md border border-base-300 bg-base-50 px-2 py-1 text-sm text-base-900 shadow-md dark:border-base-600 dark:bg-base-800 dark:text-base-100 sidebar-closed:block"
						>
							<p>Dashboard</p>
						</Tooltip.Content>
					</Tooltip.Root>

					<Tooltip.Root>
						<Tooltip.Trigger>
							{#snippet child({ props })}
								<a
									{...props}
									href={resolve('/app/platforms')}
									class="grid w-full cursor-pointer grid-cols-[auto_auto] items-center rounded-md px-3 py-2 text-base-700 transition-colors hover:bg-base-100 dark:text-base-200 dark:hover:bg-base-700"
								>
									<!-- Icon - Auto-sized column, centered content -->
									<div class="flex items-center justify-center">
										<svg
											class="h-6 w-6 flex-none"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<!-- Text - Fades in/out with gap -->
									<div
										class="w-0 overflow-hidden opacity-0 transition-all duration-200 ease-in-out sidebar-open:w-auto sidebar-open:opacity-100"
									>
										<span class="pl-2 whitespace-nowrap">Platforms</span>
									</div>
								</a>
							{/snippet}
						</Tooltip.Trigger>
						<Tooltip.Content
							side="right"
							class="hidden rounded-md border border-base-300 bg-base-50 px-2 py-1 text-sm text-base-900 shadow-md dark:border-base-600 dark:bg-base-800 dark:text-base-100 sidebar-closed:block"
						>
							<p>Platforms</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</Tooltip.Provider>
			</nav>

			<!-- Collapse Button - Grid layout with uniform icon sizing -->
			<div class="shrink-0 border-t border-base-200 p-2 dark:border-base-700">
				<Tooltip.Root>
					<Tooltip.Trigger
						onclick={toggleSidebar}
						class="grid w-full cursor-pointer grid-cols-[auto_auto] items-center rounded-md px-3 py-2 text-base-700 transition-colors hover:bg-base-100 dark:text-base-200 dark:hover:bg-base-700"
					>
						<!-- Icon - Auto-sized column, centered content -->
						<div class="flex items-center justify-center">
							<svg
								class="h-6 w-6 flex-none transition-transform duration-300 sidebar-closed:rotate-180"
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
						<!-- Text - Fades in/out with gap -->
						<div
							class="w-0 overflow-hidden opacity-0 transition-all duration-200 ease-in-out sidebar-open:w-auto sidebar-open:opacity-100"
						>
							<span class="pl-2 whitespace-nowrap">Collapse</span>
						</div>
					</Tooltip.Trigger>
					<Tooltip.Content
						side="right"
						class="hidden rounded-md border border-base-300 bg-base-50 px-2 py-1 text-sm text-base-900 shadow-md dark:border-base-600 dark:bg-base-800 dark:text-base-100 sidebar-closed:block"
					>
						<p>{sidebarOpen ? 'Collapse' : 'Expand'}</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</div>
		</aside>

		<div class="flex flex-1 flex-col overflow-hidden">
			<header
				class="flex h-16 items-center justify-between border-b border-base-200 bg-base-50 px-6 dark:border-base-700 dark:bg-base-800"
			>
				<h1 class="text-xl font-semibold text-base-900 dark:text-base-50">Dashboard</h1>

				<div class="flex items-center gap-4">
					<ThemeToggle />
					<form method="POST" action="/auth/logout">
						<Button.Root
							type="submit"
							class="w-fit cursor-pointer rounded-md bg-base-200 px-3 py-1.5 text-sm font-medium text-base-700 transition-colors hover:bg-base-300 sm:min-w-24 dark:bg-base-700 dark:text-base-200 dark:hover:bg-base-600"
						>
							Sign Out
						</Button.Root>
					</form>
				</div>
			</header>

			<main class="flex-1 overflow-auto p-6">
				{@render children()}
			</main>
		</div>
	</div>
</Tooltip.Provider>
