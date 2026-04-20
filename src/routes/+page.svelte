<script lang="ts" module>
	import { resolve } from '$app/paths';
</script>

<script lang="ts">
	import favicon from '$lib/assets/favicon.png';
</script>

<svelte:head>
	<title>StreamFlow — One Dashboard for All Your Streams</title>
	<meta
		name="description"
		content="Manage all your streaming platforms from one dashboard. Sync titles, chat, and overlays across Twitch, Kick, and YouTube Live."
	/>
</svelte:head>

<div class="min-h-screen bg-base-900">
	<header class="sticky top-0 z-50 border-b border-base-700 bg-base-800/95 backdrop-blur-sm">
		<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
			<div class="flex items-center gap-3">
				<img src={favicon} alt="" class="h-10 w-10" />
				<span class="text-lg font-bold text-primary-400">StreamFlow</span>
			</div>
			<div class="flex items-center gap-3">
				<a
					href="https://github.com/aedrondouren/Aedron-StreamFlow"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-base-300 transition-colors hover:bg-base-700 hover:text-base-50"
				>
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path
							fill-rule="evenodd"
							d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
							clip-rule="evenodd"
						/>
					</svg>
					<span class="hidden sm:inline">GitHub</span>
				</a>
				<a
					href={resolve('/app')}
					class="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-base-50 transition-colors hover:bg-primary-700"
				>
					Dashboard
				</a>
			</div>
		</div>
	</header>

	<main>
		<section class="relative overflow-hidden px-6 py-24 sm:py-32">
			<div class="mx-auto max-w-4xl text-center">
				<h1 class="text-4xl font-bold tracking-tight text-base-50 sm:text-6xl">
					One dashboard to rule<br />all your streams
				</h1>
				<p class="mx-auto mt-6 max-w-2xl text-lg text-base-300">
					Manage all your streaming platforms from a single place. Sync your titles, chat with your
					viewers, and control your stream — all at once.
				</p>
				<div class="mt-10 flex items-center justify-center gap-4">
					<a
						href={resolve('/app')}
						class="rounded-lg bg-primary-600 px-8 py-3 text-base font-semibold text-base-50 transition-colors hover:bg-primary-700"
					>
						Get Started
					</a>
				</div>
			</div>
		</section>

		<section class="border-y border-base-800 bg-base-800/50 px-6 py-24">
			<div class="mx-auto max-w-7xl">
				<div class="text-center">
					<h2 class="text-3xl font-bold text-base-50">Everything you need to stream</h2>
					<p class="mt-4 text-base-300">Powerful features designed for multi-platform streamers</p>
				</div>
				<div class="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
					<div class="rounded-xl border border-base-700 bg-base-800 p-6">
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600/10">
							<svg
								class="h-6 w-6 text-primary-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
								/>
							</svg>
						</div>
						<h3 class="mt-4 text-lg font-semibold text-base-50">Sync Everything</h3>
						<p class="mt-2 text-sm text-base-300">
							Update your stream title, description, and tags across all platforms at once.
						</p>
					</div>
					<div class="rounded-xl border border-base-700 bg-base-800 p-6">
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600/10">
							<svg
								class="h-6 w-6 text-primary-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
								/>
							</svg>
						</div>
						<h3 class="mt-4 text-lg font-semibold text-base-50">One Chat</h3>
						<p class="mt-2 text-sm text-base-300">
							View and respond to all your platform chats from a single window.
						</p>
					</div>
					<div class="rounded-xl border border-base-700 bg-base-800 p-6">
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600/10">
							<svg
								class="h-6 w-6 text-primary-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<h3 class="mt-4 text-lg font-semibold text-base-50">Stream Overlays</h3>
						<p class="mt-2 text-sm text-base-300">
							Platform-specific overlays that work with your streaming software.
						</p>
					</div>
					<div class="rounded-xl border border-base-700 bg-base-800 p-6">
						<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600/10">
							<svg
								class="h-6 w-6 text-primary-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
						</div>
						<h3 class="mt-4 text-lg font-semibold text-base-50">Always Synced</h3>
						<p class="mt-2 text-sm text-base-300">
							Changes sync instantly across all your devices in real-time.
						</p>
					</div>
				</div>
			</div>
		</section>

		<section class="px-6 py-24">
			<div class="mx-auto max-w-7xl">
				<div class="text-center">
					<h2 class="text-3xl font-bold text-base-50">Works with your favorite platforms</h2>
					<p class="mt-4 text-base-300">Connect and manage multiple streaming services</p>
				</div>
				<div class="mt-12 flex flex-wrap items-center justify-center gap-6">
					<a
						href="https://www.twitch.tv"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-2 rounded-full border border-base-700 bg-base-800 px-6 py-3 transition-colors hover:bg-base-700"
					>
						<svg class="h-5 w-5 text-twitch-500" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"
							/>
						</svg>
						<span class="font-medium text-base-50">Twitch</span>
					</a>
					<a
						href="https://kick.com"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-2 rounded-full border border-base-700 bg-base-800 px-6 py-3 transition-colors hover:bg-base-700"
					>
						<svg class="h-5 w-5 text-kick-500" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M3.98 3h6.01v4h2V5h2V3H20v6.01h-2v2h-2v2h2v2h2v6.01h-6.01v-2h-2v-2h-2v4H3.98z"
							/>
						</svg>
						<span class="font-medium text-base-50">Kick</span>
					</a>
					<a
						href="https://www.youtube.com/live"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-2 rounded-full border border-base-700 bg-base-800 px-6 py-3 transition-colors hover:bg-base-700"
					>
						<svg class="h-5 w-5 text-youtube-500" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
							/>
						</svg>
						<span class="font-medium text-base-50">YouTube Live</span>
					</a>
				</div>
				<p class="mt-8 text-center text-sm text-base-400">More platforms coming soon</p>
			</div>
		</section>

		<section class="border-y border-base-800 bg-base-800/50 px-6 py-24">
			<div class="mx-auto max-w-4xl">
				<div class="text-center">
					<h2 class="text-3xl font-bold text-base-50">How it works</h2>
					<p class="mt-4 text-base-300">Get started in three simple steps</p>
				</div>
				<div class="mt-16 grid gap-8 sm:grid-cols-3">
					<div class="relative text-center">
						<div
							class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-600/10"
						>
							<svg
								class="h-8 w-8 text-primary-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
								/>
							</svg>
						</div>
						<div class="mt-4 text-2xl font-bold text-primary-400">1</div>
						<h3 class="mt-2 text-lg font-semibold text-base-50">Connect Accounts</h3>
						<p class="mt-2 text-sm text-base-300">Link your streaming platforms securely</p>
					</div>
					<div class="relative text-center">
						<div
							class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-600/10"
						>
							<svg
								class="h-8 w-8 text-primary-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
								/>
							</svg>
						</div>
						<div class="mt-4 text-2xl font-bold text-primary-400">2</div>
						<h3 class="mt-2 text-lg font-semibold text-base-50">Manage Streams</h3>
						<p class="mt-2 text-sm text-base-300">Control everything from one dashboard</p>
					</div>
					<div class="relative text-center">
						<div
							class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-600/10"
						>
							<svg
								class="h-8 w-8 text-primary-400"
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
						<div class="mt-4 text-2xl font-bold text-primary-400">3</div>
						<h3 class="mt-2 text-lg font-semibold text-base-50">Go Live</h3>
						<p class="mt-2 text-sm text-base-300">Stream to all platforms simultaneously</p>
					</div>
				</div>
			</div>
		</section>

		<section class="px-6 py-24">
			<div class="mx-auto max-w-4xl text-center">
				<h2 class="text-3xl font-bold text-base-50">Ready to simplify your streams?</h2>
				<p class="mt-4 text-base-300">
					Join streamers who manage their content smarter, not harder.
				</p>
				<div class="mt-10">
					<a
						href={resolve('/app')}
						class="inline-block rounded-lg bg-primary-600 px-8 py-3 text-base font-semibold text-base-50 transition-colors hover:bg-primary-700"
					>
						Get Started Now
					</a>
				</div>
			</div>
		</section>
	</main>

	<footer class="border-t border-base-800 bg-base-800/50 px-6 py-8">
		<div class="mx-auto max-w-7xl">
			<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
				<p class="text-sm text-base-400">© 2025 Aedron</p>
				<a
					href="https://github.com/aedrondouren"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-2 text-sm text-base-400 transition-colors hover:text-base-300"
				>
					<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path
							fill-rule="evenodd"
							d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
							clip-rule="evenodd"
						/>
					</svg>
					github.com/aedrondouren
				</a>
			</div>
		</div>
	</footer>
</div>
