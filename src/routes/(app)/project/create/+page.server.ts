import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	name: z.string().min(1).regex(/^[a-zA-Z0-9_-]+$/),
	description: z.string()
});

export const load: PageServerLoad = async () => {
	// Server API:
	const form = await superValidate(schema);

	// Unless you throw, always return { form } in load and form actions.
	return { form };
};

// noinspection JSUnusedGlobalSymbols
export const actions: Actions = {
	default: async ({ request, locals: {supabase, getSession} }) => {
		const session = await getSession();

		if (!session) {
			throw redirect(303, '/auth/login');
		}

		const form = await superValidate(request, schema);

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form });
		}

		const { error: projectError } = await supabase
			.from('project')
			.insert({ name: form.data.name, description: form.data.description, owner_id: session.user.id })

		if (projectError) {
			return fail(400, { form });
		}

		throw redirect(303, '/project');
	}
};
