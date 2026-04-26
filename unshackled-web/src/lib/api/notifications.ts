import { apiFetch } from "./client";
import { Notification, PushSubscriptionRequest } from "./types";

/**
 * Retrieves notifications for the currently authenticated user.
 * 
 * @param onlyUnread If true, only fetches notifications that haven't been read.
 * @returns A list of notification records.
 */
export async function getNotifications(onlyUnread: boolean = false): Promise<Notification[]> {
  return apiFetch<Notification[]>(`/notifications?onlyUnread=${onlyUnread}`);
}

/**
 * Marks a specific notification as read.
 * 
 * @param id The UUID of the notification.
 */
export async function markRead(id: string): Promise<void> {
  return apiFetch<void>(`/notifications/${id}/read`, {
    method: "PUT",
  });
}

/**
 * Marks all notifications for the current user as read.
 */
export async function markAllRead(): Promise<void> {
  return apiFetch<void>("/notifications/read-all", {
    method: "PUT",
  });
}

/**
 * Retrieves the VAPID public key from the server for configuring Web Push.
 * 
 * @returns An object containing the public key.
 */
export async function getVapidPublicKey(): Promise<{ publicKey: string }> {
  return apiFetch<{ publicKey: string }>("/push/vapid-public-key");
}

/**
 * Subscribes the current device to web push notifications.
 * 
 * @param subscription The subscription details from the browser's PushManager.
 */
export async function subscribeToPush(subscription: PushSubscriptionRequest): Promise<void> {
  return apiFetch<void>("/push/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
  });
}

/**
 * Unsubscribes the current device from web push notifications.
 * 
 * @param endpoint The endpoint URL of the push subscription.
 */
export async function unsubscribeFromPush(endpoint: string): Promise<void> {
  return apiFetch<void>(`/push/unsubscribe?endpoint=${encodeURIComponent(endpoint)}`, {
    method: "DELETE",
  });
}
