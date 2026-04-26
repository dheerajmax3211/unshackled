"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowRight, Wind, IndianRupee } from "lucide-react";

export default function StepFive_VapingConfig() {
  const router = useRouter();
  const { habitConfigs, setHabitConfig } = useOnboardingStore();
  
  const config = habitConfigs["vaping"] || { podsPerWeek: 3, podCost: 450 };

  const weeklySpend = (config.podsPerWeek || 0) * (config.podCost || 0);

  const handleNext = () => {
    router.push("/onboarding/step/6"); 
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-blue-500/20">
          <Wind className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-4xl font-display font-black tracking-tight mb-4">
          Vaping Habit
        </h1>
        <p className="text-slate-400 text-lg">
          Vaping is often a hidden cost. Let&apos;s see how much you&apos;re really spending.
        </p>
      </div>

      <Card className="w-full p-8 bg-white/5 border-white/10 space-y-8 mb-12">
        <div className="space-y-4">
          <Label htmlFor="pods" className="text-lg font-bold text-white flex items-center gap-2">
            How many pods/coils per week?
          </Label>
          <div className="flex items-center gap-4">
            <input 
              type="range"
              id="pods-range"
              min="1"
              max="20"
              value={config.podsPerWeek}
              onChange={(e) => setHabitConfig("vaping", { podsPerWeek: parseInt(e.target.value) })}
              className="flex-1 accent-blue-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
            <Input
              type="number"
              value={config.podsPerWeek}
              onChange={(e) => setHabitConfig("vaping", { podsPerWeek: parseInt(e.target.value) || 0 })}
              className="w-24 bg-white/5 border-white/10 text-center text-xl font-bold font-display"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="cost" className="text-lg font-bold text-white flex items-center gap-2">
            Average cost per pod/refill?
          </Label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <IndianRupee className="w-5 h-5" />
            </div>
            <Input
              id="cost"
              type="number"
              value={config.podCost}
              onChange={(e) => setHabitConfig("vaping", { podCost: parseFloat(e.target.value) || 0 })}
              className="pl-12 bg-white/5 border-white/10 text-xl h-14"
              placeholder="0.00"
            />
          </div>
        </div>
      </Card>

      <div className="w-full p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center mb-12">
        <p className="text-blue-200/60 text-sm font-bold uppercase tracking-widest mb-1">
          Weekly Pod Cost
        </p>
        <p className="text-3xl font-display font-black text-blue-400">
          ₹{weeklySpend.toLocaleString()} per week.
        </p>
        <p className="text-blue-200/40 text-xs mt-2 italic">
          Imagine what else you could do with ₹{(weeklySpend * 52).toLocaleString()} a year.
        </p>
      </div>

      <Button 
        size="lg" 
        onClick={handleNext}
        className="w-full sm:w-64 bg-blue-600 text-white hover:bg-blue-700 font-bold h-14 rounded-2xl group"
      >
        Continue
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
