<script lang="ts">
	import type { TimeAxis } from '../axis';
	import { timeToX } from '../timeline';

	let {
		axis,
		start,
		end,
		width,
		height,
		showNowMarker,
		showYearMarkers
	}: {
		axis: TimeAxis;
		start: number;
		end: number;
		width: number;
		height: number;
		showNowMarker: boolean;
		showYearMarkers: boolean;
	} = $props();

	const nowX = $derived(timeToX(axis.nowMarker.time, start, end, width));
</script>

<g class="time-axis">
	<line x1="0" y1="50" x2={width} y2="50" stroke="currentColor" stroke-opacity="0.2" />

	{#each axis.ticks as tick (tick.time)}
		{@const x = timeToX(tick.time, start, end, width)}

		<line x1={x} y1="50" x2={x} y2={height} stroke="currentColor" stroke-opacity="0.06" />

		<line x1={x} y1="50" x2={x} y2="46" stroke="currentColor" stroke-opacity="0.35" />

		<text {x} y="35" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.65">
			{tick.label}
		</text>
	{/each}

	{#if showYearMarkers}
		{#each axis.yearMarkers as marker, index (index)}
			{@const x = timeToX(marker.time, start, end, width)}

			<line
				x1={x}
				x2={x}
				y1="32"
				y2={height}
				stroke="currentColor"
				stroke-width="1"
				stroke-dasharray="2 4"
				class="text-gray-500"
				pointer-events="none"
			/>

			<text
				{x}
				y="22"
				text-anchor="middle"
				class="fill-gray-500 text-xs font-medium"
				pointer-events="none"
			>
				{marker.label}
			</text>
		{/each}
	{/if}

	{#if showNowMarker}
		<g class="now-marker" pointer-events="none">
			<line
				x1={nowX}
				x2={nowX}
				y1="24"
				y2={height}
				stroke="#ef4444"
				stroke-width="1.5"
				stroke-dasharray="3 3"
				stroke-opacity="0.85"
			/>

			<circle cx={nowX} cy="50" r="3" fill="#ef4444" />

			<text x={nowX} y="18" text-anchor="middle" font-size="11" font-weight="600" fill="#ef4444">
				Now
			</text>
		</g>
	{/if}
</g>
