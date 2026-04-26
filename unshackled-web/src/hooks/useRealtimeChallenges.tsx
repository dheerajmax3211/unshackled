"use client";

import { useEffect } from "react";
import { useSupabaseClient } from "@/hooks/useSupabaseClient";
import { useChallengeStore } from "@/store/useChallengeStore";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "sonner";
import { Zap } from "lucide-react";
import React from "react";

/**
 * Hook to listen for real-time challenge updates via Supabase.
 * Task F-17.2
 */
export function useRealtimeChallenges() {
  const supabase = useSupabaseClient();
  const { user } = useUserStore();
  const { addChallenge, updateChallenge } = useChallengeStore();

  useEffect(() => {
    if (!user?.id) return;

    // 1. Listen for NEW challenges received (INSERT where challenged_id = userId)
    const newChallengeChannel = supabase
      .channel(`incoming-challenges-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "challenges",
          filter: `challenged_id=eq.${user.id}`,
        },
        (payload) => {
          const newChallenge = payload.new as any;
          addChallenge(newChallenge);
          
          toast.info("New Challenge Received!", {
            description: "A friend has challenged your sovereignty. Prepare yourself.",
            icon: <Zap className="w-4 h-4 text-brand-blue animate-pulse" />,
            duration: 10000,
          });
        }
      )
      .subscribe();

    // 2. Listen for UPDATES on challenges (e.g., when a friend reviews our response)
    const challengeUpdateChannel = supabase
      .channel(`challenge-updates-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "challenges",
          // We listen for updates where we are either challenger or challenged
        },
        (payload) => {
          const updated = payload.new as any;
          
          // Only process if it's relevant to us
          if (updated.challenger_id === user.id || updated.challenged_id === user.id) {
            updateChallenge(updated.id, updated);

            // Notify if status changed to something final
            if (updated.status === 'approved') {
              toast.success("Challenge Approved!", {
                description: "Your proof was accepted. Victory is yours.",
              });
            } else if (updated.status === 'rejected') {
              toast.error("Challenge Rejected", {
                description: "Your proof was dismissed. Maintain focus.",
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(newChallengeChannel);
      supabase.removeChannel(challengeUpdateChannel);
    };
  }, [supabase, user?.id, addChallenge, updateChallenge]);
}
