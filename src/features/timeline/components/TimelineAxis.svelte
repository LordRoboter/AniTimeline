<script lang="ts">
	import type { TimeAxis } from '../axis';
	import { timeToX } from '../timeline';

	let {
		axis,
		start,
		end,
		width,
		height
	}: {
		axis: TimeAxis;
		start: number;
		end: number;
		width: number;
		height: number;
	} = $props();
</script>

<g class="time-axis">
	<line x1="0" y1="40" x2={width} y2="40" stroke="currentColor" stroke-opacity="0.2" />

	{#each axis.ticks as tick (tick.time)}
		{@const x = timeToX(tick.time, start, end, width)}

		<line x1={x} y1="40" x2={x} y2={height} stroke="currentColor" stroke-opacity="0.06" />

		<line x1={x} y1="40" x2={x} y2="46" stroke="currentColor" stroke-opacity="0.35" />

		<text {x} y="25" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.65">
			{tick.label}
		</text>
	{/each}

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
			class="text-gray-400"
			pointer-events="none"
		/>

		<text
			{x}
			y="18"
			text-anchor="middle"
			class="fill-gray-500 text-xs font-medium"
			pointer-events="none"
		>
			{marker.label}
		</text>
	{/each}
</g>
