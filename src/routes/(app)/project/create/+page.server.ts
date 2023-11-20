import { redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async () => {
		throw redirect(303, '/project');
	}
};
