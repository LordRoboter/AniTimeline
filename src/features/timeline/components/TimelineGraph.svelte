<script lang="ts">
	import { formatDate } from '../timeline';
	import { StatusType, type WatchedShow } from '../type';

	let {
		show,
		x,
		y,
		width,
		barHeight,
		onSelect,
		selected
	}: {
		show: WatchedShow;
		x: number;
		y: number;
		width: number;
		barHeight: number;
		onSelect: () => void;
		selected: boolean;
	} = $props();

	const horizontalPadding = 12;

	const statusColors: Record<StatusType, string> = {
		[StatusType.CURRENT]: 'fill-green-500 group-hover:fill-green-600',
		[StatusType.PLANNING]: 'fill-yellow-500 group-hover:fill-yellow-600',
		[StatusType.COMPLETED]: 'fill-blue-500 group-hover:fill-blue-600',
		[StatusType.DROPPED]: 'fill-red-500 group-hover:fill-red-600',
		[StatusType.PAUSED]: 'fill-gray-500 group-hover:fill-gray-600',
		[StatusType.REPEATING]: 'fill-purple-500 group-hover:fill-purple-600'
	};

	const color =
		show.status !== null ? statusColors[show.status] : 'fill-gray-300 group-hover:fill-gray-400';

	const showTitle = $derived(width > 4.5 * show.title.length + horizontalPadding * 2);
	let hovered = $state(false);

	const tooltipPadding = 12;
	const tooltipMinWidth = 140;

	const startDate = $derived(formatDate(show.startDate));
	const endDate = $derived(formatDate(show.endDate));

	const tooltipWidth = $derived(
		Math.max(tooltipMinWidth, show.title.length * 5.88, `${startDate} → ${endDate}`.length * 4.5) +
			tooltipPadding * 2
	);
</script>

<g
	role="button"
	tabindex="0"
	class="group cursor-pointer outline-none"
	onmouseenter={() => (hovered = true)}
	onmouseleave={() => (hovered = false)}
	onclick={onSelect}
	onkeydown={(event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			onSelect();
		}
	}}
>
	{#if selected}
		<!-- Selection ring -->
		<rect
			x={x - 3}
			y={y - 3}
			width={width + 6}
			height={barHeight + 6}
			rx="11"
			fill="none"
			stroke="white"
			stroke-width="2"
			class="pointer-events-none"
		/>

		<!-- Dark outer ring -->
		<rect
			x={x - 4}
			y={y - 4}
			width={width + 8}
			height={barHeight + 8}
			rx="12"
			fill="none"
			stroke="black"
			stroke-width="1"
			opacity="0.5"
			class="pointer-events-none"
		/>
	{/if}

	<rect
		{x}
		{y}
		{width}
		height={barHeight}
		rx="8"
		class={`transition-colors ${color}`}
		class:brightness-125={selected}
	/>

	{#if showTitle}
		<text
			x={x + horizontalPadding}
			y={y + barHeight / 2 + 4}
			font-size="10"
			fill="white"
			class="pointer-events-none"
		>
			{show.title}
		</text>
	{/if}
</g>

{#if hovered}
	<g class="pointer-events-none">
		<rect {x} y={y - 70} width={tooltipWidth} height={60} rx="8" class="fill-gray-900 opacity-95" />

		<text x={x + 12} y={y - 47} fill="white" font-size="12" font-weight="600">
			{show.title}
		</text>

		<text x={x + 12} y={y - 27} fill="#d1d5db" font-size="10">
			{formatDate(show.startDate)} → {formatDate(show.endDate)}
		</text>
	</g>
{/if}
