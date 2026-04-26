import { createClient } from "@/lib/supabase/client";
import { useMemo } from "react";

/**
 * Custom hook to provide a memoized instance of the Supabase browser client.
 * This ensures that the client is only created once in the browser.
 */
export function useSupabaseClient() {
  const supabase = useMemo(() => createClient(), []);
  return supabase;
}
