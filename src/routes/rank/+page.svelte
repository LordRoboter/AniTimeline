<script lang="ts">
	import ChoiceCard from '$lib/components/rank/ChoiceCard.svelte';
	import { loadCharacters } from '$lib/code/ranking/tournament';

	let characters = $state<Awaited<ReturnType<typeof loadCharacters>>>([]);
	let loading = $state(false);
	let error = null;

	async function load() {
		loading = true;

		try {
			characters = await loadCharacters();
		} finally {
			loading = false;
		}
	}

	load();
</script>

<div class="min-h-screen w-full p-8">
	<div class="flex w-full flex-col items-center justify-center">
		<h1 class="text-center text-3xl font-bold text-white">Who is better?</h1>

		<button
			class="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
			onclick={load}
		>
			Load
		</button>
	</div>

	<div class="mt-8 flex flex-wrap items-center justify-center gap-4">
		{#each characters as character (character.id)}
			<ChoiceCard
				title={character.name?.full ?? 'Unknown'}
				image={character.image?.large ?? '/images/test.jpg'}
			/>
		{/each}
	</div>
</div>
