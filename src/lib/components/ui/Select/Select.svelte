<script lang="ts">
	import chevronDown from '@iconify/icons-heroicons/chevron-down';
	import Icon from '@iconify/svelte';
	import { createSelect, melt } from '@melt-ui/svelte';
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import { twJoin, twMerge } from 'tailwind-merge';

	// Define additional type
	type Option = {
		label: string;
		value: string;
		disable?: boolean;
	};

	// Define props
	export let options: Option[] = [];
	export let defaultOption: Option | undefined = undefined;

	// Create the select using the `createSelect` builder
	const {
		elements: { trigger, menu, option },
		states: { selectedLabel, open, selected },
		helpers: { isSelected }
	} = createSelect({
		forceVisible: true,
		positioning: {
			placement: 'bottom',
			fitViewport: true,
			sameWidth: true
		},
		defaultSelected: defaultOption
	});

	const dispatch = createEventDispatcher();

	const handleOptionClick = (item: Option) => {
		if (item === $selected) return;

		dispatch('change', item);
	};

	const baseStyles =
		'flex w-28 justify-between gap-0.5 rounded-md border border-amber-700 px-1.5 py-0.5 text-sm font-medium transition-colors hover:bg-amber-200';
</script>

<div class="flex flex-col gap-1">
	<button class={twMerge(baseStyles, $$props.class)} aria-label="Task Status" use:melt={$trigger}>
		<span>{$selectedLabel ? $selectedLabel : 'No option'}</span>
		<Icon
			class={twJoin('transition-transform', $open ? 'rotate-180' : 'rotate-0')}
			icon={chevronDown}
			width="20"
			height="20"
		/>
	</button>
	{#if $open}
		<div
			class="z-10 flex max-h-[300px] flex-col overflow-y-auto rounded-lg bg-amber-100 p-1 text-sm shadow focus:!ring-0"
			use:melt={$menu}
			transition:fade={{ duration: 150 }}
		>
			{#each options as item}
				<div
					class="relative flex cursor-pointer items-center gap-1 rounded-lg p-1 hover:bg-amber-100 focus:z-10 focus:text-amber-700 data-[highlighted]:bg-amber-200 data-[highlighted]:text-amber-900 data-[disabled]:opacity-50"
					use:melt={$option(item)}
					on:m-click={() => handleOptionClick(item)}
				>
					<div class="flex w-3 items-center justify-center">
						{#if $isSelected(item.value)}
							<div class="h-[4.75px] w-[4.75px] rounded-full bg-amber-800" />
						{/if}
					</div>
					{item.label}
				</div>
			{:else}
				<div
					class="relative flex cursor-default select-none items-center gap-1 rounded-lg p-1 hover:bg-amber-100 focus:z-10 focus:text-amber-700 data-[highlighted]:bg-amber-200 data-[highlighted]:text-amber-900 data-[disabled]:opacity-50"
				>
					No options
				</div>
			{/each}
		</div>
	{/if}
</div>
