// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { Session, SupabaseClient } from '@supabase/supabase-js';

import { Database } from '$lib/server/database/schema';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;

			getSession(): Promise<Session | null>;
		}

		interface PageData {
			session: Session | null;
		}

		// interface Error {}
		// interface Platform {}
	}
}

export {};
