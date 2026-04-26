"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowRight, Smartphone, Video, Send, Play, MessageCircle, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: <Smartphone className="w-4 h-4" /> },
  { id: "youtube", name: "YouTube", icon: <Video className="w-4 h-4" /> },
  { id: "twitter", name: "Twitter/X", icon: <Send className="w-4 h-4" /> },
  { id: "tiktok", name: "TikTok", icon: <Play className="w-4 h-4" /> },
  { id: "reddit", name: "Reddit", icon: <MessageCircle className="w-4 h-4" /> },
  { id: "other", name: "Other", icon: <MoreHorizontal className="w-4 h-4" /> },
];

export default function StepSeven_SocialMediaConfig() {
  const router = useRouter();
  const { habitConfigs, setHabitConfig } = useOnboardingStore();
  
  const config = habitConfigs["social_media"] || { hoursPerDay: 2, platforms: [] };

  const togglePlatform = (id: string) => {
    const platforms = config.platforms || [];
    const newPlatforms = platforms.includes(id) 
      ? platforms.filter((p: string) => p !== id) 
      : [...platforms, id];
    setHabitConfig("social_media", { ...config, platforms: newPlatforms });
  };

  const handleNext = () => {
    router.push("/onboarding/step/8"); // Next is Sugar
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-blue-500/20">
          <Smartphone className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-4xl font-display font-black tracking-tight mb-4">
          Digital Consumption
        </h1>
        <p className="text-slate-400 text-lg">
          Algorithms are designed to keep you scrolling. Let&apos;s define the boundaries.
        </p>
      </div>

      <Card className="w-full p-8 bg-white/5 border-white/10 space-y-10 mb-12">
        <div className="space-y-6">
          <Label className="text-lg font-bold text-white">Which platforms consume your time?</Label>
          <div className="flex flex-wrap gap-3">
            {PLATFORMS.map((platform) => {
              const isSelected = config.platforms?.includes(platform.id);
              return (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full border transition-all font-medium",
                    isSelected 
                      ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/20" 
                      : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/10"
                  )}
                >
                  {platform.icon}
                  {platform.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <Label htmlFor="hours" className="text-lg font-bold text-white">
            Daily screen time on these apps?
          </Label>
          <div className="flex items-center gap-6">
            <input 
              type="range"
              id="hours-range"
              min="0.5"
              max="16"
              step="0.5"
              value={config.hoursPerDay}
              onChange={(e) => setHabitConfig("social_media", { ...config, hoursPerDay: parseFloat(e.target.value) })}
              className="flex-1 accent-blue-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
            <div className="w-24 bg-blue-500/20 border border-blue-500/30 rounded-xl py-2 text-center text-xl font-bold font-display text-blue-100">
              {config.hoursPerDay}h
            </div>
          </div>
        </div>
      </Card>

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
