<script lang="ts">
	import { formatDate } from '../timeline';
	import type { WatchedShow } from '../type';

	let {
		selectedShow,
		onClose
	}: {
		selectedShow: WatchedShow;
		onClose: () => void;
	} = $props();
</script>

<aside
	class="sticky top-4 h-fit w-80 shrink-0 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950"
>
	<!-- Header -->
	<div
		class="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800"
	>
		<h2 class="truncate pr-4 font-semibold">{selectedShow.title}</h2>
		<button
			type="button"
			class="shrink-0 rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
			onclick={onClose}
			aria-label="Close details"
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M18 6L6 18M6 6l12 12" />
			</svg>
		</button>
	</div>
	<div class="space-y-6 p-5">
		<!-- Image -->
		{#if selectedShow.bannerImage}
			<img
				src={selectedShow.bannerImage}
				alt=""
				class="aspect-video w-full rounded-lg object-cover"
			/>
		{/if}
		<!-- Title -->
		<div><h1 class="text-xl font-bold">{selectedShow.title}</h1></div>
		<!-- Dates -->
		<div>
			<h3 class="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">Watch period</h3>
			<div class="space-y-3">
				<div>
					<div class="text-xs text-gray-500">Started</div>
					<div class="font-medium">{formatDate(selectedShow.startDate)}</div>
				</div>
				<div>
					<div class="text-xs text-gray-500">Finished</div>
					<div class="font-medium">{formatDate(selectedShow.endDate)}</div>
				</div>
			</div>
		</div>
		<!-- ID -->
		<div>
			<h3 class="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">Information</h3>
			<div class="text-sm">ID: {selectedShow.id}</div>
		</div>
	</div>
</aside>
