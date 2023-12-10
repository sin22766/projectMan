import { error, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/auth/login');
	}

	const {
		data: task,
		error: taskError,
		status: taskStatus
	} = await supabase.from('task').select('*, project(*)').not('project', 'is', null);

	if (taskError) {
		throw error(taskStatus, taskError.message);
	}

	console.log(task);

	return {
		tasks: task
	};
};