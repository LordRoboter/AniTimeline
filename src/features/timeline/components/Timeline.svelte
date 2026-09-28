<script lang="ts">
	import { getTimeAxis } from '../axis';
	import { assignLanes } from '../lanes';
	import { dateToX, getTimelineRange } from '../timeline';
	import { Search, X, Info } from '@lucide/svelte/icons';
	import type { WatchedShow } from '../type';

	import SidePanel from './SidePanel.svelte';
	import TimelineAxis from './TimelineAxis.svelte';
	import TimelineGraph from './TimelineGraph.svelte';

	let {
		shows,
		loading = false,
		error = null,
		onUserSearch
	}: {
		shows: WatchedShow[];
		loading?: boolean;
		error?: unknown;
		onUserSearch?: (username: string) => void;
	} = $props();

	let searchOpen = $state(false);
	let username = $state('');

	function toggleSearch() {
		searchOpen = !searchOpen;
	}

	function searchUsername() {
		const value = username.trim();

		if (!value) return;

		onUserSearch?.(value);
		searchOpen = false;
	}

	const minZoomFactor = 1;
	const maxZoomFactor = 50;
	const zoomStep = 1.2;

	const maxPixelsPerYear = 25000;

	const originalPixelsPerYear = $derived.by(() => {
		if (!range || !containerWidth) return 120;

		const years = (range.end - range.start) / (1000 * 60 * 60 * 24 * 365.25);

		if (years <= 0) return 120;

		return Math.min(maxPixelsPerYear, containerWidth / years);
	});

	const minPixelsPerYear = $derived(originalPixelsPerYear);

	let zoomFactor = $state(1.0);
	const pixelsPerYear = $derived(zoomFactor * originalPixelsPerYear);

	const minVerticalZoom = 0.5;
	const maxVerticalZoom = 3;
	const verticalZoomStep = 1.2;

	let verticalZoomFactor = $state(1);

	const minRowHeight = 34;
	const maxRowHeight = 80;
	//const axisHeight = 60;
	const bottomPadding = 20;
	const fittedRowHeight = $derived.by(() => {
		if (!containerHeight || !lanes.length) {
			return minRowHeight;
		}

		const availableHeight = containerHeight - paddingTop - bottomPadding;

		return Math.max(minRowHeight, Math.min(maxRowHeight, availableHeight / lanes.length));
	});

	const rowHeight = $derived(fittedRowHeight * verticalZoomFactor);

	const barHeight = $derived(rowHeight * 0.67);
	const paddingTop = 60;

	let selectedShow = $state<WatchedShow | null>(null);

	const range = $derived(getTimelineRange(shows));
	const lanes = $derived(assignLanes(shows));

	const width = $derived.by(() => {
		if (!range) return minWidth;

		const years = (range.end - range.start) / (1000 * 60 * 60 * 24 * 365.25);

		return years * pixelsPerYear;
	});

	let container = $state<HTMLDivElement>();
	let containerWidth = $state(0);
	let mainContent = $state<HTMLDivElement>();
	let containerHeight = $state(0);

	const minWidth = $derived(containerWidth);
	const minHeight = $derived(containerHeight);

	$effect(() => {
		if (!container || !mainContent) return;

		const containerObserver = new ResizeObserver(([entry]) => {
			containerWidth = entry.contentRect.width;
		});

		const mainContentObserver = new ResizeObserver(([entry]) => {
			containerHeight = entry.contentRect.height;
		});

		containerObserver.observe(container);
		mainContentObserver.observe(mainContent);

		return () => {
			containerObserver.disconnect();
			mainContentObserver.disconnect();
		};
	});

	const axis = $derived(range ? getTimeAxis(range.start, range.end, pixelsPerYear) : null);

	const height = $derived(
		Math.max(lanes.length * rowHeight + paddingTop + bottomPadding, minHeight)
	);

	function getShowPosition(show: WatchedShow) {
		if (!range) {
			return { x: 0, width: 0 };
		}

		const start = dateToX(show.startDate, range.start, range.end, width);

		const end = dateToX(show.endDate, range.start, range.end, width);

		return {
			x: start,
			width: Math.max(end - start, 8)
		};
	}

	function zoomIn() {
		zoomFactor = Math.min(zoomFactor * zoomStep, 20);
	}

	function zoomOut() {
		zoomFactor = Math.max(zoomFactor / zoomStep, 0.25);
	}

	function resetZoom() {
		zoomFactor = 1;
	}

	function zoomVerticalIn() {
		verticalZoomFactor = Math.min(maxVerticalZoom, verticalZoomFactor * verticalZoomStep);
	}

	function zoomVerticalOut() {
		verticalZoomFactor = Math.max(minVerticalZoom, verticalZoomFactor / verticalZoomStep);
	}

	function resetVerticalZoom() {
		verticalZoomFactor = 1;
	}

	function handleWheel(event: WheelEvent) {
		event.preventDefault();

		if (!container) return;

		if (event.ctrlKey || event.metaKey) {
			handleVerticalZoom(event);
			return;
		}
		if (event.altKey) {
			handleHorizontalZoom(event);
			return;
		}
		handleHorizontalZoom(event);
		handleVerticalZoom(event);
	}

	function handleHorizontalZoom(event: WheelEvent) {
		if (!container) return;

		const oldPixelsPerYear = pixelsPerYear;

		const direction = event.deltaY < 0 ? 1 : -1;

		const newZoomFactor =
			direction > 0
				? Math.min(maxZoomFactor, zoomFactor * zoomStep)
				: Math.max(minZoomFactor, zoomFactor / zoomStep);

		if (newZoomFactor === zoomFactor) return;

		const rect = container.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const timelineX = container.scrollLeft + mouseX;

		const newPixelsPerYear = newZoomFactor * originalPixelsPerYear;

		zoomFactor = newZoomFactor;

		requestAnimationFrame(() => {
			if (!container) return;

			const scale = newPixelsPerYear / oldPixelsPerYear;

			container.scrollLeft = timelineX * scale - mouseX;
		});
	}

	function handleVerticalZoom(event: WheelEvent) {
		if (!container) return;

		const oldRowHeight = rowHeight;

		const rect = container.getBoundingClientRect();
		const mouseY = event.clientY - rect.top;

		// Position in the virtual timeline coordinate system
		const timelineY = container.scrollTop + mouseY;

		const direction = event.deltaY < 0 ? 1 : -1;

		const newZoomFactor =
			direction > 0
				? Math.min(maxVerticalZoom, verticalZoomFactor * verticalZoomStep)
				: Math.max(minVerticalZoom, verticalZoomFactor / verticalZoomStep);

		if (newZoomFactor === verticalZoomFactor) return;

		verticalZoomFactor = newZoomFactor;

		requestAnimationFrame(() => {
			if (!container) return;

			const scale = rowHeight / oldRowHeight;

			container.scrollTop = timelineY * scale - mouseY;
		});
	}

	let isDragging = $state(false);
	let didDrag = $state(false);

	let isPointerDown = false;

	let dragStartX = 0;
	let dragStartY = 0;

	let dragStartScrollLeft = 0;
	let dragStartScrollTop = 0;

	function handlePointerDown(event: PointerEvent) {
		if (!container || event.button !== 0) return;

		isPointerDown = true;
		isDragging = false;
		didDrag = false;

		dragStartX = event.clientX;
		dragStartY = event.clientY;

		dragStartScrollLeft = container.scrollLeft;
		dragStartScrollTop = container.scrollTop;
	}

	function handlePointerMove(event: PointerEvent) {
		if (!container || !isPointerDown) return;

		const deltaX = event.clientX - dragStartX;
		const deltaY = event.clientY - dragStartY;

		if (!isDragging) {
			if (Math.hypot(deltaX, deltaY) < 5) return;

			isDragging = true;
			didDrag = true;
		}

		container.scrollLeft = dragStartScrollLeft - deltaX;
		container.scrollTop = dragStartScrollTop - deltaY;
	}

	function handlePointerUp() {
		if (!isPointerDown) return;

		isPointerDown = false;
		isDragging = false;

		if (didDrag) {
			requestAnimationFrame(() => {
				didDrag = false;
			});
		}
	}

	function handlePointerCancel() {
		isPointerDown = false;
		isDragging = false;
		didDrag = false;
	}
