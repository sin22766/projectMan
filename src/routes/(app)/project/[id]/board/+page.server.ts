import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import type { Actions } from './$types';

const schema = z.object({
	id: z.number(),
	status: z.enum(['todo', 'progress', 'done'])
});

export const load = async () => {
	const form = await superValidate(schema);
	return { form };
};

// noinspection JSUnusedGlobalSymbols
export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession }, params }) => {
		const session = await getSession();

		if (!session) {
			throw redirect(303, '/auth/login');
		}

		const form = await superValidate(request, schema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { error: taskError, status: taskStatus } = await supabase
			.from('task')
			.update({ status: form.data.status })
			.eq('id', form.data.id)
			.eq('project_id', params.id);

		if (taskError) {
			return fail(taskStatus, { error: taskError.message });
		}

		return { form };
	}
};
