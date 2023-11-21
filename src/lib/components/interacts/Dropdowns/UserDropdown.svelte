<script lang="ts">
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import { fly } from 'svelte/transition';

	const {
		elements: { trigger, menu, arrow, item },
		states: { open }
	} = createDropdownMenu({
		forceVisible: true,
		loop: true
	});

	const getFirstLetters = (str: string) => {
		return str
			.split(' ')
			.map((word) => word.charAt(0))
			.join('');
	};

	export let name: string;
</script>

<button
	type="button"
	use:melt={$trigger}
	class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 text-amber-50"
>
	{getFirstLetters(name)}
</button>

{#if $open}
	<div class="menu" use:melt={$menu} transition:fly={{ duration: 150, y: -10 }}>
		<a href="/user/task" class="item" use:melt={$item}>Your task</a>
		<form method="post" action="/auth/logout">
			<button type="submit" class="item w-full" use:melt={$item}>Log out</button>
		</form>
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
		@apply relative h-6 min-h-[32px] select-none rounded-sm px-5;
		@apply z-20 outline-none;
		@apply data-[highlighted]:bg-amber-200 data-[highlighted]:text-amber-800;
		@apply data-[disabled]:text-neutral-300;
		@apply flex items-center text-sm leading-none;
		@apply ring-0 !important;
	}
</style>
