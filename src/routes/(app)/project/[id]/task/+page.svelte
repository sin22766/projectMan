<script lang="ts">
	import chevronDown from '@iconify/icons-heroicons/chevron-down';
	import documentPlus from '@iconify/icons-heroicons/document-plus';
	import ellipsisHorizontal from '@iconify/icons-heroicons/ellipsis-horizontal';
	import Icon from '@iconify/svelte';
	import { writable } from 'svelte/store';

	import SortDropdown from '$lib/components/interacts/Dropdowns/SortDropdown.svelte';

	let sortBy = writable('name');

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
		/>
		<div class="flex gap-2">
			<SortDropdown valueStore={sortBy} />
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
		{#each data.tasks as task}
			<div class="flex min-h-[48px] justify-between px-2 py-1.5">
				<div class="flex items-center gap-2 text-xl">
					<span class="font-light text-yellow-500">#{task.id}</span>
					<span class="font-medium">{task.summary}</span>
				</div>
				<div class="flex items-center gap-2">
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
			<p>No project</p>
		{/each}
	</div>
</div>
