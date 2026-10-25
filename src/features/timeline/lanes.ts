import { dateToTime } from './timeline';
import type { WatchedShow } from '../../lib/core/model/watched_show';

export type TimelineLane = {
	shows: WatchedShow[];
};

export function assignLanes(shows: WatchedShow[]): TimelineLane[] {
	const sorted = [...shows].sort((a, b) => {
		const aStart = dateToTime(a.startDate) ?? Infinity;
		const bStart = dateToTime(b.startDate) ?? Infinity;

		return aStart - bStart;
	});

	const lanes: TimelineLane[] = [];

	for (const show of sorted) {
		const start = dateToTime(show.startDate);

		if (start === null) continue;

		//const end = dateToTime(show.endDate) ?? start;

		const lane = lanes.find((lane) => {
			const lastShow = lane.shows[lane.shows.length - 1];

			const lastStart = dateToTime(lastShow.startDate);
			const lastEnd =
				dateToTime(lastShow.endDate) ??
				dateToTime(lastShow.startDate);
			
			// Prevent a show that was watched within a single day to be overlapped by another
			const needsBeBigger = lastStart === null || lastEnd === null || (lastStart === lastEnd);

			return lastEnd !== null && ((start >= lastEnd && !needsBeBigger) || (start > lastEnd && needsBeBigger));
		});

		if (lane) {
			lane.shows.push(show);
		} else {
			lanes.push({
				shows: [show]
			});
		}
	}

	return lanes;
}