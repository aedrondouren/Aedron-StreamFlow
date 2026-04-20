<script lang="ts" module>
	import { browser } from '$app/environment';
	import { DropdownMenu } from 'bits-ui';
	import {
		applyTheme,
		getInitialTheme,
		saveThemePreference,
		setupSystemThemeListener
	} from '$lib/stores/theme.svelte';
</script>

<script lang="ts">
	let theme = $state<'light' | 'dark' | 'system'>(browser ? getInitialTheme() : 'system');

	$effect(() => {
		if (!browser) return;
		theme = getInitialTheme();
	});

	$effect(() => {
		if (!browser) return;
		applyTheme(theme);
		saveThemePreference(theme);
	});

	$effect(() => {
		if (!browser || theme !== 'system') return;
		return setupSystemThemeListener(() => {
			applyTheme('system');
		});
	});

	const labels = {
		light: 'Light',
		dark: 'Dark',
		system: 'System'
	};
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="flex w-fit cursor-pointer items-center gap-2 rounded-md border border-base-300 bg-base-50 px-3 py-1.5 text-sm font-medium text-base-900 transition-colors hover:bg-base-100 sm:min-w-24 dark:border-base-600 dark:bg-base-700 dark:text-base-50 dark:hover:bg-base-600"
		aria-label="Toggle theme"
	>
		<span class="hidden theme-light:inline">
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
				/>
			</svg>
		</span>
		<span class="hidden theme-dark:inline">
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
				/>
			</svg>
		</span>
		<span class="hidden theme-system:inline">
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
				/>
			</svg>
		</span>
		<span class="hidden sm:inline">
			<span class="hidden theme-light:inline">Light</span>
			<span class="hidden theme-dark:inline">Dark</span>
			<span class="hidden theme-system:inline">System</span>
		</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content
		class="z-50 min-w-30 overflow-hidden rounded-md border border-base-300 bg-base-50 p-1.5 shadow-lg dark:border-base-600 dark:bg-base-800"
		sideOffset={8}
	>
		<DropdownMenu.RadioGroup bind:value={theme}>
			<DropdownMenu.RadioItem
				value="light"
				class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-base-900 outline-none hover:bg-base-100 hover:text-base-900 dark:text-base-300 dark:hover:bg-base-700 dark:hover:text-base-100"
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
					/>
				</svg>
				{labels.light}
			</DropdownMenu.RadioItem>
			<DropdownMenu.RadioItem
				value="dark"
				class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-base-900 outline-none hover:bg-base-100 hover:text-base-900 dark:text-base-300 dark:hover:bg-base-700 dark:hover:text-base-100"
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
					/>
				</svg>
				{labels.dark}
			</DropdownMenu.RadioItem>
			<DropdownMenu.RadioItem
				value="system"
				class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-base-900 outline-none hover:bg-base-100 hover:text-base-900 dark:text-base-300 dark:hover:bg-base-700 dark:hover:text-base-100"
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					/>
				</svg>
				{labels.system}
			</DropdownMenu.RadioItem>
		</DropdownMenu.RadioGroup>
	</DropdownMenu.Content>
</DropdownMenu.Root>
