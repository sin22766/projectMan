<script lang='ts'>
	import { melt } from '@melt-ui/svelte';
	import { FilePlus } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import { superForm } from 'sveltekit-superforms/client';

	import { Dialog } from '$lib/components/ui';

	export let open = writable(false);
	export let formData: Parameters<typeof superForm>[0];
	export let projectId: string;

	const {
		form: newTaskForm,
		enhance: newTaskEnhance,
		constraints: newTaskConstrains,
		errors: newTaskErrors
	} = superForm(formData, {
		onResult(event) {
			if (event.result.type === 'success') {
				$open = false;
			}
		},
		taintedMessage: null
	});
</script>

<Dialog open={open}>
	<span class='text-xl font-bold'>New</span>
	<FilePlus />
	<svelte:fragment slot='title'>New Task</svelte:fragment>
	<svelte:fragment slot='description'>Specify the task details</svelte:fragment>
	<form
		id='task'
		class='flex flex-col gap-2'
		action='/api/task?/newTask'
		method='post'
		slot='body'
		use:newTaskEnhance
	>
		<input type='hidden' name='project_id' value={projectId} />
		<label class='flex flex-col gap-1'>
			<span class='font-medium'>Task Summary*</span>
			<!--suppress JSUnresolvedReference -->
			<input
				class='h-8 rounded-md border border-amber-600 bg-amber-50 p-1 outline-amber-800'
				name='summary'
				type='text'
				bind:value={$newTaskForm.summary}
				{...$newTaskConstrains.summary}
			/>
			{#if $newTaskErrors.summary}
				<span class='text-sm text-red-500'>{$newTaskErrors.summary}</span>
			{/if}
		</label>
		<label class='flex flex-col gap-1'>
			<span class='font-medium'>Description</span>
			<!--suppress JSUnresolvedReference -->
			<textarea
				class='rounded-md border border-amber-600 bg-amber-50 p-1 outline-amber-800'
				name='description'
				rows='4'
				bind:value={$newTaskForm.description}
				{...$newTaskConstrains.description}
			/>
			{#if $newTaskErrors.description}
				<span class='text-sm text-red-500'>{$newTaskErrors.description}</span>
			{/if}
		</label>
		<label class='flex flex-col gap-1'>
			<span class='font-medium'>Due Date*</span>
			<!--suppress JSUnresolvedReference -->
			<input
				class='h-8 rounded-md border border-amber-600 bg-amber-50 p-1 outline-amber-800'
				name='due_at'
				type='date'
				bind:value={$newTaskForm.due_at}
				{...$newTaskConstrains.due_at}
			/>
			{#if $newTaskErrors.due_at}
				<span class='text-sm text-red-500'>{$newTaskErrors.due_at}</span>
			{/if}
		</label>
	</form>
	<svelte:fragment slot='buttonGroup' let:close>
		<button
			use:melt={close}
			class='inline-flex h-8 items-center justify-center rounded-md
									bg-amber-300 px-4 font-medium leading-none text-yellow-800 hover:bg-amber-200'
		>
			Cancel
		</button>
		<button
			type='submit'
			form='task'
			class='inline-flex h-8 items-center justify-center rounded-md
									bg-amber-800 px-4 font-medium leading-none text-amber-50 hover:bg-amber-700'
		>
			Submit
		</button>
	</svelte:fragment>
</Dialog>