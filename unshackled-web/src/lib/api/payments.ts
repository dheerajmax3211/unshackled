import { apiFetch } from "./client";
import { SubscriptionStatus } from "./types";

/**
 * Creates a Stripe Checkout session for upgrading to a premium plan.
 * 
 * @param successUrl The URL to redirect to after successful payment.
 * @param cancelUrl The URL to redirect to if the user cancels the payment process.
 * @returns The Stripe Checkout URL.
 */
export async function createCheckout(
  successUrl: string,
  cancelUrl: string
): Promise<{ url: string }> {
  return apiFetch<{ url: string }>("/payments/checkout", {
    method: "POST",
    body: JSON.stringify({ successUrl, cancelUrl }),
  });
}

/**
 * Creates a Stripe Customer Portal session for managing subscriptions (cancel, update, invoices).
 * 
 * @param returnUrl The URL to redirect back to after the user leaves the portal.
 * @returns The Stripe Portal URL.
 */
export async function createPortal(returnUrl: string): Promise<{ url: string }> {
  return apiFetch<{ url: string }>("/payments/portal", {
    method: "POST",
    body: JSON.stringify({ returnUrl }),
  });
}

/**
 * Retrieves the current subscription status for the authenticated user.
 * 
 * @returns The subscription status object or throws 404 if no subscription exists.
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  return apiFetch<SubscriptionStatus>("/payments/status");
}
