"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const HABIT_CATALOG = [
  { id: "smoking", name: "Smoking", icon: "🚬", description: "Cigarettes, cigars, or tobacco." },
  { id: "vaping", name: "Vaping", icon: "💨", description: "E-cigarettes and nicotine pods." },
  { id: "drinking", name: "Drinking", icon: "🍺", description: "Alcohol and binge drinking." },
  { id: "porn", name: "Pornography", icon: "🔞", description: "Compulsive adult content consumption." },
  { id: "social_media", name: "Social Media", icon: "📱", description: "Instagram, TikTok, or endless scrolling." },
  { id: "sugar", name: "Junk Food", icon: "🍰", description: "Excessive sugar or emotional eating." },
  { id: "gambling", name: "Gambling", icon: "🎰", description: "Sports betting or casino games." },
  { id: "custom", name: "Custom", icon: "✨", description: "Anything else you want to break free from." },
];

export default function StepTwo_HabitPicker() {
  const router = useRouter();
  const { selectedHabitIds, setSelectedHabitIds, isSupporter } = useOnboardingStore();

  const toggleHabit = (id: string) => {
    if (selectedHabitIds.includes(id)) {
      setSelectedHabitIds(selectedHabitIds.filter((h) => h !== id));
    } else {
      setSelectedHabitIds([...selectedHabitIds, id]);
    }
  };

  const handleNext = () => {
    if (selectedHabitIds.length === 0) return;
    if (isSupporter) {
      router.push("/onboarding/step/12");
    } else {
      router.push("/onboarding/step/3");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-black tracking-tight mb-4">
          What are we breaking?
        </h1>
        <p className="text-slate-400 text-lg">
          Select all that apply. We&apos;ll customize your experience for each.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-12">
        {HABIT_CATALOG.map((habit) => {
          const isSelected = selectedHabitIds.includes(habit.id);
          return (
            <Card
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={cn(
                "p-6 cursor-pointer transition-all duration-300 border-2 bg-white/5 relative group",
                isSelected 
                  ? "border-amber-500 ring-4 ring-amber-500/10" 
                  : "border-white/5 hover:border-white/20"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{habit.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">
                    {habit.name}
                  </h3>
                  <p className="text-sm text-slate-500 leading-snug">
                    {habit.description}
                  </p>
                </div>
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center animate-in zoom-in">
                    <Check className="w-4 h-4 text-black font-bold" />
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="sticky bottom-8 w-full flex justify-center pt-8 bg-gradient-to-t from-dark-bg via-dark-bg/80 to-transparent">
        <Button 
          size="lg" 
          onClick={handleNext}
          disabled={selectedHabitIds.length === 0}
          className="w-full sm:w-64 bg-amber-500 text-black hover:bg-amber-600 font-bold h-14 rounded-2xl group disabled:opacity-50"
        >
          {selectedHabitIds.length === 0 ? "Select at least one" : "Continue"}
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
