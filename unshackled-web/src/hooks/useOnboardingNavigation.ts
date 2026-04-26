"use client";

import { useMemo } from "react";
import { useOnboardingStore } from "@/store/useOnboardingStore";

// Habit IDs from catalog: smoking, drinking, vaping, porn, social_media, sugar, gambling, custom
export function useOnboardingNavigation() {
  const { selectedHabitIds, isSupporter, step } = useOnboardingStore();

  const stepSequence = useMemo(() => {
    const steps = [1, 2]; // Welcome and Habit Picker are always first

    if (!isSupporter) {
      if (selectedHabitIds.includes("smoking")) steps.push(3);
      if (selectedHabitIds.includes("drinking")) steps.push(4);
      if (selectedHabitIds.includes("vaping")) steps.push(5);
      if (selectedHabitIds.includes("porn")) steps.push(6);
      if (selectedHabitIds.includes("social_media")) steps.push(7);
      if (selectedHabitIds.includes("sugar")) steps.push(8);
      if (selectedHabitIds.includes("gambling")) steps.push(9);
      if (selectedHabitIds.includes("custom")) steps.push(10);
      
      steps.push(11); // Quit Date is always last for habit-breakers
    } else {
      steps.push(12); // Supporter Setup is only for supporters
    }

    return steps;
  }, [selectedHabitIds, isSupporter]);

  const currentIndex = stepSequence.indexOf(step);
  const nextStep = stepSequence[currentIndex + 1] || null;
  const prevStep = stepSequence[currentIndex - 1] || null;
  const totalSteps = stepSequence.length;

  return {
    stepSequence,
    currentIndex,
    nextStep,
    prevStep,
    totalSteps,
    isFirstStep: currentIndex === 0,
    isLastStep: currentIndex === stepSequence.length - 1,
  };
}
