<script lang="ts">
	import type { WatchedShow } from '$lib/timeline/type';
	import { dateToX, getTimelineRange } from '$lib/timeline/timeline';
	import { assignLanes } from '$lib/timeline/lanes';

	let { shows }: { shows: WatchedShow[] } = $props();

	const width = 1200;
	const rowHeight = 32;
	const paddingTop = 50;

	const range = $derived(getTimelineRange(shows));
	const lanes = $derived(assignLanes(shows));

	const height = $derived(Math.max(lanes.length * rowHeight + paddingTop, 150));

	function getShowPosition(show: WatchedShow) {
		if (!range) {
			return {
				x: 0,
				width: 0
			};
		}

		const startX = dateToX(show.startDate, range.start, range.end, width);

		const endX = dateToX(show.endDate, range.start, range.end, width);

		return {
			x: startX,
			width: Math.max(endX - startX, 6)
		};
	}

	function formatYear(timestamp: number) {
		return new Date(timestamp).getUTCFullYear();
	}
</script>

{#if !range}
	<p>No timeline data available.</p>
{:else}
	<div class="overflow-x-auto">
		<svg {width} {height} viewBox={`0 0 ${width} ${height}`} class="block">
			<!-- Timeline axis -->
			<line x1="0" y1="30" x2={width} y2="30" stroke="currentColor" stroke-opacity="0.2" />

			<!-- Start year -->
			<text x="0" y="20" font-size="12" fill="currentColor">
				{formatYear(range.start)}
			</text>

			<!-- End year -->
			<text x={width - 35} y="20" font-size="12" fill="currentColor">
				{formatYear(range.end)}
			</text>

			<!-- Shows -->
			{#each lanes as lane, laneIndex (laneIndex)}
				{#each lane.shows as show (show.id)}
					{@const position = getShowPosition(show)}

					<g>
						<rect
							x={position.x}
							y={paddingTop + laneIndex * rowHeight}
							width={position.width}
							height="36"
							rx="8"
							class="fill-blue-500"
						/>

						<text
							x={position.x + 8}
							y={paddingTop + laneIndex * rowHeight + 23}
							font-size="13"
							fill="white"
						>
							{show.title}
						</text>
					</g>
				{/each}
			{/each}
		</svg>
	</div>
{/if}
