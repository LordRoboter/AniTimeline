import type { WatchedShow } from './type';

type DateParts = {
	day: number | null;
	month: number | null;
	year: number | null;
};

export function dateToTime(date: DateParts | null): number | null {
	if (!date?.year) return null;

	return Date.UTC(
		date.year,
		(date.month ?? 1) - 1,
		date.day ?? 1
	);
}

export function getTimelineRange(shows: WatchedShow[]) {
	const dates = shows.flatMap((show) => [
		dateToTime(show.startDate),
		dateToTime(show.endDate)
	]);

	const validDates = dates.filter(
		(date): date is number => date !== null
	);

	if (validDates.length === 0) {
		return null;
	}

	return {
		start: Math.min(...validDates),
		end: Math.max(...validDates)
	};
}

export function dateToX(
	date: DateParts | null,
	start: number,
	end: number,
	width: number
): number {
	const time = dateToTime(date);

	if (time === null) return 0;

	if (start === end) return width / 2;

	return ((time - start) / (end - start)) * width;
}