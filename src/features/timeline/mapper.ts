import type { TimelineQueryMediaListType } from '$lib/anilist/types';
import { MediaListStatus } from '../../../graphql/generated';
import { StatusType, type WatchedShow } from './type';

export function mapMediaToWatchedShows(
	result: TimelineQueryMediaListType
): WatchedShow[] {
	return result.map((item) => ({
		id: item.media?.id ?? 0,
		title: item.media?.title?.romaji ?? 'Unknown',
		status: mapMediaStatusToStatusType(item.status),
		startDate: item.startedAt ?? null,
		endDate: item.completedAt ?? null,
		bannerImage: item.media?.bannerImage ?? null,
	}));
}

export function mapMediaStatusToStatusType(
	status: MediaListStatus | null
): StatusType | null {
	switch(status) {
		case MediaListStatus.Completed:
			return StatusType.COMPLETED
		case MediaListStatus.Current:
			return StatusType.CURRENT
		case MediaListStatus.Dropped:
			return StatusType.DROPPED
		case MediaListStatus.Paused:
			return StatusType.PAUSED
		case MediaListStatus.Planning:
			return StatusType.PLANNING
		case MediaListStatus.Repeating:
			return StatusType.REPEATING
		default:
			return null
	}
}