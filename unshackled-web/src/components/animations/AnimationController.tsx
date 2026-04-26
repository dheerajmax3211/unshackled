"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import OnboardingCompleteAnimation from "./OnboardingCompleteAnimation";
import StreakMilestoneAnimation from "./StreakMilestoneAnimation";
import ChallengeReceivedAnimation from "./ChallengeReceivedAnimation";
import RelapseRecoveryAnimation from "./RelapseRecoveryAnimation";

type AnimationType = 
  | { type: "ONBOARDING_COMPLETE" }
  | { type: "STREAK_MILESTONE"; days: number }
  | { type: "CHALLENGE_RECEIVED"; senderName: string }
  | { type: "RELAPSE_RECOVERY" };

interface AnimationContextType {
  triggerAnimation: (anim: AnimationType) => void;
}

const AnimationContext = createContext<AnimationContextType | null>(null);

/**
 * Global Animation Provider.
 * Manages a queue of full-screen animations to ensure they don't overlap.
 */
export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [activeAnimation, setActiveAnimation] = useState<AnimationType | null>(null);
  const queue = useRef<AnimationType[]>([]);

  const playNext = useCallback(() => {
    if (queue.current.length > 0) {
      const next = queue.current.shift()!;
      setActiveAnimation(next);
    } else {
      setActiveAnimation(null);
    }
  }, []);

  const triggerAnimation = useCallback((anim: AnimationType) => {
    if (activeAnimation) {
      queue.current.push(anim);
    } else {
      setActiveAnimation(anim);
    }
  }, [activeAnimation]);

  const handleComplete = () => {
    playNext();
  };

  return (
    <AnimationContext.Provider value={{ triggerAnimation }}>
      {children}

      {/* Render the active animation */}
      {activeAnimation?.type === "ONBOARDING_COMPLETE" && (
        <OnboardingCompleteAnimation onComplete={handleComplete} />
      )}
      
      {activeAnimation?.type === "STREAK_MILESTONE" && (
        <StreakMilestoneAnimation 
          days={activeAnimation.days} 
          onComplete={handleComplete} 
        />
      )}

      {activeAnimation?.type === "CHALLENGE_RECEIVED" && (
        <ChallengeReceivedAnimation 
          senderName={activeAnimation.senderName} 
          onComplete={handleComplete} 
        />
      )}

      {activeAnimation?.type === "RELAPSE_RECOVERY" && (
        <RelapseRecoveryAnimation onComplete={handleComplete} />
      )}
    </AnimationContext.Provider>
  );
}

/**
 * Hook to trigger full-screen animations from any component.
 */
export function useAnimation() {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error("useAnimation must be used within an AnimationProvider");
  }
  return context;
}
