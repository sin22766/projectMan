import { z } from 'zod';

export const taskNewSchema = z.object({
	project_id: z.string().uuid(),
	summary: z.string().min(3),
	description: z.string().optional(),
	due_at: z.string().optional()
});

export const taskEditSchema = z.object({
	id: z.number(),
	project_id: z.string().uuid(),
	summary: z.string().min(3),
	description: z.string().optional(),
	status: z.enum(['todo', 'progress', 'done']),
	due_at: z.string().optional()
});
