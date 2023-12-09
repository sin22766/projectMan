import { error, text } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ locals: { getSession } }) => {
	const session = await getSession();

	if (!session) {
		throw error(401, 'Unauthorized.');
	}

	return text('Hello');
};
