"use client";

import { useState } from "react";
import { createCheckout } from "@/lib/api/payments";
import { toast } from "sonner";

export function useCheckout() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const successUrl = `${window.location.origin}/premium/success`;
      const cancelUrl = `${window.location.origin}/premium/cancelled`;
      
      const { url } = await createCheckout(successUrl, cancelUrl);
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return { handleCheckout, loading };
}
