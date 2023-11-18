<script lang='ts'>
	import calendarIcon from '@iconify/icons-heroicons/calendar';
	import tableCells from '@iconify/icons-heroicons/table-cells';
	import viewColumns from '@iconify/icons-heroicons/view-columns';
	import Icon from '@iconify/svelte';

	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
</script>
<div class='w-full h-full flex px-2 gap-2'>
	<div class='h-full w-64 flex flex-col text-amber-700 p-2 gap-2 font-medium'>
		<h1 class='text-xl font-semibold text-center'>{data.name}</h1>
		<hr class='border-amber-700' />
		<a href={`/project/${data.id}/task`} class='py-1 flex items-center gap-2 hover:bg-yellow-200'>
			<Icon icon={tableCells} width='24px' height='24px' />
			<span>Task</span>
		</a>
		<a href={`/project/${data.id}/board`} class='py-1 flex items-center gap-2 hover:bg-yellow-200'>
			<Icon icon={viewColumns} width='24px' height='24px' />
			<span>Board</span>
		</a>
		<a href={`/project/${data.id}/timeline`} class='py-1 flex items-center gap-2 hover:bg-yellow-200'>
			<Icon icon={calendarIcon} width='24px' height='24px' />
			<span>Timeline</span>
		</a>
	</div>
	<slot />
</div>