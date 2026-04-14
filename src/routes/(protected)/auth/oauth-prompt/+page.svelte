<script lang="ts">
	import { resolve } from '$app/paths';
	import { formatScopesJson, getScopeDescriptions } from '$lib/platform/scopes';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Access data reactively
	const platform = $derived(data.platform);
	const next = $derived(data.next);
	const oauthState = $derived(data.oauthState);
	const currentState = $derived(data.currentState ?? 'new');

	let showDetails = $state(false);
	let isConnecting = $state(false);
	let isSkipping = $state(false);

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

	const colors = $derived(
		platform && platformColorClasses[platform]
			? platformColorClasses[platform]
			: platformColorClasses.twitch
	);

	const scopeDescriptions = $derived(platform ? getScopeDescriptions(platform, 'full') : []);
	const scopesJson = $derived(platform ? formatScopesJson(platform, 'full') : '');
</script>

{#if !platform}
	<div class="flex min-h-screen items-center justify-center bg-base-900 p-4">
		<div class="rounded-lg border border-base-700 bg-base-800 p-6 text-center">
			<p class="text-error-400">{data.error || 'Invalid platform specified'}</p>
			<a
				href={resolve('/auth/signin')}
				class="mt-4 inline-block cursor-pointer text-primary-400 hover:underline"
			>
				Go back to sign in
			</a>
		</div>
	</div>
{:else}
	<div class="flex min-h-screen items-center justify-center bg-base-900 p-4">
		<div class="w-full max-w-md rounded-lg border border-base-700 bg-base-800 p-6 shadow-xl">
			<div class="mb-6 text-center">
				{#if platform === 'twitch'}
					<svg class="mx-auto h-12 w-12 text-twitch-500" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"
						/>
					</svg>
				{:else if platform === 'youtube'}
					<svg class="mx-auto h-12 w-12 text-youtube-500" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
						/>
					</svg>
				{:else if platform === 'kick'}
					<svg class="mx-auto h-12 w-12 text-kick-500" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M3.98 3h6.01v4h2V5h2V3H20v6.01h-2v2h-2v2h2v2h2v6.01h-6.01v-2h-2v-2h-2v4H3.98z"
						/>
					</svg>
				{/if}
				<h1 class="mt-4 text-xl font-bold text-base-50">
					{#if currentState === 'new'}
						{#if data.flowType === 'connect'}
							Link {platformNames[platform]} Account
						{:else}
							Connect {platformNames[platform]} Account
						{/if}
					{:else}
						Upgrade {platformNames[platform]} Access
					{/if}
				</h1>
				<p class="mt-2 text-sm text-base-300">
					{#if currentState === 'new'}
						{#if data.flowType === 'connect'}
							Choose how you want to connect your {platformNames[platform]} account.
						{:else}
							Would you like to link your account for full platform access?
						{/if}
					{:else}
						Your account is currently in basic mode. Upgrade to enable all features?
					{/if}
				</p>
			</div>

			{#if data.flowType === 'connect'}
				<div class="mb-6 grid gap-4 md:grid-cols-2">
					<div class="rounded-md border border-primary-600 bg-primary-600/10 p-4">
						<h3 class="mb-2 text-sm font-semibold text-primary-400">
							OAuth Connection (Recommended)
						</h3>
						<ul class="space-y-1 text-xs text-base-300">
							<li class="flex items-center gap-1">
								<svg
									class="h-3 w-3 text-success-500"
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
								All features available
							</li>
							<li class="flex items-center gap-1">
								<svg
									class="h-3 w-3 text-success-500"
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
								Securely ties your {platformNames[platform]} account to StreamFlow
							</li>
							<li class="flex items-center gap-1">
								<svg
									class="h-3 w-3 text-success-500"
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
								Managed securely through OAuth provider
							</li>
						</ul>
					</div>
					<div class="rounded-md border border-base-600 bg-base-700/50 p-4">
						<h3 class="mb-2 text-sm font-semibold text-base-300">Manual Linking</h3>
						<ul class="space-y-1 text-xs text-base-300">
							<li class="flex items-center gap-1">
								<svg
									class="h-3 w-3 text-success-500"
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
								All features available
							</li>
							<li class="flex items-center gap-1">
								<svg
									class="h-3 w-3 text-warning-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
								Stored in traditional database table
							</li>
							<li class="flex items-center gap-1">
								<svg
									class="h-3 w-3 text-warning-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
								Requires manual token/API key management
							</li>
						</ul>
					</div>
				</div>
			{/if}

			<div class="mb-6 rounded-md border border-base-700 bg-base-900 p-4">
				<p class="mb-2 text-sm font-medium text-base-300">Linking will allow StreamFlow to:</p>
				<ul class="space-y-2">
					{#each scopeDescriptions as description, i (i)}
						<li class="flex items-start gap-2 text-sm text-base-300">
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
				class="mb-4 cursor-pointer text-sm text-primary-400 hover:text-primary-300 hover:underline"
				onclick={() => (showDetails = !showDetails)}
			>
				{showDetails ? 'Hide Details' : 'Show Details'}
			</button>

			{#if showDetails}
				<div class="mb-6 overflow-hidden rounded-md bg-base-900">
					<pre class="max-h-48 overflow-auto p-3 text-xs text-base-300">{scopesJson}</pre>
				</div>
			{/if}

			<div class="space-y-3">
				<!-- Connect & Grant Access Form -->
				<form method="POST" action="/auth/signin?/initiateOAuth">
					<input type="hidden" name="platform" value={platform} />
					<input type="hidden" name="link" value="true" />
					<input type="hidden" name="state" value={oauthState} />
					<input type="hidden" name="next" value={next} />
					<input type="hidden" name="flowType" value={data.flowType} />
					<button
						type="submit"
						disabled={isSkipping}
						onclick={() => (isConnecting = true)}
						class="w-full cursor-pointer rounded-md {colors.bg600} px-4 py-3 text-sm font-medium text-base-50 transition-colors {colors.hoverBg700} disabled:opacity-50"
					>
						{#if isConnecting}
							Connecting...
						{:else if currentState === 'new'}
							Connect & Grant Access
						{:else}
							Upgrade to Full Access
						{/if}
					</button>
				</form>

				<!-- Continue without linking / Manual Linking Form -->
				{#if data.flowType === 'connect'}
					<a
						href={resolve(`/auth/link?platform=${platform}&next=/app/platforms`)}
						class="block w-full cursor-pointer rounded-md border border-base-600 bg-base-700 px-4 py-3 text-center text-sm font-medium text-base-50 transition-colors hover:bg-base-600"
					>
						Link Manually Instead
					</a>
					<a
						href={resolve('/app/platforms')}
						class="block w-full cursor-pointer rounded-md px-4 py-3 text-center text-sm font-medium text-base-300 transition-colors hover:text-base-200"
					>
						Connect Later
					</a>
				{:else}
					<form method="POST" action="/auth/signin?/initiateOAuth">
						<input type="hidden" name="platform" value={platform} />
						<input type="hidden" name="link" value="false" />
						<input type="hidden" name="state" value={oauthState} />
						<input type="hidden" name="next" value={next} />
						<input type="hidden" name="flowType" value={data.flowType} />
						<button
							type="submit"
							disabled={isConnecting}
							onclick={() => (isSkipping = true)}
							class="w-full cursor-pointer rounded-md border border-base-600 bg-base-700 px-4 py-3 text-sm font-medium text-base-50 transition-colors hover:bg-base-600 disabled:opacity-50"
						>
							{#if isSkipping}
								Continuing...
							{:else if currentState === 'new'}
								Continue without linking
							{:else}
								Keep Basic Access Only
							{/if}
						</button>
					</form>
				{/if}
			</div>

			<p class="mt-4 text-center text-xs text-base-400">
				You can always link your account later from the platform settings page.
			</p>
		</div>
	</div>
{/if}
