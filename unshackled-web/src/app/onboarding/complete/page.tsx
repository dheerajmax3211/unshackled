"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { completeOnboarding } from "@/lib/api/onboarding";
import { useAnimation } from "@/components/animations/AnimationController";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { OnboardingRequest, AddHabitRequest } from "@/lib/api/types";

/**
 * Onboarding Complete Page:
 * Finalizes the setup by submitting the collected data to the backend,
 * playing a celebratory animation, and transitioning to the dashboard.
 */
export default function OnboardingCompletePage() {
  const router = useRouter();
  const { triggerAnimation } = useAnimation();
  const state = useOnboardingStore();
  const [submitting, setSubmitting] = useState(true);

  useEffect(() => {
    const finalize = async () => {
      try {
        // 1. Prepare Habit Requests
        const habitRequests: AddHabitRequest[] = state.selectedHabitIds.map(habitId => {
          const config = state.habitConfigs[habitId] || {};
          
          return {
            habitId,
            quitDate: state.quitDate,
            // Spread config ( cigarettesPerDay, drinksPerWeek, etc.)
            ...config,
            // Map custom fields explicitly if habitId is 'custom'
            ...(habitId === "custom" ? {
              customDescription: config.description,
              customTimePerDay: config.timePerDay,
              customSpendPerDay: config.spendPerDay
            } : {})
          };
        });

        // 2. Prepare Full Request DTO
        const request: OnboardingRequest = {
          displayName: state.displayName || state.username || "User",
          country: state.country || "IN",
          currency: state.currency || "INR",
          isSupporter: state.isSupporter,
          quitDate: state.quitDate,
          habits: habitRequests,
        };

        // 3. Submit to Backend
        await completeOnboarding(request);

        // 4. Trigger Celebration
        triggerAnimation({ type: "ONBOARDING_COMPLETE" });

        // 5. Transition to Dashboard after animation (approx 5s)
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 5500);

      } catch (error: any) {
        console.error("Onboarding submission failed:", error);
        toast.error(error.message || "Failed to save your progress. Please try again.");
        setSubmitting(false);
      }
    };

    finalize();
  }, [state, triggerAnimation, router]);

  return (
    <div className="fixed inset-0 bg-dark-bg flex flex-col items-center justify-center text-center px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-blue/10 rounded-full blur-[100px] animate-pulse" />
      
      {submitting ? (
        <div className="relative z-10 space-y-6">
          <Loader2 className="w-12 h-12 text-brand-blue animate-spin mx-auto" />
          <h2 className="text-3xl font-display font-black text-white">
            Finalizing your path to freedom...
          </h2>
          <p className="text-slate-400 max-w-sm mx-auto">
            We&apos;re configuring your personal dashboard and setting up your accountability system.
          </p>
        </div>
      ) : (
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-display font-black text-white">
            Something went wrong.
          </h2>
          <p className="text-slate-400 mb-8">
            We couldn&apos;t complete your setup. Please check your connection.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-brand-blue text-white rounded-2xl font-bold hover:bg-brand-blue/90"
          >
            Retry Finalization
          </button>
        </div>
      )}
    </div>
  );
}
