export type WatchedShow = {
	id: number;
	title: string;
	status: StatusType | null;
	startDate: {day: number | null, month: number | null, year: number | null} | null;
	endDate: {day: number | null, month: number | null, year: number | null} | null;
	bannerImage: string | null;
};

export enum StatusType {
	CURRENT,
	PLANNING,
	COMPLETED,
	DROPPED, 
	PAUSED,
	REPEATING
}