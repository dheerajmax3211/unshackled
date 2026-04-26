"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { useOnboardingStore } from "@/store/useOnboardingStore";

interface OnboardingProgressBarProps {
  totalSteps?: number;
}

/**
 * Animated progress bar for the onboarding flow.
 * Calculates percentage based on the current step in the sequence.
 */
export function OnboardingProgressBar({ totalSteps = 14 }: OnboardingProgressBarProps) {
  const { step } = useOnboardingStore();
  const progress = Math.min((step / totalSteps) * 100, 100);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
        <span>Step {step} of {totalSteps}</span>
        <span>{Math.round(progress)}% Complete</span>
      </div>
      <Progress 
        value={progress} 
        className="h-1.5 bg-white/5 overflow-hidden" 
      />
    </div>
  );
}
