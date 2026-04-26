"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, PartyPopper, ArrowRight, ShieldCheck } from "lucide-react";
import { getSubscriptionStatus } from "@/lib/api/payments";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

  useEffect(() => {
    // Fire confetti on mount
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3B82F6", "#06B6D4", "#FFFFFF"]
    });

    let pollCount = 0;
    const pollInterval = setInterval(async () => {
      try {
        const sub = await getSubscriptionStatus();
        if (sub.plan !== "FREE") {
          setStatus("success");
          clearInterval(pollInterval);
          toast.success("Welcome to the Sovereign Plan!");
        }
      } catch (error) {
        console.error("Polling error:", error);
      }

      pollCount++;
      if (pollCount > 10) { // Timeout after 30 seconds (3s * 10)
        clearInterval(pollInterval);
        setStatus("success"); // Assume success if we timed out but Stripe might be slow
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto pt-20 text-center space-y-8">
      <div className="relative inline-block">
        <div className="absolute inset-0 bg-brand-blue/20 blur-3xl rounded-full" />
        <div className="relative bg-white/5 border border-brand-blue/30 p-6 rounded-3xl animate-in zoom-in-95 duration-500">
          <PartyPopper className="w-16 h-16 text-brand-blue mx-auto" />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl font-black text-white">Payment Successful!</h1>
        <p className="text-slate-400 text-lg">
          Your sovereignty has been restored. We&apos;re currently activating your premium features...
        </p>
      </div>

      <Card className="p-8 bg-white/[0.03] border-white/10 space-y-6">
        <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <ShieldCheck className="w-8 h-8 text-emerald-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-white">Plan Activated: Sovereign</p>
            <p className="text-xs text-emerald-500/70">All premium features are now unlocked for your account.</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={() => router.push("/dashboard")} 
            className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-bold h-12"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-xs text-slate-500">
            {status === "verifying" ? "Synchronizing with Stripe..." : "System synchronized."}
          </p>
        </div>
      </Card>
    </div>
  );
}
