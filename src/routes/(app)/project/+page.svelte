<script lang="ts">
	import documentPlus from '@iconify/icons-heroicons/document-plus';
	import Icon from '@iconify/svelte';

	import { DropdownSelect } from '$lib/components/UI';
	import { getRelativeTimeString } from '$lib/utils/date';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export let data;

	let sortBy = $page.url.searchParams.get('sort') ?? 'name';
	let searchBy = $page.url.searchParams.get('search') ?? '';

	let sortOptions = [
		{
			label: 'By Name',
			value: 'name'
		},
		{
			label: 'By Last Updated',
			value: 'last_updated'
		}
	];

	$: projects = data.projects
		.filter((item) => {
			return item.name.toLowerCase().includes(searchBy.toLowerCase());
		})
		.sort((a, b) => {
			if (sortBy === 'last_updated') {
				const aTime = new Date(a.last_updated ?? '');
				const bTime = new Date(b.last_updated ?? '');
				return bTime.getTime() - aTime.getTime();
			}
			return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
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

	const changeSortHandler = async (event: CustomEvent) => {
		if (!event.detail.value) return;

		sortBy = event.detail.value;

		const urlParams = $page.url.searchParams;
		urlParams.set('sort', sortBy);
		await goto(`?${urlParams.toString()}`, { replaceState: true });
	};
</script>

<svelte:head>
	<title>Project</title>
</svelte:head>

<div class="flex flex-col gap-2 px-8 py-8 md:px-16 lg:px-64">
	<h1 class="text-2xl font-bold">Your Project</h1>
	<div class="flex flex-wrap gap-4 py-2">
		<input
			class="h-8 grow rounded-md border border-amber-600 bg-amber-100 p-1 placeholder-amber-600 outline-amber-800"
			name="search"
			type="text"
			required
			placeholder="Find a project..."
			autocomplete="off"
			bind:value={searchBy}
			on:change={handleSearch}
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
		<a
			href="/project/create"
			class="flex items-center justify-center gap-2 rounded-md bg-amber-300 px-4 py-0.5"
		>
			<span class="text-xl font-bold">New</span>
			<Icon icon={documentPlus} width="24" height="24" />
		</a>
	</div>
	<div class="flex flex-col divide-y divide-amber-700 border-y border-amber-700">
		{#each projects as project}
			<div class="flex justify-between">
				<div class="flex flex-col gap-2 py-2">
					<a class="text-xl font-semibold" href={`/project/${project.id}`}>{project.name}</a>
					<p>{project.description ?? 'No description'}</p>
					<p class="text-sm font-light">
						{#if project.last_updated}
							{getRelativeTimeString(new Date(project.last_updated))}
						{:else}
							No activity yet
						{/if}
					</p>
				</div>
			</div>
		{:else}
			<p>No project</p>
		{/each}
	</div>
</div>
