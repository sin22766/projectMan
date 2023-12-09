import { superValidate } from 'sveltekit-superforms/server';

import { taskEditSchema, taskNewSchema } from '$lib/server/form/schema';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const newTaskForm = await superValidate(taskNewSchema);
	const editTaskForm = await superValidate(taskEditSchema);

	return { newTaskForm, editTaskForm };
};
