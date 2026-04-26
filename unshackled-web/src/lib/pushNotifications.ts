import { getVapidPublicKey, subscribeToPush as apiSubscribeToPush } from "./api/notifications";

/**
 * Registers the service worker located at /sw.js
 * Task F-16.2
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Helper to convert a base64 string to a Uint8Array for VAPID key
 */
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Subscribes to the browser's push manager using the VAPID public key.
 * Task F-16.2
 */
export async function subscribeToPush(vapidPublicKey: string): Promise<PushSubscription | null> {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      throw new Error('Service Worker not registered');
    }

    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    });

    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push:', error);
    return null;
  }
}

/**
 * Saves the subscription to the backend.
 * Task F-16.2
 */
export async function saveSubscription(subscription: PushSubscription): Promise<void> {
  const subJson = subscription.toJSON();
  
  if (subJson.endpoint && subJson.keys?.p256dh && subJson.keys?.auth) {
    await apiSubscribeToPush({
      endpoint: subJson.endpoint,
      p256dh: subJson.keys.p256dh,
      auth: subJson.keys.auth,
    });
  } else {
    throw new Error('Invalid push subscription data');
  }
}

/**
 * Orchestrates the full setup flow
 */
export async function setupPush(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  try {
    // 1. Register SW
    await registerServiceWorker();

    // 2. Get existing sub
    const registration = await navigator.serviceWorker.getRegistration();
    const existing = await registration?.pushManager.getSubscription();
    if (existing) return;

    // 3. Get Key
    const { publicKey } = await getVapidPublicKey();

    // 4. Subscribe
    const sub = await subscribeToPush(publicKey);
    if (sub) {
      // 5. Save
      await saveSubscription(sub);
    }
  } catch (err) {
    console.error('Push setup failed:', err);
  }
}
