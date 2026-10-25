<script lang="ts">
	import { Settings, X } from '@lucide/svelte';
	import SettingsToggle from '../../../settings/components/SettingsToggle.svelte';

	let {
		onSettingsClose,
		showNowMarker,
		showYearMarkers,
		onShowNowMarkerChange,
		onShowYearMarkersChange,
		onReset
	}: {
		onSettingsClose: () => void;
		showNowMarker: boolean;
		showYearMarkers: boolean;
		onShowNowMarkerChange: (value: boolean) => void;
		onShowYearMarkersChange: (value: boolean) => void;
		onReset: () => void;
	} = $props();
</script>

<div
	class="
		       w-80 overflow-hidden rounded-xl
		       border border-gray-200
		       bg-white/95 shadow-2xl backdrop-blur-xl
		       dark:border-gray-700
		       dark:bg-gray-900/95"
>
	<!-- Header -->
	<div
		class="flex items-center justify-between
			       border-b border-gray-100
			       px-4 py-3
			       dark:border-gray-800"
	>
		<div class="flex items-center gap-2.5">
			<div
				class="flex h-8 w-8 items-center justify-center
					       rounded-lg bg-gray-100
					       text-gray-600
					       dark:bg-gray-800 dark:text-gray-300"
			>
				<Settings size={16} />
			</div>

			<div>
				<h3 class="text-sm font-semibold">Timeline settings</h3>

				<p class="text-xs text-gray-500 dark:text-gray-400">Customize your view</p>
			</div>
		</div>

		<button
			type="button"
			class="rounded-md p-1.5 text-gray-400
				       hover:bg-gray-100 hover:text-gray-700
				       dark:hover:bg-gray-800 dark:hover:text-white"
			aria-label="Close settings"
			onclick={onSettingsClose}
		>
			<X size={16} />
		</button>
	</div>

	<!-- Settings -->
	<div class="space-y-4 p-3">
		<!--<div class="h-px bg-gray-100 dark:bg-gray-800"></div>-->

		<!-- Timeline -->
		<section>
			<h4
				class="px-2 pb-1 text-[11px]
					       font-semibold uppercase
					       tracking-wider text-gray-400"
			>
				Timeline
			</h4>

			<SettingsToggle
				label="Current time marker"
				description="Show the red Now indicator"
				checked={showNowMarker}
				onChange={onShowNowMarkerChange}
			/>

			<SettingsToggle
				label="Year markers"
				description="Highlight the beginning of each year"
				checked={showYearMarkers}
				onChange={onShowYearMarkersChange}
			/>
		</section>
	</div>

	<!-- Footer -->
	<div
		class="flex items-center justify-between
			       border-t border-gray-100
			       bg-gray-50/70 px-4 py-3
			       dark:border-gray-800
			       dark:bg-gray-800/30"
	>
		<span class="text-xs text-gray-500"> Changes apply instantly </span>

		<button
			type="button"
			class="text-xs font-medium
				       text-gray-600 hover:text-gray-900
				       dark:text-gray-400 dark:hover:text-white"
			onclick={onReset}
		>
			Reset
		</button>
	</div>
</div>
