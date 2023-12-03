import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	summary: z.string().min(3),
	description: z.string().optional(),
	due_at: z.string().optional(),
});

export const load: PageServerLoad = async () => {
	// Server API:
	const form = await superValidate(schema);

	// Unless you throw, always return { form } in load and form actions.
	return { form };
};

// noinspection JSUnusedGlobalSymbols
export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } , params}) => {
		const session = await getSession();

		if (!session) {
			throw redirect(303, '/auth/login');
		}

		const form = await superValidate(request, schema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { error: taskError, status: taskStatus } = await supabase.from('task').insert({
			project_id: params.id,
			summary: form.data.summary,
			description: form.data.description,
			due_at: form.data.due_at
		});

		if (taskError) {
			return fail(taskStatus, { form });
		}

		return { form };
	}
};
