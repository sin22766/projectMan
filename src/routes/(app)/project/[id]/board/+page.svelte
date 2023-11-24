<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import type { Enums } from '$lib/server/schema';

	export let data;

	let formEl: HTMLFormElement;

	const { form, enhance } = superForm(data.form);

	const task_status: { label: string; status: Enums<'task_status'> }[] = [
		{ label: 'To Do', status: 'todo' },
		{ label: 'In progress', status: 'progress' },
		{ label: 'Done', status: 'done' }
	];

	const handleDragStart = (e: DragEvent, id: number, status: Enums<'task_status'>) => {
		if (!e.dataTransfer) {
			return;
		}
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/plain', JSON.stringify({ id: id, status: status }));
	};

	const handleDragOver = (e: DragEvent) => {
		e.stopPropagation();
		e.preventDefault();
	};

	const handleDrop = async (e: DragEvent, targetStatus: Enums<'task_status'>) => {
		e.stopPropagation();
		e.preventDefault();

		const rawData = e.dataTransfer?.getData('text/plain');
		if (!rawData || !rawData.length) {
			return;
		}

		const task = JSON.parse(rawData) as { id: number; status: Enums<'task_status'> };

		if (task.status === targetStatus) {
			return;
		}

		$form.id = task.id;
		$form.status = targetStatus;
		setTimeout(() => formEl.requestSubmit(), 50);
	};
</script>

<svelte:head>
	<title>Board</title>
</svelte:head>

<div class="flex h-fit flex-col flex-wrap gap-8 p-8 lg:flex-row">
	{#each task_status as status}
		<div
			id={status.status}
			on:dragover={handleDragOver}
			on:drop={(event) => handleDrop(event, status.status)}
			class="flex min-w-[256px] flex-col gap-2.5 rounded-md bg-amber-100 p-2"
			role="group"
		>
			<div>
				<h2 class="py-1">{status.label}</h2>
				<hr class="border-amber-700" />
			</div>
			{#each data.tasks.filter((i) => i.status === status.status) as task}
				<div
					on:dragstart={(e) => handleDragStart(e, task.id, task.status)}
					role="button"
					tabindex="0"
					draggable="true"
					class="flex cursor-grab gap-2 rounded-md bg-amber-50 p-2 text-sm shadow"
				>
					<p class="text-amber-500">#{task.id}</p>
					<p>{task.summary}</p>
				</div>
			{:else}
				<div class="text-sm">No task</div>
			{/each}
		</div>
	{/each}
	<form bind:this={formEl} class="hidden" method="post" use:enhance>
		<input name="id" type="hidden" bind:value={$form.id} />
		<input name="status" type="hidden" bind:value={$form.status} />
	</form>
</div>
