<script lang="ts">
	let { title, image } = $props();
</script>

<div class="cardWrapper">
	<div class="cardContentsWrapper">
		<img src={image} alt={title} />

		<button>{title}</button>
	</div>
</div>

<style>
	img {
		max-width: 100%;
		border-radius: 1rem;
	}
	.cardWrapper {
		transition: transform ease-in-out 0.2s;
		margin: 1rem;
		flex: 1;
	}
	.cardWrapper:hover {
		transform: scale(1.02);
	}
	.cardContentsWrapper {
		display: block;
	}
	button {
		width: 100%;
		font-family: 'Varela Round', sans-serif;
		font-size: x-large;
		font-weight: bolder;
		border: 0px;
		border-radius: 0.5rem;
		padding: 1rem;
		background-color: red;
		color: white;
	}
</style>
