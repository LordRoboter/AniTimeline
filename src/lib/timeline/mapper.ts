import type { TimelineQueryMediaListType } from '$lib/anilist/types';
import type { WatchedShow } from './type';

export function mapMediaToWatchedShows(
	result: TimelineQueryMediaListType
): WatchedShow[] {
	return result.map((item) => ({
		id: item.media?.id ?? 0,
		title: item.media?.title?.romaji ?? 'Unknown',
		startDate: item.startedAt ?? null,
		endDate: item.completedAt ?? null
	}));
}