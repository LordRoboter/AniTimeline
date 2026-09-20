import type { WatchedShow } from './type';
import { dateToTime } from './timeline';

export type TimelineLane = {
	shows: WatchedShow[];
};

export function assignLanes(shows: WatchedShow[]): TimelineLane[] {
	const lanes: TimelineLane[] = [];

	for (const show of shows) {
		const start = dateToTime(show.startDate);

		if (start === null) {
			continue;
		}

		const end = dateToTime(show.endDate) ?? start;

		let placed = false;

		for (const lane of lanes) {
			const lastShow = lane.shows[lane.shows.length - 1];

			const lastEnd =
				dateToTime(lastShow.endDate) ??
				dateToTime(lastShow.startDate);

			if (lastEnd !== null && start >= lastEnd) {
				lane.shows.push(show);
				placed = true;
				break;
			}
		}

		if (!placed) {
			lanes.push({
				shows: [show]
			});
		}
	}

	return lanes;
}