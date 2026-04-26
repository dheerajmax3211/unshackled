"use client";

import { useState, useEffect, useCallback } from "react";
import { setupPush } from "@/lib/pushNotifications";
import { toast } from "sonner";

/**
 * Hook to manage push notification permissions and setup.
 * Task F-16.3
 */
export function usePushNotifications() {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const supported = "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
      setIsSupported(supported);
      if (supported) {
        setPermissionStatus(Notification.permission);
      }
    }
  }, []);

  /**
   * Attempts to setup push notifications if permission is granted.
   * Runs silently in the background.
   */
  const autoSetup = useCallback(async () => {
    if (isSupported && Notification.permission === "granted") {
      await setupPush();
    }
  }, [isSupported]);

  /**
   * Public function to request permission and setup push.
   */
  const requestPermission = async () => {
    if (!isSupported) {
      toast.error("Push notifications are not supported on this browser.");
      return "denied";
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);

      if (permission === "granted") {
        await setupPush();
        toast.success("Notifications enabled. We'll keep you on the mission.");
      } else {
        toast.error("Notifications disabled. You might miss critical accountability alerts.");
      }

      return permission;
    } catch (error) {
      console.error("Permission request failed:", error);
      return "default";
    }
  };

  return {
    permissionStatus,
    isSupported,
    requestPermission,
    autoSetup,
  };
}
