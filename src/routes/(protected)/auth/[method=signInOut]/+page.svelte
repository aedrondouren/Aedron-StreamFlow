<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageProps } from './$types';

	let { params, form }: PageProps = $props();

	const isSignIn = $derived(params.method === 'signin');

	const method = $derived(`Sign ${isSignIn ? 'In' : 'Up'}`);
	const header = $derived(isSignIn ? 'Welcome Back' : 'Create Account');
	const action = $derived(isSignIn ? '?/signIn' : '?/signUp');

	const switchMessage = $derived(isSignIn ? "Don't have an account?" : 'Already have an account?');
	const switchMethod = $derived(`Sign ${isSignIn ? 'Up' : 'In'}`);
</script>

<svelte:head><title>{method} - StreamFlow</title></svelte:head>

<main class="flex min-h-screen items-center justify-center bg-neutral-900 p-4">
	<div class="w-full max-w-md rounded-lg bg-neutral-800 p-8">
		<h1 class="mb-6 text-center text-2xl font-bold">{header}</h1>

		{#if form?.error}
			<div class="mb-4 rounded-md bg-red-500/20 p-3 text-sm text-red-400">
				{form.error}
			</div>
		{/if}

		<form method="POST" {action} class="space-y-4">
			<div>
				<label for="email" class="mb-1 block text-sm font-medium">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					value={form?.email ?? ''}
					required
					class="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-2 text-white placeholder-neutral-400 focus:border-purple-500 focus:outline-none"
					placeholder="you@example.com"
				/>
			</div>

			<div>
				<label for="password" class="mb-1 block text-sm font-medium">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					minlength="6"
					class="w-full rounded-md border border-neutral-600 bg-neutral-700 px-4 py-2 text-white placeholder-neutral-400 focus:border-purple-500 focus:outline-none"
					placeholder="••••••••"
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded-md bg-purple-600 py-2 font-semibold transition-colors hover:bg-purple-700"
			>
				{method}
			</button>
		</form>

		{#if isSignIn}
			<div class="mt-6">
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-neutral-600"></div>
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="bg-neutral-800 px-2 text-neutral-400">Or continue with</span>
					</div>
				</div>

				<div class="mt-4 flex gap-2">
					<form method="POST" action="?/signinWithOAuth&provider=twitch" class="flex-1">
						<button
							type="submit"
							class="flex w-full items-center justify-center gap-2 rounded-md border border-neutral-600 bg-neutral-700 py-2 font-semibold transition-colors hover:bg-neutral-600"
						>
							<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"
								/>
							</svg>
							Twitch
						</button>
					</form>

					<form method="POST" action="?/signinWithOAuth&provider=google" class="flex-1">
						<button
							type="submit"
							class="flex w-full items-center justify-center gap-2 rounded-md border border-neutral-600 bg-neutral-700 py-2 font-semibold transition-colors hover:bg-neutral-600"
						>
							<svg class="h-5 w-5" viewBox="0 0 24 24">
								<path
									fill="currentColor"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="currentColor"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="currentColor"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="currentColor"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
							Google
						</button>
					</form>
				</div>
			</div>
		{/if}

		<p class="mt-6 text-center text-sm text-neutral-400">
			{switchMessage}
			<a
				href={resolve(isSignIn ? '/auth/signup' : '/auth/signin')}
				class="text-purple-400 hover:underline">{switchMethod}</a
			>
		</p>
	</div>
</main>
