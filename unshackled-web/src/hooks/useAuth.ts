"use client";

import { useEffect, useState } from "react";
import { useSupabaseClient } from "./useSupabaseClient";
import { User, Session } from "@supabase/supabase-js";

/**
 * Custom hook to track authentication state.
 * Subscribes to auth state changes and returns the current user and session.
 */
export function useAuth() {
  const supabase = useSupabaseClient();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session
    const getInitialAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialAuth();

    // 2. Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, session, loading };
}
