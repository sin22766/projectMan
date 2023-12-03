<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { error } from '@sveltejs/kit';
	import { FilePlus, MoreHorizontal } from 'lucide-svelte';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { writable } from 'svelte/store';
	import { superForm } from 'sveltekit-superforms/client';

	import { Dialog, DropdownSelect, Select } from '$lib/components/UI/index';
	import { getRelativeTimeString } from '$lib/utils/date';

	import type { PageData } from './$types';

	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';

	export let data: PageData;

	let taskDialogOpen = writable(false);
	let sortBy = $page.url.searchParams.get('sort') ?? 'id';
	let searchBy = $page.url.searchParams.get('search') ?? '';

	let sortOptions = [
		{ label: 'By Task ID', value: 'id' },
		{ label: 'By Summary', value: 'summary' },
		{ label: 'By Due Date', value: 'due_at' }
	];

	let statusOptions = [
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

	const { form, enhance, constraints, errors } = superForm(
		data.form,
		{
			onResult: (event) => {
				if (event.result.type === 'success') {
					$taskDialogOpen = false;
				}
			}
		}
	);
</script>

<svelte:head>
	<title>Task</title>
</svelte:head>

<div class="flex w-full flex-col gap-2 px-8 py-2 md:px-16 lg:px-24">
	<div class="flex flex-wrap gap-4 py-2">
		<input
			class="h-8 grow rounded-md border border-amber-600 bg-amber-100 p-1 placeholder-amber-600 outline-amber-800"
			name="search"
			type="text"
			required
			placeholder="Find a task..."
			autocomplete="off"
			bind:value={searchBy}
			on:change={searchHandler}
		/>
		<div class="flex gap-2">
			<DropdownSelect
				options={sortOptions}
				defaultOption={sortOptions.find((i) => i.value === sortBy)}
				on:change={changeSortHandler}
			>
				Sort
			</DropdownSelect>
		</div>
		<Dialog open={taskDialogOpen}>
			<span class="text-xl font-bold">New</span>
			<FilePlus />
			<svelte:fragment slot="title">New Task</svelte:fragment>
			<svelte:fragment slot="description">Specify the task details</svelte:fragment>
			<form id="task" class="flex flex-col gap-2" method="post" slot="body" use:enhance>
				<label class="flex flex-col gap-1">
					<span class="font-medium">Task Summary*</span>
					<input
						class="h-8 rounded-md border border-amber-600 bg-amber-50 p-1 outline-amber-800"
						name="summary"
						type="text"
						bind:value={$form.summary}
						{...$constraints.summary}
					/>
					{#if $errors.summary}
						<span class="text-sm text-red-500">{$errors.summary}</span>
					{/if}
				</label>
				<label class="flex flex-col gap-1">
					<span class="font-medium">Description</span>
					<textarea
						class="rounded-md border border-amber-600 bg-amber-50 p-1 outline-amber-800"
						name="description"
						rows="4"
						bind:value={$form.description}
						{...$constraints.description}
					/>
					{#if $errors.description}
						<span class="text-sm text-red-500">{$errors.description}</span>
					{/if}
				</label>
				<label class="flex flex-col gap-1">
					<span class="font-medium">Due Date*</span>
					<input
						class="h-8 rounded-md border border-amber-600 bg-amber-50 p-1 outline-amber-800"
						name="due_at"
						type="date"
						bind:value={$form.due_at}
						{...$constraints.due_at}
					/>
					{#if $errors.due_at}
						<span class="text-sm text-red-500">{$errors.due_at}</span>
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
	<div class="flex flex-col divide-y divide-amber-700 rounded-md border border-amber-700">
		{#each tasks as task (task.id)}
			<div
				animate:flip={{ delay: 250, duration: 250, easing: quintOut }}
				class="flex min-h-[48px] justify-between px-2 py-1.5"
			>
				<div class="flex items-center gap-2 text-xl">
					<span class="min-w-[36px] font-light text-amber-500">#{task.id}</span>
					<span class="font-medium">{task.summary}</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="text-sm font-light">
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
					<button
						class="flex h-9 w-9 items-center justify-center rounded-md bg-amber-200 font-medium"
					>
						<MoreHorizontal />
					</button>
				</div>
			</div>
		{:else}
			<div class="flex items-center h-12 px-2 py-1.5">
				<p>No task</p>
			</div>
		{/each}
	</div>
</div>
