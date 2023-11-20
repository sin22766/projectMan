import {error, redirect} from '@sveltejs/kit';

import type {Tables, Views} from "$lib/server/schema";

import type {LayoutServerLoad} from './$types';

export const load: LayoutServerLoad = async ({locals: {supabase, getSession}, params}) => {
    const session = await getSession();

    if (!session) {
        throw redirect(303, '/auth/login');
    }

    const id = params.id;

    const {
        data: project,
        error: projectError,
        status: projectStatus
    } = await supabase
        .from('project_detail')
        .select('id, name, description, last_updated')
        .eq('owner_id', session.user.id)
        .eq('id', id)
        .maybeSingle<Omit<Views<'project_detail'>, 'created_at' | 'owner_id'>>()


    if (projectError) {
        throw error(projectStatus, projectError.message);
    }

    if (!project) {
        throw error(404, 'Project not found');
    }

    const {
        data: task,
        error: taskError,
        status: taskStatus
    } = await supabase
        .from('task')
        .select('id, summary, description, status, due_at, project_id')
        .eq('project_id', id)
        .returns<Omit<Tables<"task">, "created_at">[]>()

    if (taskError) {
        throw error(taskStatus, taskError.message);
    }

    return {
        project: project,
        tasks: task
    };
};
