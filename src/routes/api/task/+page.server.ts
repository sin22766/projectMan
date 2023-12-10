import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

import { taskEditSchema, taskNewSchema } from '$lib/server/form/schema';

import type { Actions } from './$types';

// noinspection JSUnusedGlobalSymbols
export const actions: Actions = {
	newTask: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session) {
			throw redirect(303, '/auth/login');
		}

		const form = await superValidate(request, taskNewSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { error: taskError, status: taskStatus } = await supabase.from('task').insert({
			project_id: form.data.project_id,
			summary: form.data.summary,
			description: form.data.description,
			due_at: form.data.due_at
		});

		if (taskError) {
			return fail(taskStatus, { form });
		}

		return { form };
	},
	editTask: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session) {
			throw redirect(303, '/auth/login');
		}

		const form = await superValidate(request, taskEditSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { error: taskError, status: taskStatus } = await supabase
			.from('task')
			.update({
				summary: form.data.summary,
				description: form.data.description,
				status: form.data.status,
				due_at: form.data.due_at
			})
			.eq('id', form.data.id)
			.eq('project_id', form.data.project_id);

		if (taskError) {
			return fail(taskStatus, { form });
		}

		return { form };
	},
	deleteTask: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session) {
			throw redirect(303, '/auth/login');
		}

		const form = await request.formData();
		const project_id = form.get('project_id') as string satisfies string;
		const id = form.get('id') as string satisfies string;

		const { error, status } = await supabase
			.from('task')
			.delete()
			.eq('id', id)
			.eq('project_id', project_id);

		if (error) {
			return fail(status, { error: error });
		}

		return { error: null };
	}
};
