<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { error } from '@sveltejs/kit';
	import { FilePlus } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import { superForm } from 'sveltekit-superforms/client';

	import { Dialog, Drawer } from '$lib/components/ui';
	import type { Enums } from '$lib/server/database/schema';

	import type { PageData } from './$types';

	import { invalidate } from '$app/navigation';

	export let data: PageData;

	type Task = (typeof data.tasks)[0];

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

	let taskNewOpen = writable(false);
	let taskEditOpen = writable(false);

	const {
		form: newTaskForm,
		enhance: newTaskEnhance,
		constraints: newTaskConstrains,
		errors: newTaskErrors
	} = superForm(data.newTaskForm, {
		onResult(event) {
			if (event.result.type === 'success') {
				$taskNewOpen = false;
			}
		}
	});

	const {
		form: editTaskForm,
		enhance: editTaskEnhance,
		constraints: editTaskConstrains,
		errors: editTaskErrors
	} = superForm(data.editTaskForm, {
		onResult(event) {
			if (event.result.type === 'success') {
				$taskEditOpen = false;
			}
		}
	});

	const taskEditHandler = (task: Task) => {
		$editTaskForm.summary = task.summary;
		$editTaskForm.description = task.description ?? '';
		$editTaskForm.due_at = task.due_at?.split('T')[0] ?? '';
		$editTaskForm.status = task.status ?? '';
		$taskEditOpen = true;
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
					on:click={() => taskEditHandler(task)}
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
	<Dialog class="h-fit" open={taskNewOpen}>
		<span class="text-xl font-bold">New</span>
		<FilePlus />
		<svelte:fragment slot="title">New Task</svelte:fragment>
		<svelte:fragment slot="description">Specify the task details</svelte:fragment>
		<form
			id="task"
			class="flex flex-col gap-2"
			action="/api/task?/newTask"
			method="post"
			slot="body"
			use:newTaskEnhance
		>
			<input type="hidden" name="project_id" value={data.project.id} />
			<label class="flex flex-col gap-1">
				<span class="font-medium">Task Summary*</span>
				<input
					class="h-8 rounded-md border border-amber-600 bg-amber-50 p-1 outline-amber-800"
					name="summary"
					type="text"
					bind:value={$newTaskForm.summary}
					{...$newTaskConstrains.summary}
				/>
				{#if $newTaskErrors.summary}
					<span class="text-sm text-red-500">{$newTaskErrors.summary}</span>
				{/if}
			</label>
			<label class="flex flex-col gap-1">
				<span class="font-medium">Description</span>
				<textarea
					class="rounded-md border border-amber-600 bg-amber-50 p-1 outline-amber-800"
					name="description"
					rows="4"
					bind:value={$newTaskForm.description}
					{...$newTaskConstrains.description}
				/>
				{#if $newTaskErrors.description}
					<span class="text-sm text-red-500">{$newTaskErrors.description}</span>
				{/if}
			</label>
			<label class="flex flex-col gap-1">
				<span class="font-medium">Due Date*</span>
				<input
					class="h-8 rounded-md border border-amber-600 bg-amber-50 p-1 outline-amber-800"
					name="due_at"
					type="date"
					bind:value={$newTaskForm.due_at}
					{...$newTaskConstrains.due_at}
				/>
				{#if $newTaskErrors.due_at}
					<span class="text-sm text-red-500">{$newTaskErrors.due_at}</span>
				{/if}
			</label>
		</form>
		<svelte:fragment slot="buttonGroup" let:close>
			<button
				use:melt={close}
				class="inline-flex h-8 items-center justify-center rounded-md
									bg-amber-300 px-4 font-medium leading-none text-yellow-800 hover:bg-amber-200"
			>
				Cancel
			</button>
			<button
				type="submit"
				form="task"
				class="inline-flex h-8 items-center justify-center rounded-md
									bg-amber-800 px-4 font-medium leading-none text-amber-50 hover:bg-amber-700"
			>
				Submit
			</button>
		</svelte:fragment>
	</Dialog>
</div>
<Drawer open={taskEditOpen} manualTrigger={true} disableTitle={true}>
	<div slot="body">
		<form
			id="taskEdit"
			class="flex flex-col gap-2"
			action="/api/task?/editTask"
			method="post"
			use:editTaskEnhance
		>
			<input type="hidden" name="project_id" value={data.project.id} />
			<label class="flex flex-col gap-1">
				<span class="font-medium">Task Summary*</span>
				<input
					class="h-8 rounded-md border border-amber-600 bg-amber-50 p-1 outline-amber-800"
					name="summary"
					type="text"
					bind:value={$editTaskForm.summary}
					{...$editTaskConstrains.summary}
				/>
				{#if $editTaskErrors.summary}
					<span class="text-sm text-red-500">{$editTaskErrors.summary}</span>
				{/if}
			</label>
			<label class="flex flex-col gap-1">
				<span class="font-medium">Description</span>
				<textarea
					class="rounded-md border border-amber-600 bg-amber-50 p-1 outline-amber-800"
					name="description"
					rows="4"
					bind:value={$editTaskForm.description}
					{...$editTaskConstrains.description}
				/>
				{#if $editTaskErrors.description}
					<span class="text-sm text-red-500">{$editTaskErrors.description}</span>
				{/if}
			</label>
			<label class="flex flex-col gap-1">
				<span class="font-medium">Due Date*</span>
				<input
					class="h-8 rounded-md border border-amber-600 bg-amber-50 p-1 outline-amber-800"
					name="due_at"
					type="date"
					bind:value={$editTaskForm.due_at}
					{...$editTaskConstrains.due_at}
				/>
				{#if $editTaskErrors.due_at}
					<span class="text-sm text-red-500">{$editTaskErrors.due_at}</span>
				{/if}
			</label>
		</form>
		<div class="mt-8 flex gap-2">
			<button
				class="inline-flex h-8 items-center justify-center rounded-md
									bg-amber-300 px-4 font-medium leading-none text-yellow-800 hover:bg-amber-200"
				on:click={() => ($taskEditOpen = false)}
			>
				Discard
			</button>
			<button
				type="submit"
				form="taskEdit"
				class="inline-flex h-8 items-center justify-center rounded-md
									bg-amber-800 px-4 font-medium leading-none text-amber-50 hover:bg-amber-700"
			>
				Save
			</button>
		</div>
	</div>
</Drawer>
