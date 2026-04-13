<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Ædron Stream Flow</title>
</svelte:head>

<main class="flex min-h-screen flex-col items-center justify-center bg-base-900 p-8">
	<div class="text-center">
		<h1 class="mb-4 text-4xl font-bold text-base-50">StreamFlow</h1>
		<p class="mb-8 text-lg text-base-400">Multi-platform stream management for creators</p>

		<div class="flex gap-4">
			<a
				href={resolve('/auth/signin')}
				class="cursor-pointer rounded-lg bg-primary-600 px-6 py-3 font-semibold text-base-50 transition-colors hover:bg-primary-700"
			>
				Get Started
			</a>
			<a
				href={resolve('/app')}
				class="cursor-pointer rounded-lg border border-base-600 px-6 py-3 font-semibold text-base-50 transition-colors hover:bg-base-700"
			>
				Dashboard
			</a>
		</div>
	</div>
</main>
