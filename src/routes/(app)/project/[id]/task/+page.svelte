<script lang="ts">
	import chevronDown from '@iconify/icons-heroicons/chevron-down';
	import documentPlus from '@iconify/icons-heroicons/document-plus';
	import ellipsisHorizontal from '@iconify/icons-heroicons/ellipsis-horizontal';
	import Icon from '@iconify/svelte';
	import { writable } from 'svelte/store';

	import Dropdown from '$lib/components/Dropdowns/DropdownParams.svelte';
	import { getRelativeTimeString } from '$lib/utils/dateFormat';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	const sortBy = writable($page.url.searchParams.get('sort') ?? 'number');
	let searchBy = $page.url.searchParams.get('search') ?? '';

	let sortConditions = [
		{
			title: 'By Task Number',
			value: 'number'
		},
		{
			title: 'By Summary',
			value: 'summary'
		},
		{
			title: 'By Due Date',
			value: 'due_at'
		}
	];

	$: tasks = data.tasks
		.filter((item) => {
			return item.summary.toLowerCase().includes(searchBy.toLowerCase());
		})
		.sort((a, b) => {
			if ($sortBy === 'due_at') {
				const aTime = new Date(a.due_at ?? '');
				const bTime = new Date(b.due_at ?? '');
				return bTime.getTime() - aTime.getTime();
			} else if ($sortBy === 'number') {
				return a.id - b.id;
			}
			return a.summary.toLowerCase().localeCompare(b.summary.toLowerCase());
		});

	const handleSearch = async () => {
		const urlParams = $page.url.searchParams;
		if (searchBy.length) {
			urlParams.set('search', searchBy);
		} else {
			urlParams.delete('search');
		}
		await goto(`?${urlParams.toString()}`, { replaceState: true });
	};

	export let data;
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
			on:change={handleSearch}
		/>
		<div class="flex gap-2">
			<Dropdown list={sortConditions} valueStore={sortBy} params="sort" />
		</div>
		<button
			type="button"
			class="flex items-center justify-center gap-2 rounded-md bg-amber-300 px-4 py-0.5"
		>
			<span class="text-xl font-bold">New</span>
			<Icon icon={documentPlus} width="24" height="24" />
		</button>
	</div>
	<div class="flex flex-col divide-y divide-amber-700 rounded-md border border-amber-700">
		{#each tasks as task}
			<div class="flex min-h-[48px] justify-between px-2 py-1.5">
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
					<button
						class="flex gap-0.5 rounded-md border border-amber-700 px-1.5 py-0.5 text-sm font-medium"
					>
						Todo
						<Icon icon={chevronDown} width="20" height="20" />
					</button>
					<button
						class="flex h-9 w-9 items-center justify-center rounded-md bg-amber-200 font-medium"
					>
						<Icon icon={ellipsisHorizontal} width="24" height="24" />
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
