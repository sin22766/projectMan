<script lang="ts">
	import { error } from '@sveltejs/kit';
	import { writable } from 'svelte/store';

	import { DialogNew, DrawerEdit } from '$lib/components/customs/Tasks';
	import type { Enums } from '$lib/server/database/schema';

	import type { PageData } from './$types';

	import { invalidate } from '$app/navigation';

	export let data: PageData;

	type Task = (typeof data.tasks)[0];

	let taskNewOpen = writable(false);
	let taskEditOpen = writable(false);
	let drawerComponent: DrawerEdit;

	const task_status: { label: string; status: Enums<'task_status'> }[] = [
		{ label: 'To Do', status: 'todo' },
		{ label: 'In progress', status: 'progress' },
		{ label: 'Done', status: 'done' }
	];

	const dragStartHandler = (e: DragEvent, task: Task) => {
		if (!e.dataTransfer) {
			return;
		}
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/plain', JSON.stringify(task));
	};

	const dragOverHandler = (e: DragEvent) => {
		e.stopPropagation();
		e.preventDefault();
	};

	const dropHandler = async (e: DragEvent, targetStatus: Enums<'task_status'>) => {
		e.stopPropagation();
		e.preventDefault();

		const rawData = e.dataTransfer?.getData('text/plain');
		if (!rawData || !rawData.length) {
			return;
		}

		const task = JSON.parse(rawData) satisfies Task as Task;

		if (task.status === targetStatus) {
			return;
		}

		const response = await fetch('/api/task', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				project_id: task.project_id,
				id: task.id,
				status: targetStatus
			})
		});

		const data = await response.json();

		if (data.error) {
			alert(JSON.stringify(error));
		}

		await invalidate(`tasks:${task.project_id}`);
	};
</script>

<svelte:head>
	<title>Board</title>
</svelte:head>

<div class="flex h-fit flex-col flex-wrap gap-8 px-8 py-2 md:px-16 lg:flex-row lg:px-24">
	{#each task_status as status}
		<div
			id={status.status}
			on:dragover={dragOverHandler}
			on:drop={(event) => dropHandler(event, status.status)}
			class="flex min-w-[256px] flex-col gap-2.5 rounded-md bg-amber-100 p-2"
			role="group"
		>
			<div>
				<h2 class="py-1">{status.label}</h2>
				<hr class="border-amber-700" />
			</div>
			{#each data.tasks.filter((i) => i.status === status.status) as task}
				<button
					on:dragstart={(e) => dragStartHandler(e, task)}
					on:click={() => drawerComponent.taskEditHandler(task)}
					type="button"
					tabindex="0"
					draggable="true"
					class="flex cursor-grab gap-2 rounded-md bg-amber-50 p-2 text-sm shadow"
				>
					<span class="text-amber-500">#{task.id}</span>
					<span>{task.summary}</span>
				</button>
			{:else}
				<div class="text-sm">No task</div>
			{/each}
		</div>
	{/each}
	<DialogNew open={taskNewOpen} formData={data.newTaskForm} projectId={data.project.id} />
</div>
<DrawerEdit
	bind:this={drawerComponent}
	open={taskEditOpen}
	formData={data.editTaskForm}
	projectId={data.project.id}
/>
