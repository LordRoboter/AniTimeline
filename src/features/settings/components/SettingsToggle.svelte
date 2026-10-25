<script lang="ts">
	let {
		label,
		description,
		checked,
		onChange
	}: {
		label: string;
		description?: string;
		checked: boolean;
		onChange: (checked: boolean) => void;
	} = $props();
</script>

<label class="flex cursor-pointer items-center justify-between gap-4 rounded-lg px-2 py-2.5">
	<div class="min-w-0">
		<p class="text-sm font-medium">
			{label}
		</p>

		{#if description}
			<p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
				{description}
			</p>
		{/if}
	</div>

	<input
		type="checkbox"
		class="peer sr-only"
		{checked}
		onchange={(event) => onChange(event.currentTarget.checked)}
	/>

	<span
		class="relative h-5 w-9 shrink-0 rounded-full bg-gray-200
		       transition-colors
		       after:absolute after:left-0.5 after:top-0.5
		       after:h-4 after:w-4 after:rounded-full
		       after:bg-white after:shadow-sm after:transition-transform
		       peer-checked:bg-gray-900
		       peer-checked:after:translate-x-4
		       dark:bg-gray-700 dark:peer-checked:bg-[rgb(var(--color-blue))]"
	></span>
</label>
