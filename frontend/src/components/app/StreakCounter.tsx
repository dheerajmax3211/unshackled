"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  habitName: string;
  habitIcon: string;
  className?: string;
}

export function StreakCounter({
  currentStreak,
  longestStreak,
  habitName,
  habitIcon,
  className,
}: StreakCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * currentStreak));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, currentStreak]);

  return (
    <GlassCard glow="amber" padding="lg" className={cn("relative overflow-hidden", className)}>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-amber/5 rounded-full blur-3xl" />
      <div ref={ref} className="relative flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-body-sm text-text-muted">
          <span className="text-2xl">{habitIcon}</span>
          <span>{habitName}</span>
        </div>

        <div className="flex flex-col items-center">
          <motion.span
            className="text-display-xl text-gradient-amber font-bold tabular-nums leading-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {count}
          </motion.span>
          <motion.span
            className="text-body-lg text-text-muted mt-2"
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            days free
          </motion.span>
        </div>

        <motion.div
          className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.06]"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Flame className="w-4 h-4 text-brand-amber" />
          <span className="text-body-sm text-text-muted">Longest streak</span>
          <span className="text-body-sm text-text-primary font-semibold tabular-nums">
            {longestStreak} days
          </span>
        </motion.div>
      </div>
    </GlassCard>
  );
}
