<script lang="ts">
	import chevronDown from '@iconify/icons-heroicons/chevron-down';
	import Icon from '@iconify/svelte';
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import { fly } from 'svelte/transition';
	import { twJoin, twMerge } from 'tailwind-merge';

	// Define additional type
	type Option = {
		label: string;
		href: string;
	};

	// Define props
	export let options: Option[] = [];

	const {
		elements: { trigger, menu, item, arrow },
		states: { open }
	} = createDropdownMenu({ forceVisible: true });

	const baseStyles =
		'flex items-center justify-center gap-2 rounded-md bg-amber-700 px-4 py-0.5 text-amber-50';

	const itemStyles =
		'relative h-6 min-h-[32px] select-none rounded-sm px-5 z-20 outline-none data-[highlighted]:bg-amber-200 data-[highlighted]:text-amber-800 data-[disabled]:text-neutral-300 flex items-center text-sm leading-none ring-0';
</script>

<slot name="trigger" trigger={$trigger}>
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
		<slot name="items" item={$item} {itemStyles}>
			{#each options as link}
				<a href={link.href} class={itemStyles} use:melt={$item}>
					{link.label}
				</a>
			{/each}
		</slot>
		<div use:melt={$arrow} />
	</div>
{/if}

<style lang="postcss">
	.menu {
		@apply z-10 flex max-h-[300px] flex-col shadow-md;
		@apply rounded-md bg-amber-100 p-1 shadow-neutral-900/30 lg:max-h-none;
		@apply ring-0 !important;
	}
</style>
