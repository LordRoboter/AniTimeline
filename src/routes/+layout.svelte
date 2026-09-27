<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
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
