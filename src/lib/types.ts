export interface Task {
	id: number;
	project_id: string;
	summary: string;
	description: string | null;
	due_at: string | null;
	status: 'todo' | 'progress' | 'done';
	created_at: string;
	updated_at: string;
}
