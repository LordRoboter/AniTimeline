<script lang="ts">
	import type { WatchedShow } from '$lib/core/model/watched_show';

	let { shows }: { shows: WatchedShow[] } = $props();

	const tiers = [
		{ id: 'S', color: 'bg-red-300' },
		{ id: 'A', color: 'bg-orange-300' },
		{ id: 'B', color: 'bg-yellow-300' },
		{ id: 'C', color: 'bg-lime-300' },
		{ id: 'D', color: 'bg-green-300' }
	];

	type Placement = {
		tier: string;
		position: number;
	};

	let placements = $state<Record<number, Placement>>({});
	let draggedId = $state<number | null>(null);

	const imageShows = $derived(shows.filter((show) => show.coverImage?.medium));

	const unranked = $derived(imageShows.filter((show) => placements[show.id] === undefined));

	function getTierShows(tierId: string) {
		return imageShows
			.filter((show) => placements[show.id]?.tier === tierId)
			.sort((a, b) => placements[a.id].position - placements[b.id].position);
	}

	function startDrag(event: DragEvent, id: number) {
		draggedId = id;

		if (event.dataTransfer) {
			event.dataTransfer.setData('text/plain', String(id));
			event.dataTransfer.effectAllowed = 'move';
		}
	}

	function allowDrop(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
	}

	function getInsertIndex(event: DragEvent, tierId: string, current: WatchedShow[]) {
		const tierElement = (event.currentTarget as HTMLElement).closest(`[data-tier-id="${tierId}"]`);

		if (!tierElement) return current.length;

		const container = tierElement.querySelector('[data-tier-items]');
		if (!container) return current.length;

		const x = event.clientX;
		const y = event.clientY;

		for (let i = 0; i < current.length; i++) {
			const element = container.querySelector<HTMLElement>(`[data-show-id="${current[i].id}"]`);

			if (!element) continue;

			const rect = element.getBoundingClientRect();

			// For wrapped rows, also account for vertical position.
			if (y < rect.bottom && x < rect.left + rect.width / 2) {
				return i;
			}

			if (y < rect.bottom && x < rect.right) {
				return i + 1;
			}
		}

		return current.length;
	}

	function handleDrop(event: DragEvent, tierId: string | null, targetId?: number) {
		event.preventDefault();
		event.stopPropagation();

		const rawId =
			event.dataTransfer?.getData('text/plain') || (draggedId !== null ? String(draggedId) : '');

		if (!rawId) return;

		const id = Number(rawId);

		if (!imageShows.some((show) => show.id === id)) return;
		if (id === targetId) return;

		if (tierId === null) {
			const next = { ...placements };
			delete next[id];
			placements = next;
			dropTarget = null;
			draggedId = null;
			return;
		}

		const current = getTierShows(tierId).filter((show) => show.id !== id);

		const insertAt = getInsertIndex(event, tierId, current);

		current.splice(
			insertAt,
			0,
			imageShows.find((show) => show.id === id)!
		);

		const next = { ...placements };

		current.forEach((show, index) => {
			next[show.id] = { tier: tierId, position: index };
		});

		placements = next;
		dropTarget = null;
		draggedId = null;
	}

	function endDrag() {
		draggedId = null;
		dropTarget = null;
	}

	type DropTarget = {
		id: number;
		side: 'before' | 'after';
	};

	let dropTarget = $state<DropTarget | null>(null);

	function handleItemDragOver(event: DragEvent, targetId: number) {
		event.preventDefault();
		event.stopPropagation();

		if (draggedId === targetId) {
			dropTarget = null;
			return;
		}

		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const side = event.clientX < rect.left + rect.width / 2 ? 'before' : 'after';

		dropTarget = { id: targetId, side };

		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	}
</script>

<div class="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px] w-full">
	<!-- Tier list -->
	<div class="flex min-w-0 flex-col gap-2">
		{#each tiers as tier (tier.id)}
			<div
				data-tier-id={tier.id}
				role="region"
				aria-label={`${tier.id} tier drop zone`}
				class="grid min-h-28 grid-cols-[3.5rem_minmax(0,1fr)] overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 sm:grid-cols-[5rem_minmax(0,1fr)]"
				ondragover={allowDrop}
				ondrop={(event) => handleDrop(event, tier.id)}
			>
				<div
					class={`flex items-center justify-center text-2xl font-extrabold text-zinc-900 ${tier.color}`}
				>
					{tier.id}
				</div>

				<div
					data-tier-items
					class="flex min-h-28 min-w-0 flex-wrap content-start items-start gap-1.5 p-2"
				>
					{#each getTierShows(tier.id) as show (show.id)}
						<div
							class={`relative shrink-0 rounded-sm ${
								dropTarget?.id === show.id
									? dropTarget.side === 'before'
										? 'border-l-4 border-sky-400'
										: 'border-r-4 border-sky-400'
									: 'border-l-4 border-transparent'
							}`}
							data-show-id={show.id}
							ondragover={(event) => handleItemDragOver(event, show.id)}
						>
							<img
								class={`h-24 w-16 rounded-sm object-cover select-none transition-opacity sm:h-28 sm:w-20 ${
									draggedId === show.id ? 'opacity-40' : 'opacity-100'
								} cursor-grab active:cursor-grabbing`}
								src={show.coverImage!.medium!}
								alt={show.title}
								title={show.title}
								draggable="true"
								ondragstart={(event) => startDrag(event, show.id)}
								ondragend={endDrag}
							/>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>

	<!-- Sticky unranked sidebar -->
	<aside class="min-w-0 rounded-lg border border-zinc-700 bg-zinc-900 lg:sticky lg:top-4">
		<div class="flex items-center justify-between border-b border-zinc-700 px-3 py-3">
			<h2 class="font-semibold text-zinc-100">Unranked</h2>
			<span class="rounded-full bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
				{unranked.length}
			</span>
		</div>

		<div
			role="region"
			aria-label="Unranked shows drop zone"
			class="grid max-h-64 grid-cols-4 content-start gap-2 overflow-y-auto p-3 sm:grid-cols-5 lg:max-h-[calc(100vh-8rem)] lg:grid-cols-3"
			ondragover={allowDrop}
			ondrop={(event) => handleDrop(event, null)}
		>
			{#each unranked as show (show.id)}
				<img
					class="aspect-[5/7] w-full cursor-grab rounded-sm object-cover select-none hover:opacity-80 active:cursor-grabbing"
					src={show.coverImage!.medium!}
					alt={show.title}
					title={show.title}
					draggable="true"
					ondragstart={(event) => startDrag(event, show.id)}
					ondragend={endDrag}
				/>
			{/each}
		</div>

		{#if unranked.length === 0}
			<p class="p-4 text-center text-sm text-zinc-500">All shows ranked!</p>
		{/if}
	</aside>
</div>
