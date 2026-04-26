"use client";

import React, { useEffect, useState } from "react";
import { Users, Globe, IndianRupee, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const STATS = [
  {
    text: "Join 20,432 people who've quit smoking on Unshackled.",
    icon: Users,
    color: "text-brand-blue"
  },
  {
    text: "Together we've saved over ₹1.2 crore this month.",
    icon: IndianRupee,
    color: "text-emerald-400"
  },
  {
    text: "Average user lung capacity improves by 30% in 90 days.",
    icon: Heart,
    color: "text-rose-400"
  },
  {
    text: "Global community: Warriors from 45 countries are active right now.",
    icon: Globe,
    color: "text-indigo-400"
  }
];

export default function GlobalStatsBar() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % STATS.length);
        setFade(true);
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const ActiveStat = STATS[index];

  return (
    <div className="w-full bg-white/5 border-t border-white/5 py-3 flex items-center justify-center px-6 overflow-hidden">
      <div className={cn(
        "flex items-center gap-3 transition-all duration-500",
        fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}>
        <ActiveStat.icon className={cn("w-4 h-4", ActiveStat.color)} />
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">
          {ActiveStat.text}
        </p>
      </div>
    </div>
  );
}
