<script lang="ts">
	import { createDialog, melt } from '@melt-ui/svelte';
	import { writable } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms/client';


	import { Drawer } from '$lib/components/ui';
	import type { Task } from '$lib/types';

	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';

	export let open = writable(false);
	export let formData: Parameters<typeof superForm>[0];
	export let projectId: string;

	export const taskEditHandler = (task: Task) => {
		$editTaskForm.project_id = projectId;
		$editTaskForm.id = task.id;
		$editTaskForm.summary = task.summary;
		$editTaskForm.description = task.description ?? '';
		$editTaskForm.due_at = task.due_at?.split('T')[0] ?? '';
		$editTaskForm.status = task.status ?? '';
		$open = true;
	};

	const {
		form: editTaskForm,
		enhance: editTaskEnhance,
		constraints: editTaskConstrains,
		errors: editTaskErrors
	} = superForm(formData, {
		async onResult(event) {
			if (event.result.type === 'success') {
				$open = false;
				await invalidate(`tasks:${projectId}`);
			}
		},
		taintedMessage: null
	});

	const {
		elements: { trigger, overlay, content, title, description, close, portalled },
		states: { open: openDialog }
	} = createDialog({ role: 'alertdialog', forceVisible: true });
</script>

<Drawer {open} manualTrigger={true} disableTitle={true}>
	<div slot="body">
		<form
			id="taskEdit"
			class="flex flex-col gap-2"
			action="/api/task?/editTask"
			method="post"
			use:editTaskEnhance
		>
			<!--suppress JSUnresolvedReference -->
			<input type="hidden" name="project_id" bind:value={$editTaskForm.project_id} />
			<input type="hidden" name="id" bind:value={$editTaskForm.id} />
			<label class="flex flex-col gap-1">
				<span class="font-medium">Task Summary*</span>
				<!--suppress JSUnresolvedReference -->
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
				<span class="font-medium">Status</span>
				<!--suppress JSUnresolvedReference -->
				<select
					class="rounded-md border border-amber-600 bg-amber-50 p-1 outline-amber-800"
					name="status"
					bind:value={$editTaskForm.status}
				>
					<option value="todo">To Do</option>
					<option value="progress">In Progress</option>
					<option value="done">Done</option>
				</select>
				{#if $editTaskErrors.status}
					<span class="text-sm text-red-500">{$editTaskErrors.status}</span>
				{/if}
			</label>
			<label class="flex flex-col gap-1">
				<span class="font-medium">Description</span>
				<!--suppress JSUnresolvedReference -->
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
				<!--suppress JSUnresolvedReference -->
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
		<div class="mt-8 flex justify-between gap-2">
			<button
				use:melt={$trigger}
				class="inline-flex h-8 items-center justify-center rounded-md
									bg-red-600 px-4 font-medium leading-none text-red-50 hover:bg-red-700"
			>
				Delete
			</button>
			<div>
				<button
					class="inline-flex h-8 items-center justify-center rounded-md
									bg-amber-300 px-4 font-medium leading-none text-yellow-800 hover:bg-amber-200"
					on:click={() => ($open = false)}
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
		<div class="" use:melt={$portalled}>
			{#if $openDialog}
				<div use:melt={$overlay} class="fixed inset-0 z-50 bg-black/50" />
				<div
					class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw]
            max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white
            p-6 shadow-lg"
					transition:fly={{
						duration: 150,
						y: 8
					}}
					use:melt={$content}
				>
					<h2 use:melt={$title} class="m-0 text-lg font-medium text-black">Are you sure?</h2>
					<p use:melt={$description} class="mb-5 mt-2 leading-normal text-zinc-600">
						Do you want to <span class="text-red-600">delete</span>
						this task?
					</p>

					<div class="mt-6 flex justify-end gap-4">
						<button
							use:melt={$close}
							class="inline-flex h-8 items-center justify-center rounded-[4px]
                    bg-zinc-100 px-4 font-medium leading-none text-zinc-600"
						>
							Cancel
						</button>
						<form
							id="taskDelete"
							class="flex flex-col gap-2"
							action="/api/task?/deleteTask"
							method="post"
							use:enhance={() => {
								return async ({ result }) => {
									if (result.type === 'success') {
										$openDialog = false;
										$open = false;
										await invalidate(`tasks:${projectId}`);
									}
								};
							}}
						>
							<input type="hidden" name="project_id" value={projectId} />
							<input type="hidden" name="id" bind:value={$editTaskForm.id} />
							<button
								class="inline-flex h-8 items-center justify-center rounded-[4px]
                    bg-red-100 px-4 font-medium leading-none text-red-900"
							>
								Continue
							</button>
						</form>
					</div>
				</div>
			{/if}
		</div>
	</div>
</Drawer>
