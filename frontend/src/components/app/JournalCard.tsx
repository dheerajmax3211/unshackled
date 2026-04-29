"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";

interface JournalEntry {
  id: string;
  entryDate: string;
  content: string;
  moodScore: number;
  moodEmoji: string;
  triggers: string[];
  whatHelped: string;
}

interface JournalCardProps {
  entry: JournalEntry;
  className?: string;
}

function getMoodColor(score: number): string {
  if (score >= 8) return "text-brand-green-light bg-brand-green/10 border-brand-green/20";
  if (score >= 5) return "text-brand-amber-light bg-brand-amber/10 border-brand-amber/20";
  return "text-brand-rose-light bg-brand-rose/10 border-brand-rose/20";
}

function getMoodLabel(score: number): string {
  if (score >= 8) return "Great";
  if (score >= 5) return "Okay";
  return "Tough";
}

export function JournalCard({ entry, className }: JournalCardProps) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(entry.entryDate);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const moodColor = getMoodColor(entry.moodScore);

  return (
    <GlassCard padding="md" className={cn(className)}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{entry.moodEmoji}</span>
            <div>
              <h4 className="text-body-md font-semibold text-text-primary">{formattedDate}</h4>
              <div className="flex items-center gap-2">
                <span className={cn("text-caption px-2 py-0.5 rounded-full border", moodColor)}>
                  {getMoodLabel(entry.moodScore)}
                </span>
                <span className="text-caption text-text-muted">{entry.moodScore}/10</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-full hover:bg-white/[0.04] transition-colors"
          >
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-4 h-4 text-text-muted" />
            </motion.div>
          </button>
        </div>

        <p className="text-body-sm text-text-secondary leading-relaxed line-clamp-2">
          {entry.content}
        </p>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden flex flex-col gap-4"
            >
              <p className="text-body-sm text-text-secondary leading-relaxed">{entry.content}</p>

              {entry.triggers.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-caption text-text-subtle uppercase tracking-wider">Triggers</span>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.triggers.map((trigger) => (
                      <span
                        key={trigger}
                        className="text-caption px-2.5 py-0.5 rounded-full bg-brand-rose/10 border border-brand-rose/20 text-brand-rose-light"
                      >
                        <Tag className="w-3 h-3 inline mr-1" />
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {entry.whatHelped && (
                <div className="flex flex-col gap-2">
                  <span className="text-caption text-text-subtle uppercase tracking-wider">What Helped</span>
                  <span className="text-caption px-2.5 py-0.5 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green-light w-fit">
                    {entry.whatHelped}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden mt-1">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-rose via-brand-amber to-brand-green"
            initial={{ width: 0 }}
            animate={{ width: `${(entry.moodScore / 10) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </GlassCard>
  );
}
