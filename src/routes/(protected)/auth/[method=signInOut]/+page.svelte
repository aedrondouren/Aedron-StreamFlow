<script lang="ts" module>
	import { resolve } from '$app/paths';
	import { Button, Separator } from '$lib/components';
	import { page } from '$app/state';
	import { validatePasswordMatch } from '$lib/validation/auth';
	import type { PageProps } from './$types';
</script>

<script lang="ts">
	let { params, form }: PageProps = $props();

	// Error message mapping for query parameter errors
	const errorMessages: Record<string, string> = {
		oauth_provider_failed:
			'OAuth provider configuration failed. Please use manual linking or try again later.',
		auth_callback_failed: 'Authentication failed. Please try again.',
		invalid_credentials: 'Invalid email or password.',
		email_not_confirmed: 'Please confirm your email before signing in.',
		user_not_found: 'No account found with this email.',
		invalid_grant: 'Invalid or expired login link.',
		auth_required: 'Please sign in to continue.',
		session_expired: 'Your session has expired. Please sign in again.'
	};

	// Get error from query params or form
	const queryError = $derived(page.url.searchParams.get('error'));
	const displayError = $derived(
		form?.error || (queryError ? errorMessages[queryError] || queryError : null)
	);

	const isSignIn = $derived(params.method === 'signin');

	const method = $derived(`Sign ${isSignIn ? 'In' : 'Up'}`);
	const header = $derived(isSignIn ? 'Welcome Back' : 'Create Account');
	const action = $derived(isSignIn ? '?/signIn' : '?/signUp');

	const switchMessage = $derived(isSignIn ? "Don't have an account?" : 'Already have an account?');
	const switchMethod = $derived(`Sign ${isSignIn ? 'Up' : 'In'}`);

	// Password confirmation state
	let password = $state('');
	let passwordConfirm = $state('');
	let passwordError = $state('');

	function validatePasswords() {
		if (!isSignIn) {
			const error = validatePasswordMatch(password, passwordConfirm);
			if (error) {
				passwordError = error;
				return false;
			}
		}
		passwordError = '';
		return true;
	}

	function handleSubmit(event: SubmitEvent) {
		if (!isSignIn && !validatePasswords()) {
			event.preventDefault();
		}
	}
</script>

<svelte:head><title>{method} - StreamFlow</title></svelte:head>

<main class="flex min-h-screen items-center justify-center bg-base-900 p-4">
	<div class="w-full max-w-md rounded-lg bg-base-800 p-8">
		<h1 class="mb-6 text-center text-2xl font-bold text-base-50">{header}</h1>

		{#if displayError}
			<div class="mb-4 rounded-md bg-error-500/20 p-3 text-sm text-error-300">
				{displayError}
			</div>
		{/if}

		<form method="POST" {action} class="space-y-4" onsubmit={handleSubmit}>
			<div>
				<label for="email" class="mb-1 block text-sm font-medium text-base-300">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					value={form?.email ?? ''}
					required
					class="w-full rounded-md border border-base-600 bg-base-700 px-4 py-2 text-base-50 placeholder-base-400 focus:border-primary-500 focus:outline-none"
					placeholder="you@example.com"
				/>
			</div>

			<div>
				<label for="password" class="mb-1 block text-sm font-medium text-base-300">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					minlength="6"
					bind:value={password}
					class="w-full rounded-md border border-base-600 bg-base-700 px-4 py-2 text-base-50 placeholder-base-400 focus:border-primary-500 focus:outline-none"
					placeholder="••••••••"
				/>
			</div>

			{#if !isSignIn}
				<div>
					<label for="passwordConfirm" class="mb-1 block text-sm font-medium text-base-300">
						Confirm Password
					</label>
					<input
						type="password"
						id="passwordConfirm"
						name="passwordConfirm"
						required
						minlength="6"
						bind:value={passwordConfirm}
						onblur={validatePasswords}
						class="w-full rounded-md border border-base-600 bg-base-700 px-4 py-2 text-base-50 placeholder-base-400 focus:border-primary-500 focus:outline-none"
						placeholder="••••••••"
					/>
					{#if passwordError}
						<p class="mt-1 text-sm text-error-300">{passwordError}</p>
					{/if}
				</div>
			{/if}

			<Button.Root
				type="submit"
				class="w-full cursor-pointer rounded-md bg-primary-600 py-2 font-semibold text-base-50 transition-colors hover:bg-primary-700"
			>
				{method}
			</Button.Root>
		</form>

		{#if isSignIn}
			<div class="mt-6">
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-base-600"></div>
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="bg-base-800 px-2 text-base-300">Or continue with</span>
					</div>
				</div>

				<div class="sr-only">
					<Separator.Root />
				</div>

				<div class="mt-4 grid grid-cols-3 gap-2">
					<!-- Twitch OAuth -->
					<form method="POST" action="?/signinWithOAuth&provider=twitch" class="contents">
						<input type="hidden" name="flowType" value="signup" />
						<Button.Root
							type="submit"
							class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-base-600 bg-base-700 py-2 font-semibold text-base-50 transition-colors hover:bg-base-600"
						>
							<svg class="h-5 w-5 text-twitch-500" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"
								/>
							</svg>
							Twitch
						</Button.Root>
					</form>

					<!-- YouTube OAuth -->
					<form method="POST" action="?/signinWithOAuth&provider=google" class="contents">
						<input type="hidden" name="flowType" value="signup" />
						<input type="hidden" name="scope" value="openid profile email" />
						<Button.Root
							type="submit"
							class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-base-600 bg-base-700 py-2 font-semibold text-base-50 transition-colors hover:bg-base-600"
						>
							<svg class="h-5 w-5 text-youtube-500" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
								/>
							</svg>
							YouTube
						</Button.Root>
					</form>

					<!-- Kick OAuth -->
					<form method="POST" action="?/signinWithOAuth&provider=kick" class="contents">
						<input type="hidden" name="flowType" value="signup" />
						<Button.Root
							type="submit"
							class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-base-600 bg-base-700 py-2 font-semibold text-base-50 transition-colors hover:bg-base-600"
						>
							<svg class="h-5 w-5 text-kick-500" viewBox="0 0 24 24" fill="currentColor">
								<path
									d="M3.98 3h6.01v4h2V5h2V3H20v6.01h-2v2h-2v2h2v2h2v6.01h-6.01v-2h-2v-2h-2v4H3.98z"
								/>
							</svg>
							Kick
						</Button.Root>
					</form>
				</div>
			</div>
		{/if}

		<p class="mt-6 text-center text-sm text-base-300">
			{switchMessage}
			<a
				href={resolve(isSignIn ? '/auth/signup' : '/auth/signin')}
				class="cursor-pointer text-primary-400 hover:underline"
			>
				{switchMethod}
			</a>
		</p>
	</div>
</main>
