import { createClient, SupabaseClient } from "@supabase/supabase-js";

const clients: Record<string, SupabaseClient> = {};

export function getSupabaseClient(token: string): SupabaseClient {
  if (!clients[token]) {
    clients[token] = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );
  }
  return clients[token];
}