</script>

<div class="flex flex-1 h-full min-h-0 w-full flex-col gap-4">
	<!-- Main content -->
	<div bind:this={mainContent} class="flex min-h-0 h-full w-full min-w-0 flex-1 gap-6">
		<!-- Timeline viewport -->
		<div
			bind:this={container}
			role="region"
			aria-label="Timeline"
			class="timeline-scroll min-h-0 min-w-0 flex-1 cursor-grab select-none overflow-auto active:cursor-grabbing"
			style="overscroll-behavior: contain;"
			onwheel={handleWheel}
			onpointerdown={handlePointerDown}
			onpointermove={handlePointerMove}
			onpointerup={handlePointerUp}
			onpointercancel={handlePointerCancel}
			onpointerleave={handlePointerUp}
		>
			{#if range}
				<svg {width} {height} viewBox={`0 0 ${width} ${height}`} class="block max-w-none">
					{#if axis}
						<TimelineAxis {axis} start={range.start} end={range.end} {width} {height} />
					{/if}

					{#each lanes as lane, laneIndex (laneIndex)}
						{#each lane.shows as show (show.id)}
							{@const position = getShowPosition(show)}
							{@const y = paddingTop + laneIndex * rowHeight + (rowHeight - barHeight) / 2}

							<TimelineGraph
								{show}
								{barHeight}
								x={position.x}
								width={position.width}
								{y}
								selected={selectedShow?.id === show.id}
								onSelect={() => {
									if (!didDrag) {
										selectedShow = show;
									}
								}}
							/>
						{/each}
					{/each}
				</svg>
			{/if}

			{#if loading}
				<div
					class="absolute inset-0 z-30 flex items-center justify-center bg-white/40 backdrop-blur-[2px] dark:bg-gray-950/40"
				>
					<div
						class="flex items-center gap-3 rounded-xl border bg-white/95 px-4 py-3 shadow-lg dark:border-gray-700 dark:bg-gray-900/95"
					>
						<div
							class="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-white"
						></div>

						<span class="text-sm font-medium"> Loading timeline... </span>
					</div>
				</div>
			{/if}
			{#if error}
				<div class="absolute left-1/2 top-4 z-30 -translate-x-1/2">
					<div
						class="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-lg dark:border-red-900 dark:bg-red-950/90 dark:text-red-200"
					>
						<span>Failed to load timeline.</span>

						<button
							type="button"
							class="font-medium underline underline-offset-2 hover:no-underline"
							onclick={() => onUserSearch?.(username)}
						>
							Retry
						</button>
					</div>
				</div>
			{/if}

			{#if !range}
				<div class="absolute inset-0 z-20 flex items-center justify-center p-6">
					<div
						class="max-w-sm rounded-xl border bg-white/95 px-5 py-4 text-center shadow-lg dark:border-gray-700 dark:bg-gray-900/95"
					>
						<div
							class="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
						>
							<Info size={20} />
						</div>

						<p class="text-sm font-medium">No timeline data</p>

						<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
							There is no watched media available for this user yet.
						</p>
					</div>
				</div>
			{/if}

			<div class="absolute bottom-4 left-4 z-50">
				{#if searchOpen}
					<div
						class="absolute bottom-12 left-0 w-72 rounded-xl border bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-900"
					>
						<div class="mb-2 flex items-center justify-between">
							<span class="text-sm font-medium">Search user</span>

							<button
								type="button"
								class="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
								aria-label="Close search"
								onclick={() => (searchOpen = false)}
							>
								<X size={16} />
							</button>
						</div>

						<form
							onsubmit={(event) => {
								event.preventDefault();
								searchUsername();
							}}
						>
							<div class="flex gap-2">
								<input
									bind:value={username}
									autofocus
									type="text"
									placeholder="Username"
									class="min-w-0 flex-1 rounded-md border px-3 py-1.5 text-sm outline-none focus:border-gray-400 dark:border-gray-700 dark:bg-gray-800"
								/>

								<button
									type="submit"
									class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900"
									aria-label="Search username"
								>
									<Search size={16} />
								</button>
							</div>
						</form>
					</div>
				{/if}

				<div
					class="flex items-center gap-1 rounded-lg border bg-white/95 p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900/95"
				>
					<button
						type="button"
						class="h-8 w-8 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
						onclick={zoomOut}
						disabled={pixelsPerYear <= minPixelsPerYear}
						aria-label="Zoom out horizontally"
					>
						−
					</button>

					<span class="px-1 text-xs tabular-nums">
						{Math.round(pixelsPerYear)} px/y
					</span>

					<button
						type="button"
						class="h-8 w-8 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
						onclick={zoomIn}
						disabled={pixelsPerYear >= maxPixelsPerYear}
						aria-label="Zoom in horizontally"
					>
						+
					</button>

					<div class="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-700"></div>

					<button
						type="button"
						class="h-8 w-8 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
						onclick={zoomVerticalOut}
						aria-label="Zoom out vertically"
					>
						−
					</button>

					<span class="px-1 text-xs tabular-nums">
						{Math.round(rowHeight)} px/r
					</span>

					<button
						type="button"
						class="h-8 w-8 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
						onclick={zoomVerticalIn}
						aria-label="Zoom in vertically"
					>
						+
					</button>

					<div class="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-700"></div>

					<button
						type="button"
						class="h-8 rounded px-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
						onclick={() => {
							resetZoom();
							resetVerticalZoom();
						}}
					>
						Reset
					</button>

					<div class="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-700"></div>

					<button
						type="button"
						class="flex h-8 w-8 items-center justify-center rounded-md
		text-gray-500 transition-colors
		hover:bg-gray-100 hover:text-gray-900
		dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
						class:bg-gray-100={searchOpen}
						class:text-gray-900={searchOpen}
						class:dark:bg-gray-800={searchOpen}
						class:dark:text-white={searchOpen}
						title="Search user"
						aria-label="Search user"
						onclick={toggleSearch}
					>
						<Search size={16} />
					</button>
				</div>
			</div>

			{#if selectedShow}
				<div
					class="absolute right-4 top-4 bottom-4 z-20 w-80 overflow-hidden rounded-xl border bg-white/95 shadow-xl backdrop-blur dark:bg-gray-900/95"
				>
					<SidePanel {selectedShow} onClose={() => (selectedShow = null)} />
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.timeline-scroll {
		scrollbar-color: #404040 transparent;
	}

	.timeline-scroll::-webkit-scrollbar {
		height: 4px;
	}

	.timeline-scroll::-webkit-scrollbar-thumb {
		background: #404040;
	}

	.timeline-scroll::-webkit-scrollbar-thumb:hover {
		background: #525252;
	}
</style>
