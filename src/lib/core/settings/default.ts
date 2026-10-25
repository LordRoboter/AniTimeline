import type { TimelinePreferences, UserPreferences } from "./model/user_preferences";

export const defaultTimelinePreferences: TimelinePreferences = {
	showNowMarker: true,
	showYearMarkers: true,
};

export const defaultUserPreferences: UserPreferences = {
	theme: 'system',

	timeline: defaultTimelinePreferences,
};