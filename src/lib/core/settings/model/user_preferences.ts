export type UserPreferences = {
	theme: 'light' | 'dark' | 'system';
	timeline: TimelinePreferences;
};

export type TimelinePreferences = {
	showNowMarker: boolean;
	showYearMarkers: boolean;
};
