export type WatchedShow = {
	id: number;
	title: string;
	startDate: {day: number | null, month: number | null, year: number | null} | null;
	endDate: {day: number | null, month: number | null, year: number | null} | null;
	image?: string;
};