"use client";

import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Shield, Award, Sparkles } from "lucide-react";
import { animate, motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface XPBarProps {
  currentLevel: number;
  levelName: string;
  currentXp: number;
  nextLevelXp: number;
}

export default function XPBar({ currentLevel, levelName, currentXp, nextLevelXp }: XPBarProps) {
  const [displayXp, setDisplayXp] = useState(0);
  const progress = (currentXp / nextLevelXp) * 100;

  useEffect(() => {
    const controls = animate(0, currentXp, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setDisplayXp(Math.floor(v))
    });
    return () => controls.stop();
  }, [currentXp]);

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between px-1">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-brand-blue" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Warrior Rank</span>
          </div>
          <h4 className="text-xl font-display font-black text-white flex items-center gap-2">
            Lvl {currentLevel} <span className="text-brand-blue">{levelName}</span>
          </h4>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Experience</p>
          <p className="text-sm font-bold text-white">
            {displayXp} <span className="text-slate-500">/ {nextLevelXp} XP</span>
          </p>
        </div>
      </div>

      <div className="relative group">
        <Progress 
          value={progress} 
          className="h-3 bg-white/5 border border-white/5 overflow-hidden rounded-full"
        />
        
        {/* Animated Glow on Progress */}
        <motion.div 
          initial={{ left: "-100%" }}
          animate={{ left: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 bottom-0 w-1/4 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
        />
      </div>

      <div className="flex items-center gap-2 justify-center pt-1">
        <Sparkles className="w-3 h-3 text-brand-blue animate-pulse" />
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          {nextLevelXp - currentXp} XP to reach the next rank
        </p>
      </div>
    </div>
  );
}
