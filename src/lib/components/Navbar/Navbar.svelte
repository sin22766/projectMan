<script lang='ts'>
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
</script>

<div class='flex px-4 py-2 justify-between font-light text-xl text-yellow-700'>
	<div class='w-full flex'>
		<a href='/'>NimbleSquad</a>
	</div>
	<div class='w-full flex justify-center gap-9'>
		{#each pathList as path}
			<a href={path.path} class={$page.url.pathname.startsWith(path.path) ? 'font-medium': ''}>{path.label}</a>
		{/each}
	</div>
	<div class='w-full flex justify-end'>
		<div class='h-10 w-10 rounded-full bg-yellow-700 flex justify-center items-center text-yellow-50'>
			PC
		</div>
	</div>
</div>