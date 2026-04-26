"use client";

import { useEffect, useState } from "react";
import { useSupabaseClient } from "@/hooks/useSupabaseClient";
import { useUserStore } from "@/store/useUserStore";
import { getFriends } from "@/lib/api/friends";
import { toast } from "sonner";
import { Trophy, PartyPopper } from "lucide-react";
import React from "react";

/**
 * Hook to listen for friend milestones via Supabase Realtime.
 * Task F-17.3
 */
export function useRealtimeFriendActivity() {
  const supabase = useSupabaseClient();
  const { user } = useUserStore();
  const [friendIds, setFriendIds] = useState<string[]>([]);

  // 1. Fetch friend IDs on mount
  useEffect(() => {
    if (!user?.id) return;

    const fetchFriends = async () => {
      try {
        const friends = await getFriends();
        setFriendIds(friends.map(f => f.id));
      } catch (err) {
        console.error("Failed to fetch friends for realtime tracking:", err);
      }
    };

    fetchFriends();
  }, [user?.id]);

  // 2. Setup Realtime Subscription
  useEffect(() => {
    if (friendIds.length === 0) return;

    // Note: Supabase Realtime currently only supports 'eq' filters reliably.
    // For listening to multiple user IDs, we listen to all streak updates 
    // and filter in the client. This is efficient for small-to-medium user bases.
    const channel = supabase
      .channel('friend-milestones')
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "streaks",
        },
        (payload) => {
          const updatedStreak = payload.new as any;
          
          // Client-side membership check
          if (friendIds.includes(updatedStreak.user_id)) {
            const days = updatedStreak.current_streak;
            const milestones = [7, 30, 90, 365];
            
            if (milestones.includes(days)) {
              toast.success("Friend Milestone!", {
                description: `A comrade just hit a ${days}-day streak! 🎉`,
                icon: <PartyPopper className="w-4 h-4 text-amber-500" />,
                duration: 8000,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, friendIds]);
}
