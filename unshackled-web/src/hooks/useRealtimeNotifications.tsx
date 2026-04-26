"use client";

import { useEffect } from "react";
import { useSupabaseClient } from "@/hooks/useSupabaseClient";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import React from "react";

/**
 * Hook to listen for real-time notification updates via Supabase.
 * Task F-17.1
 */
export function useRealtimeNotifications() {
  const supabase = useSupabaseClient();
  const { user } = useUserStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!user?.id) return;

    // Create a channel for notifications targeting this user
    // The filter 'user_id=eq.<uuid>' ensures we only get our own notifications
    const channel = supabase
      .channel(`user-notifications-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as any;
          
          // 1. Update Zustand Store
          addNotification({
            id: newNotification.id,
            userId: newNotification.user_id,
            type: newNotification.type,
            title: newNotification.title || "Notification",
            body: newNotification.body || newNotification.content,
            isRead: newNotification.is_read || newNotification.read || false,
            pushSent: false,
            emailSent: false,
            createdAt: newNotification.created_at,
          });

          // 2. Show Premium Toast
          toast.info(newNotification.title || "Mission Update", {
            description: newNotification.body || newNotification.content,
            icon: <Bell className="w-4 h-4 text-brand-blue" />,
            duration: 5000,
          });

          // 3. Play subtle sound (optional, but requested in arch)
          // new Audio('/sounds/notification.mp3').play().catch(() => {});
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user?.id, addNotification]);
}
