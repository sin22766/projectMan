import projects from '$lib/server/mockup';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ params }) => {
	const project = projects.find((i) => i.id === params.id);

	if (project == null) {
		throw Error('Project not found');
	}

	return project;
};
