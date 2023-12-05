import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals: { supabase }, request, url }) => {
	const data = await request.formData();
	let summary = data.get('summary');
	let desc = data.get('desc');
	let task_id = data.get('taskID');
	let project_id = data.get('projectID');
	let due_at = data.get('dueDate');
	let fromUrl = data.get('comeFrom')?.toString() ?? '/';

	const { error } = await supabase
		.from('task')
		.update({ summary: summary, description: desc, updated_at: new Date().toISOString() })
		.match({ id: task_id, project_id: project_id });

	throw redirect(302, fromUrl);
};
