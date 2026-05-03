"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Flame, Trophy, Zap } from "lucide-react";
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
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;
    const duration = 2500;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * currentStreak));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, currentStreak]);

  const isMilestone = currentStreak === 7 || currentStreak === 30 || currentStreak === 90 || currentStreak === 365;

  return (
    <GlassCard
      padding="lg"
      className={cn(
        "relative overflow-hidden glow-ring",
        isMilestone && "gradient-border",
        className
      )}
    >
      {/* Atmospheric background orb */}
      <motion.div
        className="absolute -top-24 -right-24 w-72 h-72 bg-brand-amber/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />



      <div ref={ref} className="relative flex flex-col items-center gap-5">
        {/* Icon and habit name */}
        <motion.div
          className="flex items-center gap-2 text-body-sm text-text-muted"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="text-3xl"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {habitIcon}
          </motion.span>
          <span className="font-medium">{habitName}</span>
        </motion.div>

        {/* Main streak display */}
        <div className="flex flex-col items-center relative">
          {/* Glow behind number */}
          <motion.div
            className="absolute inset-0 bg-brand-amber/20 rounded-full blur-2xl"
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          />

          <motion.span
            className="text-display-xl md:text-display-2xl text-gradient-amber font-bold tabular-nums leading-none relative"
            initial={{ opacity: 0, scale: 0.3, filter: "blur(20px)" }}
            animate={inView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            {count}
          </motion.span>

          <motion.span
            className="text-body-lg text-text-muted mt-3 relative"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            days free
          </motion.span>

          {/* Milestone badge */}
          {isMilestone && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
              className="absolute -top-2 -right-16"
            >
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-brand-amber/20 border border-brand-amber/30">
                <Trophy className="w-3 h-3 text-brand-amber" />
                <span className="text-caption text-brand-amber font-medium">Milestone!</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Longest streak info */}
        <motion.div
          className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/[0.04] border border-white/[0.08] relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />

          <div className="flex items-center gap-2 relative">
            <Flame className="w-4 h-4 text-brand-amber" />
            <span className="text-body-sm text-text-muted">Longest streak</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-body-sm text-text-primary font-semibold tabular-nums relative flex items-center gap-1">
            <Zap className="w-3 h-3 text-brand-blue" />
            {longestStreak} days
          </span>
        </motion.div>

        {/* Progress indicator to next milestone */}
        {currentStreak < 365 && (
          <motion.div
            className="w-full max-w-xs relative"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="flex justify-between text-caption text-text-subtle mb-1">
              <span>Progress</span>
              <span className="text-brand-amber">
                {Math.round((currentStreak / getNextMilestone(currentStreak)) * 100)}%
              </span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-amber to-brand-amber-light rounded-full"
                initial={{ width: 0 }}
                animate={inView ? { width: `${(currentStreak / getNextMilestone(currentStreak)) * 100}%` } : {}}
                transition={{ duration: 1.5, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <div className="text-caption text-text-subtle text-center mt-1">
              {getNextMilestone(currentStreak) - currentStreak} days to next milestone
            </div>
          </motion.div>
        )}
      </div>
    </GlassCard>
  );
}

function getNextMilestone(streak: number): number {
  if (streak < 7) return 7;
  if (streak < 30) return 30;
  if (streak < 90) return 90;
  if (streak < 365) return 365;
  return 365;
}
