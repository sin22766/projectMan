import { redirect } from '@sveltejs/kit';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	throw redirect(303, `${url.pathname}/task`);
};
