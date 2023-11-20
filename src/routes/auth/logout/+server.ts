import { error, redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals: { supabase } }) => {
	const { error: AuthError } = await supabase.auth.signOut();

	if (AuthError && AuthError.status) {
		throw error(AuthError.status, AuthError.message);
	} else if (AuthError) {
		throw error(500, 'Server error. Please try again later.');
	}

	throw redirect(302, '/');
};
