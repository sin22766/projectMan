export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			project: {
				Row: {
					created_at: string;
					description: string | null;
					id: string;
					name: string;
					owner_id: string;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					id?: string;
					name: string;
					owner_id: string;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					id?: string;
					name?: string;
					owner_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'project_owner_id_fkey';
						columns: ['owner_id'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					}
				];
			};
			task: {
				Row: {
					created_at: string;
					description: string | null;
					due_at: string | null;
					id: number;
					project_id: string;
					status: Database['public']['Enums']['task_status'];
					summary: string;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					due_at?: string | null;
					id: number;
					project_id: string;
					status?: Database['public']['Enums']['task_status'];
					summary: string;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					due_at?: string | null;
					id?: number;
					project_id?: string;
					status?: Database['public']['Enums']['task_status'];
					summary?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'task_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'project';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'task_project_id_fkey';
						columns: ['project_id'];
						isOneToOne: false;
						referencedRelation: 'project_detail';
						referencedColumns: ['id'];
					}
				];
			};
			user: {
				Row: {
					created_at: string;
					id: string;
					name: string | null;
				};
				Insert: {
					created_at?: string;
					id: string;
					name?: string | null;
				};
				Update: {
					created_at?: string;
					id?: string;
					name?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'user_id_fkey';
						columns: ['id'];
						isOneToOne: true;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			project_detail: {
				Row: {
					created_at: string | null;
					description: string | null;
					id: string | null;
					last_updated: string | null;
					name: string | null;
					owner_id: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'project_owner_id_fkey';
						columns: ['owner_id'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			task_status: 'todo' | 'progress' | 'done';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}
