<script lang="ts">
	import { loadTimelineRelevantMedia } from '$lib/anilist/media';
	import Timeline from '$lib/components/timeline/Timeline.svelte';
	import { mapMediaToWatchedShows } from '$lib/timeline/mapper';
	import type { WatchedShow } from '$lib/timeline/type';

	let shows = $state<WatchedShow[]>([]);
	let loading = $state(true);
	let error = $state<unknown>(null);

	async function load() {
		loading = true;
		error = null;

		try {
			const media = await loadTimelineRelevantMedia();

			shows = mapMediaToWatchedShows(media);
		} catch (err) {
			error = err;
		} finally {
			loading = false;
		}
	}

	load();
</script>

{#if loading}
	<p>Loading...</p>
{:else if error}
	<p>Failed to load media.</p>
{:else}
	<Timeline {shows} />
{/if}
