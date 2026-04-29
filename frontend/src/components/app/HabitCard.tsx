"use client";

import { motion } from "framer-motion";
import { Flame, ArrowRight, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";
import { Progress } from "@/components/ui/progress";

interface HabitCardProps {
  habitName: string;
  habitIcon: string;
  currentStreak: number;
  isActive: boolean;
  onClick?: () => void;
  onCheckIn?: () => void;
  className?: string;
}

export function HabitCard({
  habitName,
  habitIcon,
  currentStreak,
  isActive,
  onClick,
  onCheckIn,
  className,
}: HabitCardProps) {
  const streakProgress = Math.min((currentStreak / 90) * 100, 100);

  return (
    <motion.div
      whileHover={isActive ? { scale: 1.02, y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <GlassCard
        padding="md"
        onClick={onClick}
        className={cn(
          "flex flex-col gap-4 transition-all",
          !isActive && "opacity-60 hover:opacity-80",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
              isActive
                ? "bg-brand-amber/10 border border-brand-amber/20"
                : "bg-white/[0.03] border border-white/[0.06]"
            )}
          >
            {habitIcon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-body-md font-semibold text-text-primary truncate">
              {habitName}
            </h4>
            <div className="flex items-center gap-2 text-caption text-text-muted">
              <Flame className="w-3.5 h-3.5" />
              <span>{currentStreak} day streak</span>
            </div>
          </div>
          {!isActive && (
            <div className="flex items-center gap-1 text-caption text-text-subtle">
              <Pause className="w-3.5 h-3.5" />
              Paused
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-caption text-text-muted">
            <span>Progress to 90 days</span>
            <span>{Math.round(streakProgress)}%</span>
          </div>
          <Progress
            value={streakProgress}
            className={cn("h-1.5", isActive ? "[&>div]:bg-brand-amber" : "[&>div]:bg-text-subtle")}
          />
        </div>

        {isActive && (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                onCheckIn?.();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-glass-sm bg-brand-amber hover:bg-brand-amber/90 text-surface-darkest font-semibold text-body-sm transition-colors"
            >
              <Flame className="w-4 h-4" />
              Check in
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-glass-sm border border-white/[0.08] hover:border-white/[0.15] text-body-sm text-text-secondary transition-colors"
            >
              Details
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
