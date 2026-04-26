"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform, animate } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCardProps {
  habitName: string;
  streakDays: number;
  habitColor?: string;
  className?: string;
}

export default function StreakCard({
  habitName,
  streakDays,
  habitColor = "amber",
  className,
}: StreakCardProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(0, streakDays, {
      duration: 2,
      ease: "easeOut",
      onUpdate(value) {
        setCount(Math.floor(value));
      },
    });
    return () => controls.stop();
  }, [streakDays]);

  const colorClasses: Record<string, string> = {
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-amber-500/10",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-rose-500/10",
    blue: "text-brand-blue bg-brand-blue/10 border-brand-blue/20 shadow-brand-blue/10",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10",
  };

  const selectedColor = colorClasses[habitColor] || colorClasses.amber;

  return (
    <Card className={cn(
      "relative overflow-hidden p-8 flex flex-col items-center justify-center border-2 transition-all duration-500",
      selectedColor,
      "shadow-[0_0_40px_rgba(0,0,0,0.1)] hover:shadow-[0_0_60px_rgba(0,0,0,0.2)]",
      className
    )}>
      {/* Background Decorative Icon */}
      <Flame className="absolute -right-4 -bottom-4 w-32 h-32 opacity-5 rotate-12" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <Flame className={cn("w-5 h-5", habitColor === "amber" ? "text-amber-400" : selectedColor.split(" ")[0])} />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">Clean Streak</span>
        </div>
        
        <div className="flex items-baseline gap-2">
          <span className="text-7xl md:text-8xl font-display font-black tracking-tighter">
            {count}
          </span>
          <span className="text-2xl font-bold opacity-40">Days</span>
        </div>

        <p className="mt-4 text-sm font-bold opacity-80 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 capitalize">
          {habitName}
        </p>
      </div>

      {/* Animated Glow Overlay */}
      <motion.div 
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1] 
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-transparent via-transparent opacity-20 pointer-events-none",
          habitColor === "amber" ? "to-amber-500" : 
          habitColor === "rose" ? "to-rose-500" :
          habitColor === "blue" ? "to-brand-blue" : "to-emerald-500"
        )}
      />
    </Card>
  );
}
