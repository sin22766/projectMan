import { json } from '@sveltejs/kit';
import { z } from 'zod';

import type { RequestHandler } from './$types';

const taskUpdateSchema = z.object({
	project_id: z.string().uuid(),
	id: z.number(),
	summary: z.string().min(5).optional(),
	description: z.string().optional(),
	due_at: z.string().datetime().optional(),
	status: z.enum(['todo', 'progress', 'done']).optional()
});

// noinspection JSUnusedGlobalSymbols
export const PUT: RequestHandler = async ({ request, locals: { getSession, supabase } }) => {
	const session = await getSession();

	if (!session) {
		json({ success: false, error: 'Unauthorized' }, { status: 401 });
	}

	const query = await request.json();

	const parseResult = taskUpdateSchema.safeParse(query);

	if (!parseResult.success) {
		return json({ success: false, error: parseResult.error.format() }, { status: 400 });
	}

	const { id, project_id, ...updateData } = parseResult.data;

	const { error: taskError, status: taskStatus } = await supabase
		.from('task')
		.update(updateData)
		.eq('id', id)
		.eq('project_id', project_id);

	if (taskError) {
		return json({ success: false, error: taskError.message }, { status: taskStatus });
	}

	return json({ success: true }, { status: 200 });
};
