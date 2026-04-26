"use client";

import React from "react";
import { cn } from "@/lib/utils";

// Mapping slugs to icons and brand colors
const HABIT_MAP: Record<string, { icon: any; color: string; bg: string }> = {
  smoking: { icon: "🚬", color: "text-rose-500", bg: "bg-rose-500/10" },
  drinking: { icon: "🍺", color: "text-amber-500", bg: "bg-amber-500/10" },
  vaping: { icon: "💨", color: "text-cyan-500", bg: "bg-cyan-500/10" },
  porn: { icon: "🔞", color: "text-purple-500", bg: "bg-purple-500/10" },
  social_media: { icon: "📱", color: "text-blue-500", bg: "bg-blue-500/10" },
  sugar: { icon: "🍬", color: "text-pink-500", bg: "bg-pink-500/10" },
  gambling: { icon: "🎲", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  custom: { icon: "✨", color: "text-brand-blue", bg: "bg-brand-blue/10" },
};

interface HabitIconProps {
  slug: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showBg?: boolean;
}

export default function HabitIcon({ 
  slug, 
  className, 
  size = "md", 
  showBg = true 
}: HabitIconProps) {
  const config = HABIT_MAP[slug] || HABIT_MAP.custom;
  
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-lg",
    lg: "w-14 h-14 text-2xl",
    xl: "w-20 h-20 text-4xl"
  };

  return (
    <div className={cn(
      "flex items-center justify-center rounded-2xl transition-all duration-300",
      sizeClasses[size],
      showBg && config.bg,
      className
    )}>
      <span>{config.icon}</span>
    </div>
  );
}
