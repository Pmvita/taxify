// Supabase client for the Taxify web app.
// Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) before using.
// In development without these variables, a throwaway client is NOT created — see the lazy getter below.

import { createClient } from '@supabase/supabase-js';

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient(): Promise<ReturnType<typeof createClient>> {
  if (supabaseInstance) {
    return Promise.resolve(supabaseInstance);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Supabase is not configured for this deployment. ' +
        'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).'
    );
  }

  supabaseInstance = createClient(url, anonKey, { global: { fetch } });
  return Promise.resolve(supabaseInstance);
}
