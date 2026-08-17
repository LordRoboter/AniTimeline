<script lang="ts">
	let anilistAccount = $state('');

	function fetchAnime() {
		console.log(anilistAccount);
	}
</script>

<div>
	<input class="accInput" bind:value={anilistAccount} placeholder="AniList account" />
	<button onclick={fetchAnime}>Fetch</button>
</div>
