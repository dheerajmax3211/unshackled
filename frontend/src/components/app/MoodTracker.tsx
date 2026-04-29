"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";

interface MoodEntry {
  date: string;
  moodScore: number;
  moodEmoji: string;
}

interface MoodTrackerProps {
  entries: MoodEntry[];
  className?: string;
}

function getBarColor(score: number): string {
  if (score >= 8) return "bg-brand-green";
  if (score >= 5) return "bg-brand-amber";
  return "bg-brand-rose";
}

function getAverageMood(entries: MoodEntry[]): { score: number; emoji: string; label: string } {
  if (entries.length === 0) return { score: 0, emoji: "😐", label: "No data" };
  const avg = entries.reduce((sum, e) => sum + e.moodScore, 0) / entries.length;
  const rounded = Math.round(avg);
  const emoji =
    rounded >= 8 ? "😊" : rounded >= 5 ? "😐" : "😔";
  const label = rounded >= 8 ? "Positive trend" : rounded >= 5 ? "Steady" : "Challenging period";
  return { score: avg, emoji, label };
}

export function MoodTracker({ entries, className }: MoodTrackerProps) {
  const average = getAverageMood(entries);
  const recent = entries.slice(-7);
  const maxScore = 10;

  return (
    <GlassCard padding="lg" className={cn(className)}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-amber/15 border border-brand-amber/30 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-brand-amber" />
          </div>
          <div>
            <h3 className="text-heading-sm text-text-primary">Mood Tracker</h3>
            <p className="text-caption text-text-muted">Last 7 days</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-glass-sm">
          <span className="text-3xl">{average.emoji}</span>
          <div>
            <p className="text-body-sm text-text-secondary">{average.label}</p>
            <p className="text-caption text-text-muted">
              Average mood: {average.score.toFixed(1)}/10
            </p>
          </div>
        </div>

        {recent.length > 0 ? (
          <div className="flex items-end gap-2 h-32">
            {recent.map((entry, index) => {
              const heightPercent = (entry.moodScore / maxScore) * 100;
              const dateLabel = new Date(entry.date).toLocaleDateString("en-US", {
                weekday: "short",
              });

              return (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 flex flex-col items-center justify-end gap-1 min-w-0"
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.08 + 0.3 }}
                    className="text-lg"
                  >
                    {entry.moodEmoji}
                  </motion.span>
                  <div
                    className={cn(
                      "w-full rounded-t-md transition-all",
                      getBarColor(entry.moodScore)
                    )}
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] text-text-subtle mt-1 truncate w-full text-center">
                    {dateLabel}
                  </span>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="text-4xl mb-3">📊</span>
            <p className="text-body-sm text-text-muted">No mood data yet</p>
            <p className="text-caption text-text-subtle">
              Start journaling to track your mood patterns.
            </p>
          </div>
        )}

        <div className="flex justify-between text-caption text-text-muted">
          <span>1-3: Tough</span>
          <span>4-7: Okay</span>
          <span>8-10: Great</span>
        </div>
      </div>
    </GlassCard>
  );
}
