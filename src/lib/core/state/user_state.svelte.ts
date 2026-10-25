import type { UserState } from '../model/user_state';
import type { TimelinePreferences } from '../settings/model/user_preferences';
import { UserStateService } from './user_state_service';

export class UserStateManager {
	state = $state<UserState | null>(null);

	private service: UserStateService | null = null;

	get preferences() {
		return this.state?.preferences;
	}

	get timelinePreferences() {
		return this.state?.preferences.timeline;
	}

	initialize(state: UserState, service: UserStateService) {
		this.state = state;
		this.service = service;
	}

	async updateTimelinePreferences(
		updates: Partial<TimelinePreferences>
	) {
		if (!this.state) {
			throw new Error('UserState has not been initialized');
		}

		this.state.preferences.timeline = {
			...this.state.preferences.timeline,
			...updates
		};

		await this.service?.updateTimelinePreferences(updates);
	}
}