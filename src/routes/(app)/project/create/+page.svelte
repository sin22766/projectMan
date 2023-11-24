<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import type { PageData } from './$types';

	export let data: PageData;

	// Client API:
	const { form, enhance, constraints } = superForm(data.form);
</script>

<div class="flex flex-col gap-2 px-64 py-8">
	<h1 class="text-2xl font-bold">Create project</h1>
	<hr class="border-yellow-700" />
	<p class="text-sm">Required fields are marked with an asterisk (*).</p>
	<form class="flex flex-col gap-2" method="post" use:enhance>
		<label class="flex flex-col gap-1">
			<span class="font-bold">Project name*</span>
			<input
				class="h-8 rounded-md border border-amber-600 bg-amber-100 p-1 outline-amber-800"
				name="name"
				type="text"
				bind:value={$form.name}
				{...$constraints.name}
			/>
			<span class="text-sm">
				The project name can only contain the alphabets, digits, and <code>- _</code>
				symbols.
			</span>
		</label>
		<label class="flex flex-col gap-1">
			<span class="font-bold">Description</span>
			<input
				class="h-8 rounded-md border border-amber-600 bg-amber-100 p-1 outline-amber-800"
				name="description"
				type="text"
				bind:value={$form.description}
			/>
		</label>
		<div class="mt-4 flex justify-end gap-2">
			<a
				href="/project"
				class="flex h-8 items-center justify-center gap-2 rounded-md bg-amber-200 px-4 py-0.5"
			>
				<span class="font-semibold">Cancel</span>
			</a>
			<button
				type="submit"
				class="flex h-8 items-center justify-center gap-2 rounded-md bg-amber-700 px-4 py-0.5"
			>
				<span class="font-semibold text-amber-50">Create Project</span>
			</button>
		</div>
	</form>
</div>
