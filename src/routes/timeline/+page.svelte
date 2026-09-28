<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { loadTimelineRelevantMedia } from '$lib/anilist/media';
	import { MediaType } from '../../../graphql/generated';
	import Timeline from '../../features/timeline/components/Timeline.svelte';
	import { mapMediaToWatchedShows } from '../../features/timeline/mapper';
	import type { WatchedShow } from '../../features/timeline/type';

	let username = $state(page.url.searchParams.get('username') ?? '');

	let shows = $state<WatchedShow[]>([]);
	let loading = $state(true);
	let error = $state<unknown>(null);

	function getMediaType(): MediaType {
		return page.url.searchParams.get('mediatype') === MediaType.Manga.toLowerCase()
			? MediaType.Manga
			: MediaType.Anime;
		console.log(page.url.searchParams.get('mediatype'));
	}

	async function load(username: string, type: MediaType) {
		loading = true;
		error = null;

		try {
			const media = await loadTimelineRelevantMedia(username, type);
			shows = mapMediaToWatchedShows(media);
		} catch (err) {
			error = err;
		} finally {
			loading = false;
		}
	}

	async function handleUserSearch(newUsername: string) {
		username = newUsername;

		const params = new URLSearchParams(page.url.searchParams);
		params.set('username', newUsername);

		await goto(`?${params.toString()}`, {
			replaceState: true,
			noScroll: true,
			keepFocus: true
		});

		load(newUsername, getMediaType());
	}

	load(username, getMediaType());
</script>

<Timeline {shows} {loading} {error} onUserSearch={handleUserSearch} />
