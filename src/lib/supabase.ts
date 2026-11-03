import { createClient } from "@supabase/supabase-js";

// Public (browser-safe) Supabase client for AgriXpert.
// NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are read from
// environment variables (.env.local locally, Vercel Project Settings in
// production) and are safe to expose to the client — they are gated by
// Supabase Row Level Security (RLS) policies, not secrecy.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly in development rather than silently returning a broken client.
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
