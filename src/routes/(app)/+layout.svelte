<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { twJoin } from 'tailwind-merge';

	import { Dropdown, Logo } from '$lib/components/ui';

	export let data;

	import { page } from '$app/stores';

	const pathList = [
		{
			label: 'Projects',
			path: '/project'
		},
		{
			label: 'Your Task',
			path: '/user/task'
		}
	];

	const getFirstLetters = (str: string) => {
		return str
			.split(' ')
			.map((word) => word.charAt(0))
			.join('');
	};
</script>

<div
	class="sticky top-0 flex items-center justify-between bg-amber-50/80 px-4 py-2 text-xl font-light backdrop-blur-lg"
>
	<div class="flex w-full items-center">
		<a href="/">
			<Logo />
		</a>
	</div>
	{#if data.session}
		<div class="hidden w-full justify-center gap-9 sm:flex">
			{#each pathList as path}
				<a href={path.path} class={$page.url.pathname.startsWith(path.path) ? 'font-medium' : ''}>
					{path.label}
				</a>
			{/each}
		</div>
	{/if}
	<div class="flex w-full justify-end gap-2">
		{#if data.session}
			<Dropdown>
				<svelte:fragment slot="trigger" let:trigger>
					<button
						type="button"
						use:melt={trigger}
						class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-600 text-amber-50"
					>
						{getFirstLetters(data.session.user.user_metadata.name)}
					</button>
				</svelte:fragment>
				<svelte:fragment slot="items" let:item let:itemStyles>
					<a href="/user/task" class={itemStyles} use:melt={item}>Your task</a>
					<form method="post" action="/auth/logout">
						<button type="submit" class={twJoin(itemStyles, 'w-full')} use:melt={item}>
							Log out
						</button>
					</form>
				</svelte:fragment>
			</Dropdown>
		{:else}
			<a href="/auth/login" class="text-xl font-bold">Login</a>
			<a
				href="/auth/register"
				class="rounded-md bg-amber-600 px-4 py-0.5 text-xl font-bold text-amber-50"
			>
				Get Start !
			</a>
		{/if}
	</div>
</div>
<slot />
