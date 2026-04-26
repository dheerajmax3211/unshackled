import { create } from "zustand";
import { Notification } from "@/lib/api/types";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;

  // Actions
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markRead: (notificationId: string) => void;
  markAllRead: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Global store for user notifications.
 * Tracks notification list and unread count for the navbar badge.
 */
export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  /**
   * Initializes the notification list and calculates the initial unread count.
   */
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),

  /**
   * Adds a new notification to the top of the list (e.g., received via Web Push).
   */
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
    })),

  /**
   * Marks a specific notification as read and decrements the unread count.
   */
  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  /**
   * Marks all notifications in the store as read.
   */
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),

  /**
   * Manually toggles the loading state.
   */
  setLoading: (loading) => set({ loading }),
}));
