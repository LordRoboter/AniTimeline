<script lang="ts">
	import ChoiceCard from '$lib/components/rank/ChoiceCard.svelte';
	import { AnimeCharactersDocument } from '../../../graphql/generated';
	import { anilist } from '$lib/anilist/client';

	export async function load() {
		const data = await anilist(AnimeCharactersDocument, {
			id: 1215
		});

		console.log(data.Media);

		return {
			media: data.Media
		};
	}
</script>

<div class="mainWrapper">
	<div class="titleWrapper">
		<h1>Who is better?</h1>
		<button onclick={load}>load</button>
	</div>
	<div class="choicesWrapper">
		<ChoiceCard title="Ao" image="/images/test.jpg" />
		<ChoiceCard title="Kaoruko" image="/images/test2.jpg" />
	</div>
</div>

<style>
	.titleWrapper {
		width: 100%;
		align-items: center;
		justify-content: center;
		font-family: 'Open Sans', sans-serif;
		font-optical-sizing: auto;
		color: white;
	}
	h1 {
		text-align: center;
		font-size: 2rem;
	}
	.mainWrapper {
		width: 100%;
		height: 100%;
		padding: 2rem;
		box-sizing: border-box;
	}
	.choicesWrapper {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
