<script lang='ts'>
	import Logo from '$lib/components/icons/Logo.svelte';

	import { page } from '$app/stores';

	const pathList = [
		{
			label: 'Project',
			path: '/project'
		},
		{
			label: 'Your Task',
			path: '/user/task'
		}
	];

	const user: undefined | string = undefined;
</script>


<div class='flex flex-col w-screen h-screen'>
	<div class='flex px-4 py-2 justify-between font-light text-xl'>
		<div class='w-full flex items-center'>
			<a href='/'>
				<Logo />
			</a>
		</div>
		{#if user}
			<div class='w-full flex justify-center gap-9'>
				{#each pathList as path}
					<a href={path.path} class={$page.url.pathname.startsWith(path.path) ? 'font-medium': ''}>{path.label}</a>
				{/each}
			</div>
		{/if}
		<div class='w-full flex justify-end gap-2'>
			{#if user}
				<div class='h-10 w-10 rounded-full bg-amber-600 flex justify-center items-center text-amber-50'>
					PC
				</div>
			{:else}
				<a href='/user/login' class='text-xl font-bold'>Login</a>
				<a href='/user/register' class='text-xl font-bold text-amber-50 bg-amber-600 rounded-md px-4 py-0.5'>Get Start
					!</a>
			{/if}
		</div>
	</div>
	<slot />
</div>