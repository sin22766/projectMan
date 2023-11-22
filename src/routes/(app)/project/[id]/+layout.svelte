<script lang="ts">
	import calendarIcon from '@iconify/icons-heroicons/calendar';
	import tableCells from '@iconify/icons-heroicons/table-cells';
	import viewColumns from '@iconify/icons-heroicons/view-columns';
	import Icon from '@iconify/svelte';

	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
</script>

<div class="flex h-full w-full gap-2 px-2">
	<div class="flex shrink-0 h-full w-64 flex-col gap-2 p-2 font-medium text-amber-700">
		<h1 class="text-center text-xl font-semibold">{data.project.name}</h1>
		<hr class="border-amber-700" />
		<a
			href={`/project/${data.project.id}/task`}
			class="flex items-center gap-2 py-1 hover:bg-yellow-200"
		>
			<Icon icon={tableCells} width="24px" height="24px" />
			<span>Task</span>
		</a>
		<a
			href={`/project/${data.project.id}/board`}
			class="flex items-center gap-2 py-1 hover:bg-yellow-200"
		>
			<Icon icon={viewColumns} width="24px" height="24px" />
			<span>Board</span>
		</a>
		<a
			href={`/project/${data.project.id}/timeline`}
			class="flex items-center gap-2 py-1 hover:bg-yellow-200"
		>
			<Icon icon={calendarIcon} width="24px" height="24px" />
			<span>Timeline</span>
		</a>
	</div>
	<slot />
</div>
