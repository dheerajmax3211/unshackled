"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowRight, Beer, IndianRupee } from "lucide-react";

export default function StepFour_DrinkingConfig() {
  const router = useRouter();
  const { habitConfigs, setHabitConfig } = useOnboardingStore();
  
  const defaultConfig = { drinksPerWeek: 5, costPerSession: 800 };
  const config = { ...defaultConfig, ...(habitConfigs["drinking"] || {}) };

  const weeklySpend = (config.drinksPerWeek || 0) * (config.costPerSession || 0);

  const handleNext = () => {
    router.push("/onboarding/step/5");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-rose-500/20">
          <Beer className="w-8 h-8 text-rose-500" />
        </div>
        <h1 className="text-4xl font-display font-black tracking-tight mb-4">
          Drinking Pattern
        </h1>
        <p className="text-slate-400 text-lg">
          Alcohol impacts sleep, liver health, and your wallet. Let&apos;s map it out.
        </p>
      </div>

      <Card className="w-full p-8 bg-white/5 border-white/10 space-y-8 mb-12">
        <div className="space-y-4">
          <Label htmlFor="drinks" className="text-lg font-bold text-white flex items-center gap-2">
            Average drinking sessions per week?
          </Label>
          <div className="flex items-center gap-4">
            <input 
              type="range"
              id="drinks-range"
              min="1"
              max="21"
              value={config.drinksPerWeek}
              onChange={(e) => setHabitConfig("drinking", { drinksPerWeek: parseInt(e.target.value) })}
              className="flex-1 accent-rose-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
            <Input
              type="number"
              value={config.drinksPerWeek}
              onChange={(e) => setHabitConfig("drinking", { drinksPerWeek: parseInt(e.target.value) || 0 })}
              className="w-24 bg-white/5 border-white/10 text-center text-xl font-bold font-display"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="cost" className="text-lg font-bold text-white flex items-center gap-2">
            Average spend per session?
          </Label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <IndianRupee className="w-5 h-5" />
            </div>
            <Input
              id="cost"
              type="number"
              value={config.costPerSession}
              onChange={(e) => setHabitConfig("drinking", { costPerSession: parseFloat(e.target.value) || 0 })}
              className="pl-12 bg-white/5 border-white/10 text-xl h-14"
              placeholder="0.00"
            />
          </div>
        </div>
      </Card>

      <div className="w-full p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center mb-12">
        <p className="text-rose-200/60 text-sm font-bold uppercase tracking-widest mb-1">
          Estimated Spend
        </p>
        <p className="text-3xl font-display font-black text-rose-400">
          You spend ₹{weeklySpend.toLocaleString()} per week on alcohol.
        </p>
        <p className="text-rose-200/40 text-xs mt-2 italic">
          That&apos;s ₹{(weeklySpend * 52).toLocaleString()} a year you could be investing.
        </p>
      </div>

      <Button 
        size="lg" 
        onClick={handleNext}
        className="w-full sm:w-64 bg-rose-500 text-white hover:bg-rose-600 font-bold h-14 rounded-2xl group"
      >
        Continue
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
