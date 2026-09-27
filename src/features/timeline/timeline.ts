import type { WatchedShow } from './type';

export type DateParts = {
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

const FUTURE_BUFFER_YEARS = 0.5;

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

	const start = Math.min(...validDates);
	const end = Math.max(...validDates);

	return {
		start,
		end: end + FUTURE_BUFFER_YEARS * 365.25 * 24 * 60 * 60 * 1000
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

export function timeToX(
	time: number,
	start: number,
	end: number,
	width: number
): number {
	if (start === end) return width / 2;

	return ((time - start) / (end - start)) * width;
}

export function formatDate(date: { day: number | null; month: number | null; year: number | null } | null) {
		if (date === null) return 'Unknown';
		if (!date.year) return 'Unknown';

		return [date.day, date.month, date.year].filter(Boolean).join('/');
	}