import { error, redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw redirect(303, '/auth/login');
	}

	const {
		data: project,
		error: err,
		status
	} = await supabase
		.from('project_detail')
		.select('id, name, description, last_updated')
		.eq('owner_id', session.user.id)


	if (err) {
		throw error(status, err.message);
	}
	return {
		projects: project
	};
};
