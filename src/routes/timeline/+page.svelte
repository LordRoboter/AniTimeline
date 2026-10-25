<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { loadCompletedMedia } from '$lib/anilist/media';
	import { MediaListStatus, MediaType } from '../../../graphql/generated';
	import Timeline from '../../features/timeline/components/Timeline.svelte';
	import { mapMediaToWatchedShows } from '../../lib/core/mapper';
	import type { WatchedShow } from '../../lib/core/model/watched_show';
	import { SvelteMap, SvelteURLSearchParams } from 'svelte/reactivity';

	let username = $state(page.url.searchParams.get('username') ?? '');
	let types = $state(getMediaTypes());

	let media = $state<WatchedShow[]>([]);
	let loading = $state(true);
	let error = $state<unknown>(null);

	function getMediaTypes(): MediaType[] {
		const mediaType = page.url.searchParams.get('mediatype')?.toLowerCase();

		switch (mediaType) {
			case 'manga':
				return [MediaType.Manga];

			case 'anime':
			default:
				return [MediaType.Anime];

			case 'both':
				return [MediaType.Anime, MediaType.Manga];
		}
	}

	async function load(username: string, types: MediaType[], statusNotIn: MediaListStatus[]) {
		return loadMedia(username, types, statusNotIn, false);
	}

	async function reload() {
		return loadMedia(username, types, [MediaListStatus.Planning], true);
	}

	async function loadMedia(
		username: string,
		types: MediaType[],
		statusNotIn: MediaListStatus[],
		force: boolean
	) {
		loading = true;
		error = null;

		try {
			const results = await Promise.all(
				types.map(async (type) => ({
					type,
					shows: await fetchShows(username, type, statusNotIn, force)
				}))
			);

			media = results.flatMap((r) => r.shows);
		} catch (err) {
			error = err;
		} finally {
			loading = false;
		}
	}

	const mediaCache = new SvelteMap<string, Promise<WatchedShow[]>>();

	function getCacheKey(username: string, type: MediaType, statusNotIn: MediaListStatus[]) {
		return JSON.stringify([username.trim().toLowerCase(), type, [...statusNotIn].sort()]);
	}

	async function fetchShows(
		username: string,
		type: MediaType,
		statusNotIn: MediaListStatus[],
		force = false
	): Promise<WatchedShow[]> {
		const key = getCacheKey(username, type, statusNotIn);

		if (!force) {
			const cached = mediaCache.get(key);
			if (cached) return cached;
		}

		const request = loadCompletedMedia(username, type, statusNotIn)
			.then(mapMediaToWatchedShows)
			.catch((err) => {
				// Don't retain failed requests in the cache
				if (mediaCache.get(key) === request) {
					mediaCache.delete(key);
				}
				throw err;
			});

		mediaCache.set(key, request);
		return request;
	}

	async function handleTypeChange(newTypes: MediaType[]) {
		types = newTypes;

		const params = new SvelteURLSearchParams(page.url.searchParams);

		const mediaType = newTypes.length === 2 ? 'both' : (newTypes[0]?.toLowerCase() ?? 'both');

		params.set('mediatype', mediaType);

		await goto(resolve(`/timeline?${params.toString()}`), {
			replaceState: true,
			noScroll: true,
			keepFocus: true
		});

		await load(username, newTypes, [MediaListStatus.Planning]);
	}

	async function handleUserSearch(newUsername: string) {
		username = newUsername;

		const params = new SvelteURLSearchParams(page.url.searchParams);
		params.set('username', newUsername);

		await goto(resolve(`/timeline?${params.toString()}`), {
			replaceState: true,
			noScroll: true,
			keepFocus: true
		});

		load(newUsername, types, [MediaListStatus.Planning]);
	}

	$effect(() => {
		load(username, getMediaTypes(), [MediaListStatus.Planning]);
	});
</script>

<Timeline
	shows={media}
	{loading}
	{error}
	contentType={types}
	onUserSearch={handleUserSearch}
	onTypeChange={handleTypeChange}
	onReload={reload}
/>
