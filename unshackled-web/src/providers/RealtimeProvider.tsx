"use client";

import React from "react";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import { useRealtimeChallenges } from "@/hooks/useRealtimeChallenges";
import { useRealtimeFriendActivity } from "@/hooks/useRealtimeFriendActivity";

/**
 * Global provider to mount and manage all Supabase Realtime subscriptions.
 * Task F-17.4
 */
export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  // Mount hooks
  useRealtimeNotifications();
  useRealtimeChallenges();
  useRealtimeFriendActivity();

  return <>{children}</>;
}
