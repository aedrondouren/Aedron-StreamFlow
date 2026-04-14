<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Tables } from '$lib/supabase/database.types';
	import type { PlatformStatus } from '$lib/platform/tokenState';

	interface Props {
		platform: 'twitch' | 'youtube' | 'kick';
		platformData: (Tables<'user_auth'> & { user_info?: Tables<'user_info'> }) | undefined;
		platformState: PlatformStatus;
		isLinked: boolean;
		flowType: string;
	}

	let { platform, platformData, platformState, isLinked, flowType }: Props = $props();

	const platformConfig = {
		twitch: {
			name: 'Twitch',
			colorClass: 'twitch',
			svgPath:
				'M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z',
			oauthProvider: 'Twitch'
		},
		youtube: {
			name: 'YouTube',
			colorClass: 'youtube',
			svgPath:
				'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
			oauthProvider: 'Google'
		},
		kick: {
			name: 'Kick',
			colorClass: 'kick',
			svgPath: 'M3.98 3h6.01v4h2V5h2V3H20v6.01h-2v2h-2v2h2v2h2v6.01h-6.01v-2h-2v-2h-2v4H3.98z',
			oauthProvider: 'Kick'
		}
	};

	const config = $derived(platformConfig[platform]);

	function getConnectButtonText(): string {
		if (platformState.state === 'managed_basic') {
			return 'Complete Setup';
		}
		return `Connect ${config.name}`;
	}

	// Static color classes for Tailwind JIT compiler
	const platformColorClasses = {
		twitch: {
			text500: 'text-twitch-500',
			bg600: 'bg-twitch-600',
			bg700: 'bg-twitch-700',
			hoverBg700: 'hover:bg-twitch-700'
		},
		youtube: {
			text500: 'text-youtube-500',
			bg600: 'bg-youtube-600',
			bg700: 'bg-youtube-700',
			hoverBg700: 'hover:bg-youtube-700'
		},
		kick: {
			text500: 'text-kick-500',
			bg600: 'bg-kick-600',
			bg700: 'bg-kick-700',
			hoverBg700: 'hover:bg-kick-700'
		}
	};

	const colors = $derived(platformColorClasses[platform]);
</script>

<div class="rounded-lg border border-base-700 bg-base-800 p-4">
	<div class="mb-3 flex items-center gap-3">
		<svg class="h-6 w-6 {colors.text500}" viewBox="0 0 24 24" fill="currentColor">
			<path d={config.svgPath} />
		</svg>
		<div>
			<h3 class="font-semibold text-base-50">{config.name}</h3>
			<p class="text-sm text-base-300">Streaming Platform</p>
		</div>
	</div>

	{#if isLinked}
		{@const isManaged = platformState.authSource === 'managed'}
		<div class="mb-3 flex items-center gap-3">
			{#if platformData?.user_info?.profile_image_url}
				<img src={platformData.user_info.profile_image_url} alt="" class="h-10 w-10 rounded-full" />
			{/if}
			<div>
				<div class="text-sm font-medium text-success-400">
					Connected as {platformData?.user_info?.display_name || platformData?.user_info?.login}
				</div>
				{#if isManaged}
					<div class="text-xs text-base-400">via {config.oauthProvider} OAuth</div>
				{:else}
					<div class="text-xs text-base-400">Manually linked</div>
				{/if}
				{#if platformData?.platform_user_id}
					<div class="text-xs text-base-400">ID: {platformData.platform_user_id}</div>
				{/if}
			</div>
		</div>
		<div class="space-y-2">
			{#if !isManaged}
				<form method="POST" action="?/refresh" class="flex gap-2">
					<input type="hidden" name="platform" value={platform} />
					<button
						type="submit"
						class="flex-1 cursor-pointer rounded-md bg-base-700 px-4 py-2 text-sm font-medium text-base-50 transition-colors hover:bg-base-600"
					>
						Refresh Profile
					</button>
				</form>
			{/if}
			<form method="POST" action="?/unlink">
				<input type="hidden" name="platform" value={platform} />
				<button
					type="submit"
					class="w-full cursor-pointer rounded-md border border-error-600 px-4 py-2 text-sm font-medium text-error-400 transition-colors hover:bg-error-500/20"
				>
					Disconnect
				</button>
			</form>
		</div>
	{:else}
		{#if platformState.state === 'managed_basic'}
			<div class="mb-3 rounded-md bg-warning-500/20 p-2 text-xs text-warning-400">
				⚠️ Authentication only. Click to enable platform features.
			</div>
		{/if}
		{#if platformState.state === 'managed_basic'}
			{@const href =
				`/auth/oauth-prompt?platform=${platform}&flowType=upgrade` as `/auth/oauth-prompt?platform=${typeof platform}&flowType=upgrade`}
			<a
				href={resolve(href)}
				class="block w-full cursor-pointer rounded-md {colors.bg600} px-4 py-2 text-center text-sm font-medium text-base-50 transition-colors {colors.hoverBg700}"
			>
				{getConnectButtonText()}
			</a>
		{:else}
			{@const href =
				`/auth/oauth-prompt?platform=${platform}&flowType=${flowType}` as `/auth/oauth-prompt?platform=${typeof platform}&flowType=${string}`}
			<a
				href={resolve(href)}
				class="block w-full cursor-pointer rounded-md {colors.bg600} px-4 py-2 text-center text-sm font-medium text-base-50 transition-colors {colors.hoverBg700}"
			>
				{getConnectButtonText()}
			</a>
		{/if}
	{/if}
</div>
