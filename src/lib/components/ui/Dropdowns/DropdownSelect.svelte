<script lang="ts">
	import chevronDown from '@iconify/icons-heroicons/chevron-down';
	import Icon from '@iconify/svelte';
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { twJoin, twMerge } from 'tailwind-merge';

	// Define additional type
	type Option = {
		label: string;
		value: string;
		disable?: boolean;
		href?: string;
	};

	// Define props
	export let options: Option[] = [];
	export let defaultOption: Option | undefined = undefined;
	export let isAnchor: boolean = false;

	const {
		elements: { trigger, menu },
		builders: { createMenuRadioGroup },
		states: { open }
	} = createDropdownMenu();

	const {
		elements: { radioGroup, radioItem },
		helpers: { isChecked },
		states: { value }
	} = createMenuRadioGroup({
		defaultValue: defaultOption?.value
	});

	const dispatch = createEventDispatcher();

	const handleOptionClick = (item: Option) => {
		if (item.value === $value) return;

		dispatch('change', item);
	};

	const baseStyles =
		'flex items-center justify-center gap-2 rounded-md bg-amber-700 px-4 py-0.5 text-amber-50';
</script>

<slot name="trigger" builder={trigger}>
	<button type="button" use:melt={$trigger} class={twMerge(baseStyles, $$props.class)}>
		<span class="text-xl font-medium">
			<slot>Dropdown</slot>
		</span>
		<span class={twJoin('transition-transform', $open ? 'rotate-180' : 'rotate-0')}>
			<Icon icon={chevronDown} width="24" height="24" />
		</span>
	</button>
</slot>

{#if $open}
	<div class="menu" use:melt={$menu} transition:fly={{ duration: 150, y: -10 }}>
		<div use:melt={$radioGroup}>
			{#each options as item}
				{#if isAnchor}
					<a
						href={item.href}
						class="item"
						use:melt={$radioItem(item)}
						on:m-click={() => handleOptionClick(item)}
					>
						<div class="check">
							{#if $isChecked(item.value)}
								<div class="dot" />
							{/if}
						</div>
						{item.label}
					</a>
				{:else}
					<div class="item" use:melt={$radioItem(item)} on:m-click={() => handleOptionClick(item)}>
						<div class="check">
							{#if $isChecked(item.value)}
								<div class="dot" />
							{/if}
						</div>
						{item.label}
					</div>
				{/if}
			{/each}
		</div>
	</div>
{/if}

<style lang="postcss">
	.menu {
		@apply z-10 flex max-h-[300px] flex-col shadow-md;
		@apply rounded-md bg-amber-100 p-1 shadow-neutral-900/30 lg:max-h-none;
		@apply ring-0 !important;
	}

	.item {
		@apply relative h-6 min-h-[32px] select-none rounded-sm pl-6 pr-2;
		@apply z-20 outline-none;
		@apply data-[highlighted]:bg-amber-200 data-[highlighted]:text-amber-800;
		@apply data-[disabled]:text-neutral-300;
		@apply flex items-center text-sm leading-none;
		@apply ring-0 !important;
	}

	.check {
		@apply absolute left-2 top-1/2;
		translate: 0 calc(-50% + 1px);
	}

	.dot {
		@apply h-[4.75px] w-[4.75px] rounded-full bg-amber-800;
	}

	.check {
		@apply absolute left-0 inline-flex w-6 items-center justify-center;
	}
</style>
