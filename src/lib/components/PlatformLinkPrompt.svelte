<script lang="ts">
	import {
		formatScopesJson,
		getScopeDescriptions,
		type Platform,
		type ScopeType
	} from '$lib/platform/scopes';

	interface Props {
		platform: Platform;
		scopeType: ScopeType;
		onConfirm: () => void;
		onCancel: () => void;
	}

	let { platform, scopeType, onConfirm, onCancel }: Props = $props();

	let showDetails = $state(false);

	const platformNames: Record<string, string> = {
		twitch: 'Twitch',
		youtube: 'YouTube',
		kick: 'Kick'
	};

	// Static color classes for Tailwind JIT compiler
	const platformColorClasses = {
		twitch: {
			bg600: 'bg-twitch-600',
			bg700: 'bg-twitch-700',
			hoverBg700: 'hover:bg-twitch-700'
		},
		youtube: {
			bg600: 'bg-youtube-600',
			bg700: 'bg-youtube-700',
			hoverBg700: 'hover:bg-youtube-700'
		},
		kick: {
			bg600: 'bg-kick-600',
			bg700: 'bg-kick-700',
			hoverBg700: 'hover:bg-kick-700'
		}
	};

	const colors = $derived(platformColorClasses[platform]);

	const scopeDescriptions = $derived(getScopeDescriptions(platform, scopeType));
	const scopesJson = $derived(formatScopesJson(platform, scopeType));
</script>

<div class="bg-black/50 fixed inset-0 z-50 flex items-center justify-center p-4">
	<div class="w-full max-w-md rounded-lg border border-base-700 bg-base-800 p-6 shadow-xl">
		<div class="mb-4 flex items-center gap-3">
			{#if platform === 'twitch'}
				<svg class="h-8 w-8 text-twitch-500" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"
					/>
				</svg>
			{:else if platform === 'youtube'}
				<svg class="h-8 w-8 text-youtube-500" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
					/>
				</svg>
			{:else if platform === 'kick'}
				<svg class="h-8 w-8 text-kick-500" viewBox="0 0 24 24" fill="currentColor">
					<path d="M3.98 3h6.01v4h2V5h2V3H20v6.01h-2v2h-2v2h2v2h2v6.01h-6.01v-2h-2v-2h-2v4H3.98z" />
				</svg>
			{/if}
			<div>
				<h3 class="text-lg font-semibold text-base-50">
					Connect {platformNames[platform]} Account
				</h3>
				<p class="text-sm text-base-400">Link your account to access platform features</p>
			</div>
		</div>

		<div class="mb-4 rounded-md border border-base-700 bg-base-900 p-4">
			<p class="mb-2 text-sm font-medium text-base-300">This will allow StreamFlow to:</p>
			<ul class="space-y-1">
				{#each scopeDescriptions as description, i (i)}
					<li class="flex items-start gap-2 text-sm text-base-400">
						<svg
							class="mt-0.5 h-4 w-4 shrink-0 text-success-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
						{description}
					</li>
				{/each}
			</ul>
		</div>

		<button
			type="button"
			class="mb-4 text-sm text-primary-400 hover:text-primary-300 hover:underline"
			onclick={() => (showDetails = !showDetails)}
		>
			{showDetails ? 'Hide Details' : 'Show Details'}
		</button>

		{#if showDetails}
			<div class="mb-4 overflow-hidden rounded-md bg-base-900">
				<pre class="max-h-48 overflow-auto p-3 text-xs text-base-400">{scopesJson}</pre>
			</div>
		{/if}

		<div class="flex gap-3">
			<button
				type="button"
				class="flex-1 rounded-md border border-base-600 bg-base-700 px-4 py-2 text-sm font-medium text-base-50 transition-colors hover:bg-base-600"
				onclick={onCancel}
			>
				Cancel
			</button>
			<button
				type="button"
				class="flex-1 rounded-md {colors.bg600} px-4 py-2 text-sm font-medium text-base-50 transition-colors {colors.hoverBg700}"
				onclick={onConfirm}
			>
				Connect & Grant Access
			</button>
		</div>
	</div>
</div>
