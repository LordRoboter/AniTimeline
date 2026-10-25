import type { LayoutLoad } from './$types';
import type { UserState } from '$lib/core/model/user_state';
import { defaultUserPreferences } from '$lib/core/settings/default';

export const load: LayoutLoad = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const userState: UserState = {
		preferences: defaultUserPreferences,
		id: null,
		uname: null,
		createdAt: null,
		updatedAt: null
	};

    return { userState };
};