import { fail, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();

		const name = form.get('name');
		const email = form.get('email');
		const password = form.get('password');

		const { error } = await locals.supabase.auth.signUp({
			email: email as string,
			password: password as string,
			options: {
				data: {
					name: name as string
				}
			}
		});

		if (error) {
			if (error.status) {
				return fail(error.status, {
					error: error.message
				});
			}
			return fail(500, {
				error: 'Server error. Please try again later.'
			});
		}
		throw redirect(303, '/project');
	}
};
