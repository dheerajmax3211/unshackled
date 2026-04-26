"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, HeartPulse, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StepOne_WelcomeOrSupporter() {
  const router = useRouter();
  const { isSupporter, setSupporter } = useOnboardingStore();

  const handleNext = () => {
    router.push("/onboarding/step/2");
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-4">
        Choose your path.
      </h1>
      <p className="text-slate-400 text-lg mb-12 max-w-md">
        How do you want to use Unshackled? You can change this later in settings.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
        {/* Path: Breaking Habits */}
        <Card
          onClick={() => setSupporter(false)}
          className={cn(
            "p-8 cursor-pointer transition-all duration-300 border-2 bg-white/5",
            !isSupporter 
              ? "border-brand-blue ring-4 ring-brand-blue/10 scale-[1.02]" 
              : "border-white/5 hover:border-white/20"
          )}
        >
          <div className="w-16 h-16 bg-brand-blue/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <HeartPulse className="w-8 h-8 text-brand-blue" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">I want to quit a habit</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            I have an addiction or bad habit I want to break with the help of accountability.
          </p>
        </Card>

        {/* Path: Supporter */}
        <Card
          onClick={() => setSupporter(true)}
          className={cn(
            "p-8 cursor-pointer transition-all duration-300 border-2 bg-white/5",
            isSupporter 
              ? "border-brand-blue ring-4 ring-brand-blue/10 scale-[1.02]" 
              : "border-white/5 hover:border-white/20"
          )}
        >
          <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">I&apos;m here to support</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            I want to help a friend stay accountable and track their progress alongside them.
          </p>
        </Card>
      </div>

      <Button 
        size="lg" 
        onClick={handleNext}
        className="w-full sm:w-64 bg-white text-black hover:bg-slate-200 font-bold h-14 rounded-2xl group"
      >
        Continue
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
