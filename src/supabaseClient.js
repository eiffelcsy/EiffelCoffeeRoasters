/* eiffel.coffee.roasters — Supabase client
   Reads the project URL + anon key from Vite env vars (see .env.example).
   The anon key is safe to ship to the browser — every table it can touch
   is locked down with row-level security policies (see supabase/schema.sql). */

import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn('[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are not set — copy .env.example to .env and fill them in. Feedback + checkout will fail until then.');
}

export const supabase = createClient(url, anonKey);
