
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../../../types/supabase";

export type SupabaseClient = ReturnType<typeof createSupabaseClient>
export function createSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}