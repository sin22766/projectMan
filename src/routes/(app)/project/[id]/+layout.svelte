<script lang="ts">
	import { KanbanSquare, Table } from 'lucide-svelte';

	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
</script>

<div class="flex h-full w-full gap-2 px-2">
	<div class="flex h-full w-64 shrink-0 flex-col gap-2 p-2 font-medium text-amber-700">
		<h1 class="text-center text-xl font-semibold">{data.project.name}</h1>
		<hr class="border-amber-700" />
		<a
			href={`/project/${data.project.id}/task`}
			class="flex items-center gap-2 py-1 hover:bg-amber-200"
		>
			<Table class="h-6 w-6" />
			<span>Task</span>
		</a>
		<a
			href={`/project/${data.project.id}/board`}
			class="flex items-center gap-2 py-1 hover:bg-amber-200"
		>
			<KanbanSquare class="h-6 w-6" />
			<span>Board</span>
		</a>
	</div>
	<slot />
</div>
<dialog></dialog>
