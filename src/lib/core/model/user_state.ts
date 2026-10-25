import type { UserPreferences } from "../settings/model/user_preferences";

export type UserState = {
	id: string | null;
    uname: string | null;
	createdAt: Date | null;
	updatedAt: Date | null;
    preferences: UserPreferences;
};