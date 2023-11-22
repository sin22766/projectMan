<script lang="ts">
	import chevronDown from '@iconify/icons-heroicons/chevron-down';
	import Icon from '@iconify/svelte';
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import { writable } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import { twJoin } from 'tailwind-merge';

	export let label: string = "Dropdown";
	export let list: { title: string; value: string }[] = [];
	export let value: string | undefined;

	let valueStore = writable<string>();

	$: value = $valueStore;

	const {
		elements: { trigger, menu, arrow },
		builders: { createMenuRadioGroup },
		states: { open }
	} = createDropdownMenu({
		forceVisible: true,
		loop: true
	});

	const {
		elements: { radioGroup, radioItem },
		helpers: { isChecked }
	} = createMenuRadioGroup({
		defaultValue: 'By Name',
		value: valueStore
	});
</script>

<button
	type="button"
	use:melt={$trigger}
	class="flex items-center justify-center gap-2 rounded-md bg-amber-700 px-4 py-0.5 text-yellow-50"
>
	<span class="text-xl font-medium">{label}</span>
	<span class={twJoin('rotate-0 transition-transform', $open ? 'rotate-180' : '')}>
		<Icon icon={chevronDown} width="24" height="24" />
	</span>
</button>

{#if $open}
	<div class="menu" use:melt={$menu} transition:fly={{ duration: 150, y: -10 }}>
		<div use:melt={$radioGroup}>
			{#each list as listItem}
				<!--suppress JSCheckFunctionSignatures -->
				<div class="item" use:melt={$radioItem({ value: listItem.value })}>
					<div class="check">
						{#if $isChecked(listItem.value)}
							<div class="dot" />
						{/if}
					</div>
					{listItem.title}
				</div>
			{/each}
		</div>
		<div use:melt={$arrow} />
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
