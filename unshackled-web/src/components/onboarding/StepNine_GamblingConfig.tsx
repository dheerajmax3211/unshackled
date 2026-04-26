"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowRight, Dices, IndianRupee } from "lucide-react";

export default function StepNine_GamblingConfig() {
  const router = useRouter();
  const { habitConfigs, setHabitConfig } = useOnboardingStore();
  
  const config = habitConfigs["gambling"] || { weeklySpend: 5000 };

  const handleNext = () => {
    router.push("/onboarding/step/10"); // Next is Custom
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-emerald-500/20">
          <Dices className="w-8 h-8 text-emerald-500" />
        </div>
        <h1 className="text-4xl font-display font-black tracking-tight mb-4">
          Financial Impact
        </h1>
        <p className="text-slate-400 text-lg max-w-md mx-auto">
          Gambling can spiral quickly. We&apos;ll help you track every rupee you reclaim.
        </p>
      </div>

      <Card className="w-full p-8 bg-white/5 border-white/10 space-y-8 mb-12">
        <div className="space-y-4">
          <Label htmlFor="spend" className="text-lg font-bold text-white">
            Estimated average spend per week?
          </Label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <IndianRupee className="w-5 h-5" />
            </div>
            <Input
              id="spend"
              type="number"
              value={config.weeklySpend}
              onChange={(e) => setHabitConfig("gambling", { weeklySpend: parseFloat(e.target.value) || 0 })}
              className="pl-12 bg-white/5 border-white/10 text-xl h-14"
              placeholder="0.00"
            />
          </div>
          <p className="text-slate-500 text-sm italic">
            Include sports betting, casinos, and online platforms.
          </p>
        </div>
      </Card>

      <div className="w-full p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center mb-12">
        <p className="text-emerald-200/60 text-sm font-bold uppercase tracking-widest mb-1">
          The Unshackled Advantage
        </p>
        <p className="text-3xl font-display font-black text-emerald-400">
          ₹{(config.weeklySpend * 52).toLocaleString()} saved annually.
        </p>
        <p className="text-emerald-200/40 text-xs mt-2 italic">
          This money belongs in your future, not the house&apos;s pockets.
        </p>
      </div>

      <Button 
        size="lg" 
        onClick={handleNext}
        className="w-full sm:w-64 bg-emerald-600 text-white hover:bg-emerald-700 font-bold h-14 rounded-2xl group"
      >
        Continue
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
