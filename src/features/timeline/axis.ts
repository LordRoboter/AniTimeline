export type TimeUnit =
	| 'days'
	| 'weeks'
	| 'month'
	| 'quarter'
	| 'year'
	| '2years'
	| '5years';

export type TimeTick = {
	time: number;
	label: string;
};

export type TimeYearMarker = {
	time: number;
	label: string;
};

export type TimeAxis = {
	unit: TimeUnit;
	ticks: TimeTick[];
	yearMarkers: TimeYearMarker[];
};

const MIN_TICK_SPACING = 70;

const UNIT_MONTHS: Record<TimeUnit, number> = {
	days: 1 / 30.4375,
	weeks: 7 / 30.4375,
	month: 1,
	quarter: 3,
	year: 12,
	'2years': 24,
	'5years': 60
};

export function getTimeAxis(
	start: number,
	end: number,
	pixelsPerYear: number
): TimeAxis {
	const unit = getTimeUnit(pixelsPerYear);

	const showYearMarkers =
	unit === 'days' ||
	unit === 'weeks' ||
	unit === 'month' ||
	unit === 'quarter';

	return {
		unit,
		ticks: generateTicks(start, end, unit),
		yearMarkers: showYearMarkers
			? generateYearMarkers(start, end)
			: []
	};
}

function generateYearMarkers(
	start: number,
	end: number
): TimeYearMarker[] {
	const startDate = new Date(start);
	const endDate = new Date(end);

	const markers: TimeYearMarker[] = [];

	let year = startDate.getUTCFullYear();

	while (year <= endDate.getUTCFullYear()) {
		const time = Date.UTC(year, 0, 1);


		if (time >= start && time <= end) {
			markers.push({
				time,
				label: String(year)
			});
		}

		year++;
	}

	return markers;
}

function getTimeUnit(pixelsPerYear: number): TimeUnit {
	const pixelsPerMonth = pixelsPerYear / 12;

	const units: TimeUnit[] = [
		'days',
		'weeks',
		'month',
		'quarter',
		'year',
		'2years',
		'5years'
	];

	for (const unit of units) {
		const spacing = pixelsPerMonth * UNIT_MONTHS[unit];

		if (spacing >= MIN_TICK_SPACING) {
			return unit;
		}
	}

	return '5years';
}

function generateTicks(
	start: number,
	end: number,
	unit: TimeUnit
): TimeTick[] {
	const date = createFirstTick(start, unit);
	const ticks: TimeTick[] = [];

	let isFirstTick = true;

	while (date.getTime() <= end) {
		const time = date.getTime();

		if (time >= start) {
			ticks.push({
				time,
				label: formatTick(date, unit, isFirstTick)
			});

			isFirstTick = false;
		}

		advanceDate(date, unit);
	}

	return ticks;
}

function createFirstTick(start: number, unit: TimeUnit): Date {
	const startDate = new Date(start);

	switch (unit) {
		case 'days': {
			return new Date(
				Date.UTC(
					startDate.getUTCFullYear(),
					startDate.getUTCMonth(),
					startDate.getUTCDate()
				)
			);
		}

		case 'weeks': {
			const date = new Date(
				Date.UTC(
					startDate.getUTCFullYear(),
					startDate.getUTCMonth(),
					startDate.getUTCDate()
				)
			);

			// Monday = 0
			const day = (date.getUTCDay() + 6) % 7;

			date.setUTCDate(date.getUTCDate() - day);

			return date;
		}

		case 'month':
			return new Date(
				Date.UTC(
					startDate.getUTCFullYear(),
					startDate.getUTCMonth(),
					1
				)
			);

		case 'quarter': {
			const month = startDate.getUTCMonth();

			return new Date(
				Date.UTC(
					startDate.getUTCFullYear(),
					month - (month % 3),
					1
				)
			);
		}

		case 'year':
			return new Date(
				Date.UTC(
					startDate.getUTCFullYear(),
					0,
					1
				)
			);

		case '2years': {
			const year =
				Math.floor(startDate.getUTCFullYear() / 2) * 2;

			return new Date(Date.UTC(year, 0, 1));
		}

		case '5years': {
			const year =
				Math.floor(startDate.getUTCFullYear() / 5) * 5;

			return new Date(Date.UTC(year, 0, 1));
		}
	}
}

function advanceDate(date: Date, unit: TimeUnit) {
	switch (unit) {
		case 'days':
			date.setUTCDate(date.getUTCDate() + 1);
			break;

		case 'weeks':
			date.setUTCDate(date.getUTCDate() + 7);
			break;

		case 'month':
			date.setUTCMonth(date.getUTCMonth() + 1);
			break;

		case 'quarter':
			date.setUTCMonth(date.getUTCMonth() + 3);
			break;

		case 'year':
			date.setUTCFullYear(date.getUTCFullYear() + 1);
			break;

		case '2years':
			date.setUTCFullYear(date.getUTCFullYear() + 2);
			break;

		case '5years':
			date.setUTCFullYear(date.getUTCFullYear() + 5);
			break;
	}
}

function formatTick(
	date: Date,
	unit: TimeUnit,
	isFirstTick: boolean
): string {
	switch (unit) {
		case 'days':
case 'weeks': {
	const label = date.toLocaleDateString(undefined, {
		day: 'numeric',
		month: 'short',
		timeZone: 'UTC'
	});

	return isFirstTick
		? `${label} ${date.getUTCFullYear()}`
		: label;
}
		case 'month': {
			const month = date.toLocaleDateString(undefined, {
				month: 'short',
				timeZone: 'UTC'
			});

			if (isFirstTick) {
				return `${month} ${date.getUTCFullYear()}`;
			}

			return month;
		}

		case 'quarter': {
	const monthNames = [
		'January',
		'April',
		'July',
		'October'
	];

	return `${monthNames[Math.floor(date.getUTCMonth() / 3)]}`;
}

		default:
			return String(date.getUTCFullYear());
	}
}