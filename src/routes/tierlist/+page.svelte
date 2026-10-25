<script lang="ts">
	import { loadCompletedMedia } from '$lib/anilist/media';
	import { mapMediaToWatchedShows } from '$lib/core/mapper';
	import type { WatchedShow } from '$lib/core/model/watched_show';
	import { MediaListStatus, MediaType } from '../../../graphql/generated';
	import Tierlist from '../../features/tierlist/components/Tierlist.svelte';
	import { page } from '$app/state';

	let username = $state(page.url.searchParams.get('username') ?? '');

	function getMediaType(): MediaType {
		return page.url.searchParams.get('mediatype') === MediaType.Manga.toLowerCase()
			? MediaType.Manga
			: MediaType.Anime;
	}

	async function load(username: string, type: MediaType, statusNotIn: MediaListStatus[]) {
		try {
			const media = await loadCompletedMedia(username, type, statusNotIn);
			shows = mapMediaToWatchedShows(media);
		} catch {
			//TODO: Like in timeline
		}
	}

	let shows = $state<WatchedShow[]>([]);

	load(username, getMediaType(), [MediaListStatus.Planning]);
</script>

<Tierlist {shows} />
