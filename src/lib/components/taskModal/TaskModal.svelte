<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import Button from './Button.svelte';
	import Tag from './Tag.svelte';
	import Dialog from './Dialog.svelte';
	import { page, updated } from '$app/stores';

	interface taskDataInterface {
		created_at: string;
		description: string;
		due_at: string;
		id: number;
		project_id: string;
		status: string;
		summary: string;
		updated_at: string;
	}

	let taskData: taskDataInterface = {
		created_at: '',
		description: '',
		due_at: '',
		id: -1,
		project_id: '',
		status: 'todo',
		summary: '',
		updated_at: ''
	};

	let detailsContainerColorClasses = '';
	let detailsContainerSizingClasses =
		'box-border border-2 border-dotted border-[#B45309] divide-y divide-[#B45309] my-2';
	let detailsContainerClasses = twMerge(
		detailsContainerColorClasses,
		detailsContainerSizingClasses
	);

	let dialog: Dialog;

	export function showModal(task: taskDataInterface) {
		dialog.showModal();
		taskData = task;
	}

	export function closeModal() {
		dialog.closeModal();
	}
	console.log(taskData.description);
</script>

<Dialog
	class="box-border w-[80%] max-w-3xl rounded-md bg-amber-100 p-5 text-amber-600"
	bind:this={dialog}
>
	<form class="flex flex-col" action="/task" method="post">
		<input hidden value={$page.url} name="comeFrom" />
		<input hidden value={taskData.id} name="taskID" />
		<input hidden value={taskData.project_id} name="projectID" />
		<input
			class="trasition bg-amber-100 py-2 text-2xl font-medium text-amber-600 duration-150 ease-out hover:bg-amber-200 hover:ease-in focus:border-0 focus:bg-amber-100 focus:outline-amber-700"
			bind:value={taskData.summary}
			name="summary"
			autocomplete="off"
		/>
		<Tag class="my-2">{taskData.status}</Tag>
		<div class="mt-2 font-medium">Description</div>
		<!-- svelte-ignore a11y-autofocus -->
		<textarea
			class="my-2 box-border h-[6em] w-full resize-none rounded-md border-[2px] border-[#B45309] bg-[#FFFBEB] p-2 text-[#B45309]"
			placeholder="Description"
			name="desc"
			autofocus
			autocomplete="off"
		>{taskData.description}</textarea>
		<div class={detailsContainerClasses}>
			<h2 class="border-b-1 border-[#B45309] p-2">Details</h2>
            <div class="flex flex-row justify-between">
                <ul class="flex flex-col p-2">
                    <li>
                        Create At: {new Date(taskData.created_at).toLocaleDateString('en-us', {year:"numeric", month:"short", day:"numeric", hour:"numeric", minute:"numeric"}) }
                    </li>
                    <li>
                        Update At: {new Date(taskData.updated_at).toLocaleDateString('en-us', {year:"numeric", month:"short", day:"numeric", hour:"numeric", minute:"numeric"}) }
                    </li>
                </ul>
                <div class="flex flex-col p-2">
                    <label>
                        Due at:
                        <input type="datetime-local" value={taskData.due_at ? taskData.due_at.slice(0, 16) : ""} name="dueDate" autocomplete="off" />
                    </label>
                </div>

            </div>
		</div>
		<div class="flex flex-wrap gap-2">
			<Button class="bg-yellow-300 text-yellow-800" type="button" on:click={dialog.closeModal}>
				Cancel
			</Button>
			<Button class="bg-yellow-700 text-yellow-50">Update</Button>
		</div>
	</form>
</Dialog>

