"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { useOnboardingNavigation } from "@/hooks/useOnboardingNavigation";

interface OnboardingProgressBarProps {
  totalSteps?: number; // Kept for backwards compatibility but not used
}

/**
 * Animated progress bar for the onboarding flow.
 * Calculates percentage based on the current step in the sequence.
 */
export function OnboardingProgressBar({ totalSteps: _unused }: OnboardingProgressBarProps) {
  const { currentIndex, totalSteps } = useOnboardingNavigation();
  
  const displayStep = currentIndex + 1;
  const progress = Math.min((displayStep / totalSteps) * 100, 100);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
        <span>Step {displayStep} of {totalSteps}</span>
        <span>{Math.round(progress)}% Complete</span>
      </div>
      <Progress 
        value={progress} 
        className="h-1.5 bg-white/5 overflow-hidden" 
      />
    </div>
  );
}
