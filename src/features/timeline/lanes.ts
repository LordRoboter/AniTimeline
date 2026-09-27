import { dateToTime } from './timeline';
import type { WatchedShow } from './type';

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

			const lastEnd =
				dateToTime(lastShow.endDate) ??
				dateToTime(lastShow.startDate);

			return lastEnd !== null && start >= lastEnd;
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