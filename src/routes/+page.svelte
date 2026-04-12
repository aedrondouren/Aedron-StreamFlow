<script lang="ts">
	// Landing page
</script>

<svelte:head>
	<title>Ædron Stream Flow</title>
</svelte:head>

<main class="flex min-h-screen flex-col items-center justify-center p-8">
	<div class="text-center">
		<h1 class="mb-4 text-4xl font-bold">StreamFlow</h1>
		<p class="mb-8 text-lg text-neutral-400">Multi-platform stream management for creators</p>

		<div class="flex gap-4">
			<a
				href="/auth/signin"
				class="rounded-lg bg-purple-600 px-6 py-3 font-semibold transition-colors hover:bg-purple-700"
			>
				Get Started
			</a>
			<a
				href="/app"
				class="rounded-lg border border-neutral-600 px-6 py-3 font-semibold transition-colors hover:bg-neutral-700"
			>
				Dashboard
			</a>
		</div>
	</div>
</main>
