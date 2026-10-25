<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import type { UserState } from '$lib/core/model/user_state';
	import { setUserState } from '$lib/core/state/user_state_context.js';
	import { UserStateService } from '$lib/core/state/user_state_service';

	let {
		data,
		children
	}: {
		data: { userState: UserState };
		children: import('svelte').Snippet;
	} = $props();

	const userState = setUserState();
	const userStateService = new UserStateService();

	$effect(() => {
		userState.initialize(data.userState, userStateService);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Varela+Round&display=swap');

	:global(body) {
		background-color: #121212;
		height: 100vh;
		margin: 0;
		padding: 0;
		color: white;
	}
</style>
