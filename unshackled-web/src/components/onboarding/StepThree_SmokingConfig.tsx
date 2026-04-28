"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowRight, Cigarette, IndianRupee } from "lucide-react";

export default function StepThree_SmokingConfig() {
  const router = useRouter();
  const { habitConfigs, setHabitConfig } = useOnboardingStore();
  
  const defaultConfig = { cigarettesPerDay: 10, costPerCigarette: 18 };
  const config = { ...defaultConfig, ...(habitConfigs["smoking"] || {}) };

  const weeklySpend = (config.cigarettesPerDay || 0) * (config.costPerCigarette || 0) * 7;

  const handleNext = () => {
    router.push("/onboarding/step/4");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-amber-500/20">
          <Cigarette className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-4xl font-display font-black tracking-tight mb-4">
          Smoking Profile
        </h1>
        <p className="text-slate-400 text-lg">
          Be honest. This data helps us calculate your savings and health recovery.
        </p>
      </div>

      <Card className="w-full p-8 bg-white/5 border-white/10 space-y-8 mb-12">
        <div className="space-y-4">
          <Label htmlFor="cigarettes" className="text-lg font-bold text-white flex items-center gap-2">
            How many cigarettes per day?
          </Label>
          <div className="flex items-center gap-4">
            <input 
              type="range"
              id="cigarettes-range"
              min="1"
              max="60"
              value={config.cigarettesPerDay}
              onChange={(e) => setHabitConfig("smoking", { cigarettesPerDay: parseInt(e.target.value) })}
              className="flex-1 accent-amber-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
            <Input
              type="number"
              value={config.cigarettesPerDay}
              onChange={(e) => setHabitConfig("smoking", { cigarettesPerDay: parseInt(e.target.value) || 0 })}
              className="w-24 bg-white/5 border-white/10 text-center text-xl font-bold font-display"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="cost" className="text-lg font-bold text-white flex items-center gap-2">
            Average cost per cigarette?
          </Label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <IndianRupee className="w-5 h-5" />
            </div>
            <Input
              id="cost"
              type="number"
              value={config.costPerCigarette}
              onChange={(e) => setHabitConfig("smoking", { costPerCigarette: parseFloat(e.target.value) || 0 })}
              className="pl-12 bg-white/5 border-white/10 text-xl h-14"
              placeholder="0.00"
            />
          </div>
        </div>
      </Card>

      <div className="w-full p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center mb-12">
        <p className="text-amber-200/60 text-sm font-bold uppercase tracking-widest mb-1">
          Estimated Spend
        </p>
        <p className="text-3xl font-display font-black text-amber-400">
          At that rate, you spend ₹{weeklySpend.toLocaleString()} per week.
        </p>
        <p className="text-amber-200/40 text-xs mt-2 italic">
          That&apos;s ₹{(weeklySpend * 52).toLocaleString()} every year.
        </p>
      </div>

      <Button 
        size="lg" 
        onClick={handleNext}
        className="w-full sm:w-64 bg-amber-500 text-black hover:bg-amber-600 font-bold h-14 rounded-2xl group"
      >
        Continue
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
