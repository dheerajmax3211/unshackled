"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowRight, EyeOff, Shield } from "lucide-react";

export default function StepSix_PornConfig() {
  const router = useRouter();
  const { habitConfigs, setHabitConfig } = useOnboardingStore();
  
  const config = habitConfigs["porn"] || { hoursPerDay: 1 };

  const handleNext = () => {
    router.push("/onboarding/step/7"); // Next is Social Media
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-indigo-500/20">
          <EyeOff className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-4xl font-display font-black tracking-tight mb-4">
          Privacy & Usage
        </h1>
        <p className="text-slate-400 text-lg max-w-md mx-auto">
          This information stays strictly private. We use it to understand your usage pattern and triggers.
        </p>
      </div>

      <Card className="w-full p-8 bg-white/5 border-white/10 space-y-8 mb-12">
        <div className="space-y-6">
          <Label htmlFor="hours" className="text-lg font-bold text-white flex items-center gap-2">
            Average time spent per day?
          </Label>
          <div className="flex items-center gap-6">
            <input 
              type="range"
              id="hours-range"
              min="0.5"
              max="12"
              step="0.5"
              value={config.hoursPerDay}
              onChange={(e) => setHabitConfig("porn", { hoursPerDay: parseFloat(e.target.value) })}
              className="flex-1 accent-indigo-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
            <div className="w-24 bg-indigo-500/20 border border-indigo-500/30 rounded-xl py-2 text-center text-xl font-bold font-display text-indigo-100">
              {config.hoursPerDay}h
            </div>
          </div>
          <p className="text-slate-500 text-sm italic">
            That&apos;s {(config.hoursPerDay * 365).toLocaleString()} hours a year. Time you can spend on your real goals.
          </p>
        </div>
      </Card>

      <div className="w-full p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-4 mb-12">
        <Shield className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
        <p className="text-slate-400 text-sm leading-relaxed">
          Unshackled uses this data to provide AI-driven intervention during your peak usage hours. 
          Your habit data is encrypted and never shared with other users without your explicit permission.
        </p>
      </div>

      <Button 
        size="lg" 
        onClick={handleNext}
        className="w-full sm:w-64 bg-indigo-600 text-white hover:bg-indigo-700 font-bold h-14 rounded-2xl group"
      >
        Continue
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
