"use client";

import React from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  days: number;
  className?: string;
}

export default function StreakBadge({ days, className }: StreakBadgeProps) {
  // Determine color and intensity based on streak length
  const getTier = () => {
    if (days >= 365) return { color: "text-brand-blue", bg: "bg-brand-blue/10", border: "border-brand-blue/30", label: "Legendary" };
    if (days >= 90) return { color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/30", label: "Ancient" };
    if (days >= 30) return { color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30", label: "Elite" };
    if (days >= 7) return { color: "text-orange-400", bg: "bg-orange-400/5", border: "border-orange-400/20", label: "Building" };
    return { color: "text-slate-500", bg: "bg-white/5", border: "border-white/10", label: "Beginner" };
  };

  const tier = getTier();

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all duration-500 group",
      tier.bg,
      tier.border,
      className
    )}>
      <Flame className={cn(
        "w-3.5 h-3.5 transition-transform group-hover:scale-125",
        tier.color,
        days >= 7 && "animate-pulse"
      )} />
      <span className={cn("text-xs font-black tracking-tight", tier.color)}>
        {days}D
      </span>
    </div>
  );
}
