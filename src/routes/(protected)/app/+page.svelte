<script lang="ts">
</script>

<svelte:head>
	<title>Dashboard - StreamFlow</title>
</svelte:head>

<div class="space-y-6">
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		<div
			class="rounded-lg border border-base-200 bg-base-50 p-6 dark:border-base-700 dark:bg-base-800"
		>
			<h3 class="text-sm font-medium text-base-700 dark:text-base-300">Active Streams</h3>
			<p class="mt-2 text-3xl font-bold text-base-900 dark:text-base-50">0</p>
		</div>

		<div
			class="rounded-lg border border-base-200 bg-base-50 p-6 dark:border-base-700 dark:bg-base-800"
		>
			<h3 class="text-sm font-medium text-base-700 dark:text-base-300">Connected Platforms</h3>
			<p class="mt-2 text-3xl font-bold text-base-900 dark:text-base-50">0</p>
		</div>

		<div
			class="rounded-lg border border-base-200 bg-base-50 p-6 dark:border-base-700 dark:bg-base-800"
		>
			<h3 class="text-sm font-medium text-base-700 dark:text-base-300">Scheduled</h3>
			<p class="mt-2 text-3xl font-bold text-base-900 dark:text-base-50">0</p>
		</div>
	</div>

	<div
		class="rounded-lg border border-base-200 bg-base-50 p-6 dark:border-base-700 dark:bg-base-800"
	>
		<h2 class="mb-4 text-lg font-semibold text-base-900 dark:text-base-50">Recent Streams</h2>
		<p class="text-base-700 dark:text-base-400">No streams configured yet.</p>
	</div>
</div>
