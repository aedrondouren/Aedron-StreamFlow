<script lang="ts">
</script>

<div class="space-y-6">
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		<div class="rounded-lg bg-base-800 p-6">
			<h3 class="text-sm font-medium text-base-300">Active Streams</h3>
			<p class="mt-2 text-3xl font-bold text-base-50">
				<!-- {streams.filter((s) => s.status === 'live').length} -->
			</p>
		</div>

		<div class="rounded-lg bg-base-800 p-6">
			<h3 class="text-sm font-medium text-base-300">Connected Platforms</h3>
			<!-- <p class="mt-2 text-3xl font-bold text-base-50">{platforms.length}</p> -->
		</div>

		<div class="rounded-lg bg-base-800 p-6">
			<h3 class="text-sm font-medium text-base-300">Scheduled</h3>
			<p class="mt-2 text-3xl font-bold text-base-50">
				<!-- {streams.filter((s) => s.status === 'scheduled').length} -->
			</p>
		</div>
	</div>

	<div class="rounded-lg bg-base-800 p-6">
		<h2 class="mb-4 text-lg font-semibold text-base-50">Recent Streams</h2>

		<!-- {#if streams.length === 0}
			<p class="text-base-400">No streams configured yet.</p>
		{:else}
			<div class="space-y-3">
				{#each streams as stream (stream.id)}
					<div class="flex items-center justify-between rounded-md bg-base-700 p-4">
						<div class="flex items-center gap-3">
							<span class={getDotClasses(stream.status)}></span>
							<div>
								<p class="font-medium text-base-50">{stream.title || 'Untitled Stream'}</p>
								<p class="text-sm text-base-400">{stream.platform}</p>
							</div>
						</div>
						<span class={getStatusClasses(stream.status)}>
							{stream.status}
						</span>
					</div>
				{/each}
			</div>
		{/if} -->
	</div>
</div>
