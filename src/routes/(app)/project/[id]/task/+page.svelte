<script lang='ts'>
	import { error } from '@sveltejs/kit';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { writable } from 'svelte/store';

	import { DialogNew, DrawerEdit } from '$lib/components/customs/Tasks';
	import { DropdownSelect, Select } from '$lib/components/ui';
	import { getRelativeTimeString } from '$lib/utils/date';

	import type { PageData } from './$types';

	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';

	export let data: PageData;

	let taskNewOpen = writable(false);
	let taskEditOpen = writable(false);
	let sortBy = $page.url.searchParams.get('sort') ?? 'id';
	let searchBy = $page.url.searchParams.get('search') ?? '';
	let drawerComponent: DrawerEdit;

	const sortOptions = [
		{ label: 'By Task ID', value: 'id' },
		{ label: 'By Summary', value: 'summary' },
		{ label: 'By Due Date', value: 'due_at' }
	];

	const statusOptions = [
		{ label: 'To Do', value: 'todo' },
		{ label: 'In Progress', value: 'progress' },
		{ label: 'Done', value: 'done' }
	];

	$: tasks = data.tasks
		.filter((item) => {
			return item.summary.toLowerCase().includes(searchBy.toLowerCase());
		})
		.sort((a, b) => {
			if (sortBy === 'due_at') {
				const aTime = new Date(a.due_at ?? 0);
				const bTime = new Date(b.due_at ?? 0);
				return bTime.getTime() - aTime.getTime();
			} else if (sortBy === 'id') {
				return a.id - b.id;
			}
			return a.summary.toLowerCase().localeCompare(b.summary.toLowerCase());
		});

	const searchHandler = async () => {
		const urlParams = $page.url.searchParams;
		if (searchBy.length) {
			urlParams.set('search', searchBy);
		} else {
			urlParams.delete('search');
		}
		await goto(`?${urlParams.toString()}`, { replaceState: true });
	};

	const changeSortHandler = async (event: CustomEvent) => {
		if (!event.detail.value) return;

		sortBy = event.detail.value;

		const urlParams = $page.url.searchParams;
		urlParams.set('sort', sortBy);
		await goto(`?${urlParams.toString()}`, { replaceState: true });
	};

	const changeStatusHandler = async (event: CustomEvent, project_id: string, id: number) => {
		if (!event.detail.value) return;

		const response = await fetch('/api/task', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				project_id: project_id,
				id: id,
				status: event.detail.value
			})
		});

		const data = await response.json();

		if (data.error) {
			alert(JSON.stringify(error));
		}

		await invalidate(`tasks:${project_id}`);
	};
</script>

<svelte:head>
	<title>Task</title>
</svelte:head>

<div class='flex w-full flex-col gap-2 px-8 py-2 md:px-16 lg:px-24'>
	<div class='flex flex-wrap gap-4 py-2'>
		<input
			class='h-8 grow rounded-md border border-amber-600 bg-amber-100 p-1 placeholder-amber-600 outline-amber-800'
			name='search'
			type='text'
			required
			placeholder='Find a task...'
			autocomplete='off'
			bind:value={searchBy}
			on:change={searchHandler}
		/>
		<div class='flex gap-2'>
			<DropdownSelect
				options={sortOptions}
				defaultOption={sortOptions.find((i) => i.value === sortBy)}
				on:change={changeSortHandler}
			>
				Sort
			</DropdownSelect>
		</div>
		<DialogNew open={taskNewOpen} formData={data.newTaskForm} projectId={data.project.id} />
	</div>
	<div class='flex flex-col divide-y divide-amber-700 rounded-md border border-amber-700'>
		{#each tasks as task (task.id)}
			<div
				animate:flip={{ delay: 250, duration: 250, easing: quintOut }}
				class='flex min-h-[48px] justify-between px-2 py-1.5'
			>
				<div class='flex items-center gap-2 text-xl'>
					<span class='min-w-[36px] font-light text-amber-500'>#{task.id}</span>
					<button type='button' on:click={() => drawerComponent.taskEditHandler(task)} class='font-medium'>
						{task.summary}
					</button>
				</div>
				<div class='flex items-center gap-2'>
					<span class='text-sm font-light'>
						{#if task.due_at}
							{getRelativeTimeString(new Date(task.due_at))}
						{:else}
							No due date
						{/if}
					</span>
					<Select
						options={statusOptions}
						defaultOption={statusOptions.find((i) => i.value === task.status)}
						on:change={(e) => changeStatusHandler(e, task.project_id, task.id)}
					/>
				</div>
			</div>
		{:else}
			<div class='flex items-center h-12 px-2 py-1.5'>
				<p>No task</p>
			</div>
		{/each}
	</div>
</div>
<DrawerEdit bind:this={drawerComponent} open={taskEditOpen} formData={data.editTaskForm} projectId={data.project.id} />
