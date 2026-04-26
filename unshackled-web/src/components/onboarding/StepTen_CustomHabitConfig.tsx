"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Sparkles, Clock, IndianRupee } from "lucide-react";

export default function StepTen_CustomHabitConfig() {
  const router = useRouter();
  const { habitConfigs, setHabitConfig } = useOnboardingStore();
  
  const config = habitConfigs["custom"] || { 
    description: "", 
    timePerDay: 1, 
    spendPerDay: 0 
  };

  const handleNext = () => {
    router.push("/onboarding/step/11"); // Next is Quit Date
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-brand-blue/20">
          <Sparkles className="w-8 h-8 text-brand-blue" />
        </div>
        <h1 className="text-4xl font-display font-black tracking-tight mb-4">
          Custom Challenge
        </h1>
        <p className="text-slate-400 text-lg">
          Define the habit you want to break in your own words.
        </p>
      </div>

      <Card className="w-full p-8 bg-white/5 border-white/10 space-y-8 mb-12">
        <div className="space-y-4">
          <Label htmlFor="description" className="text-lg font-bold text-white">
            What habit are you breaking?
          </Label>
          <Textarea
            id="description"
            placeholder="e.g., Caffeine addiction, nail biting, or late-night snacking..."
            value={config.description}
            onChange={(e) => setHabitConfig("custom", { ...config, description: e.target.value })}
            className="bg-white/5 border-white/10 min-h-[100px] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label htmlFor="time" className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-blue" />
              Hours per day?
            </Label>
            <Input
              id="time"
              type="number"
              value={config.timePerDay}
              onChange={(e) => setHabitConfig("custom", { ...config, timePerDay: parseFloat(e.target.value) || 0 })}
              className="bg-white/5 border-white/10"
              placeholder="0"
            />
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="spend" className="text-lg font-bold text-white flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-brand-blue" />
              Spend per day?
            </Label>
            <Input
              id="spend"
              type="number"
              value={config.spendPerDay}
              onChange={(e) => setHabitConfig("custom", { ...config, spendPerDay: parseFloat(e.target.value) || 0 })}
              className="bg-white/5 border-white/10"
              placeholder="0.00"
            />
          </div>
        </div>
      </Card>

      <Button 
        size="lg" 
        onClick={handleNext}
        disabled={!config.description}
        className="w-full sm:w-64 bg-brand-blue text-white hover:bg-brand-blue/90 font-bold h-14 rounded-2xl group disabled:opacity-50"
      >
        Continue
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
