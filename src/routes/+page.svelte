<script module lang="ts">
	import type { PageProps } from './$types.js';
</script>

<script lang="ts">
	let { data }: PageProps = $props();
</script>

<div class="grid size-full place-content-center">
	{#if data.twitchTitle !== null}
		<form class="flex flex-col items-start gap-2" action="?/update-title" method="POST">
			<label>
				<span>Stream Title:</span>
				<input name="title" type="text" value={data.twitchTitle} />
			</label>
			<button>Update</button>
		</form>
	{/if}
	<p class="text-4xl font-bold text-neutral-700">WIP</p>
</div>
