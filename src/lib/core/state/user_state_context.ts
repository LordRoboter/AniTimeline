import { getContext, setContext } from 'svelte';
import { UserStateManager } from './user_state.svelte';

const USER_STATE_KEY = Symbol('user-state');

export function setUserState() {
	const userState = new UserStateManager();

	setContext(USER_STATE_KEY, userState);

	return userState;
}

export function getUserState() {
	const userState = getContext<UserStateManager>(
		USER_STATE_KEY
	);

	if (!userState) {
		throw new Error(
			'UserState has not been initialized'
		);
	}

	return userState;
}