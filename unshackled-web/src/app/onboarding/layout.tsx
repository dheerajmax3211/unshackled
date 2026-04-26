"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, X } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { OnboardingProgressBar } from "@/components/onboarding/OnboardingProgressBar";
import { useOnboardingNavigation } from "@/hooks/useOnboardingNavigation";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isFirstStep, prevStep, totalSteps } = useOnboardingNavigation();

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] -z-10" />

      {/* Header / Progress bar */}
      <header className="sticky top-0 z-50 w-full bg-dark-bg/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/onboarding/step/${prevStep}`)}
              disabled={isFirstStep}
              className="text-slate-400 hover:text-white disabled:opacity-0"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Logo size="sm" className="hidden sm:flex" />
          </div>

          <div className="flex-1 max-w-md">
            <OnboardingProgressBar totalSteps={totalSteps} />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/login")}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-12 px-6">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </main>
    </div>
  );
}
