"use client";

import React, { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { useAuth } from "@/hooks/useAuth";
import { useOnboardingNavigation } from "@/hooks/useOnboardingNavigation";

// Step Components
import StepOne_WelcomeOrSupporter from "@/components/onboarding/StepOne_WelcomeOrSupporter";
import StepTwo_HabitPicker from "@/components/onboarding/StepTwo_HabitPicker";
import StepThree_SmokingConfig from "@/components/onboarding/StepThree_SmokingConfig";
import StepFour_DrinkingConfig from "@/components/onboarding/StepFour_DrinkingConfig";
import StepFive_VapingConfig from "@/components/onboarding/StepFive_VapingConfig";
import StepSix_PornConfig from "@/components/onboarding/StepSix_PornConfig";
import StepSeven_SocialMediaConfig from "@/components/onboarding/StepSeven_SocialMediaConfig";
import StepEight_SugarConfig from "@/components/onboarding/StepEight_SugarConfig";
import StepNine_GamblingConfig from "@/components/onboarding/StepNine_GamblingConfig";
import StepTen_CustomHabitConfig from "@/components/onboarding/StepTen_CustomHabitConfig";
import StepEleven_QuitDate from "@/components/onboarding/StepEleven_QuitDate";
import StepTwelve_SupporterSetup from "@/components/onboarding/StepTwelve_SupporterSetup";

const STEP_COMPONENTS: Record<number, React.ComponentType> = {
  1: StepOne_WelcomeOrSupporter,
  2: StepTwo_HabitPicker,
  3: StepThree_SmokingConfig,
  4: StepFour_DrinkingConfig,
  5: StepFive_VapingConfig,
  6: StepSix_PornConfig,
  7: StepSeven_SocialMediaConfig,
  8: StepEight_SugarConfig,
  9: StepNine_GamblingConfig,
  10: StepTen_CustomHabitConfig,
  11: StepEleven_QuitDate,
  12: StepTwelve_SupporterSetup,
};

export default function OnboardingStepPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { setStep } = useOnboardingStore();
  const { stepSequence } = useOnboardingNavigation();
  
  const currentStep = parseInt(params.step as string) || 1;

  // Sync global store step
  useEffect(() => {
    setStep(currentStep);
  }, [currentStep, setStep]);

  // Security & Validation
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    // If step is not in the allowed sequence (e.g. habit not selected), 
    // redirect to the nearest valid step.
    if (!stepSequence.includes(currentStep)) {
      const fallback = stepSequence.find(s => s >= currentStep) || stepSequence[stepSequence.length - 1];
      router.replace(`/onboarding/step/${fallback}`);
    }
  }, [authLoading, user, currentStep, stepSequence, router]);

  const ActiveComponent = STEP_COMPONENTS[currentStep] || StepOne_WelcomeOrSupporter;

  if (authLoading || !user) return null;

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ActiveComponent />
    </div>
  );
}
