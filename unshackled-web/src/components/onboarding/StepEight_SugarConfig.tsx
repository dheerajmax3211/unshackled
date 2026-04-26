"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowRight, Cake, IndianRupee } from "lucide-react";

export default function StepEight_SugarConfig() {
  const router = useRouter();
  const { habitConfigs, setHabitConfig } = useOnboardingStore();
  
  const config = habitConfigs["sugar"] || { weeklySpend: 1500 };

  const handleNext = () => {
    router.push("/onboarding/step/9"); // Next is Gambling
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-pink-500/20">
          <Cake className="w-8 h-8 text-pink-500" />
        </div>
        <h1 className="text-4xl font-display font-black tracking-tight mb-4">
          Sugar & Junk Food
        </h1>
        <p className="text-slate-400 text-lg">
          Emotional eating and sugar spikes drain your energy and focus.
        </p>
      </div>

      <Card className="w-full p-8 bg-white/5 border-white/10 space-y-8 mb-12">
        <div className="space-y-4">
          <Label htmlFor="spend" className="text-lg font-bold text-white">
            Estimated spend per week on junk food/sugar?
          </Label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <IndianRupee className="w-5 h-5" />
            </div>
            <Input
              id="spend"
              type="number"
              value={config.weeklySpend}
              onChange={(e) => setHabitConfig("sugar", { weeklySpend: parseFloat(e.target.value) || 0 })}
              className="pl-12 bg-white/5 border-white/10 text-xl h-14"
              placeholder="0.00"
            />
          </div>
          <p className="text-slate-500 text-sm">
            Include takeaways, sugary drinks, and processed snacks.
          </p>
        </div>
      </Card>

      <div className="w-full p-6 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-center mb-12">
        <p className="text-pink-200/60 text-sm font-bold uppercase tracking-widest mb-1">
          Annual Savings Potential
        </p>
        <p className="text-3xl font-display font-black text-pink-400">
          ₹{(config.weeklySpend * 52).toLocaleString()} saved per year.
        </p>
        <p className="text-pink-200/40 text-xs mt-2 italic">
          Plus better skin, deeper sleep, and more stable energy.
        </p>
      </div>

      <Button 
        size="lg" 
        onClick={handleNext}
        className="w-full sm:w-64 bg-pink-600 text-white hover:bg-pink-700 font-bold h-14 rounded-2xl group"
      >
        Continue
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
