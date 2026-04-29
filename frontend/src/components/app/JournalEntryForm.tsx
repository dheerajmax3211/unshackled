"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Smile, Frown, Meh, ThumbsUp, Send, Plus, X, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";

interface JournalEntryFormProps {
  onSubmit?: (data: {
    date: string;
    content: string;
    moodScore: number;
    moodEmoji: string;
    triggers: string[];
    whatHelped: string;
    share: boolean;
  }) => void;
  className?: string;
}

const moodEmojis = [
  { emoji: "😊", label: "Happy", icon: Smile },
  { emoji: "💪", label: "Strong", icon: ThumbsUp },
  { emoji: "😐", label: "Neutral", icon: Meh },
  { emoji: "😔", label: "Down", icon: Frown },
  { emoji: "😤", label: "Frustrated", icon: Frown },
];

export function JournalEntryForm({ onSubmit, className }: JournalEntryFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [content, setContent] = useState("");
  const [moodScore, setMoodScore] = useState(7);
  const [moodEmoji, setMoodEmoji] = useState("😊");
  const [triggerInput, setTriggerInput] = useState("");
  const [triggers, setTriggers] = useState<string[]>([]);
  const [whatHelped, setWhatHelped] = useState("");
  const [share, setShare] = useState(false);

  const handleAddTrigger = () => {
    const trimmed = triggerInput.trim();
    if (trimmed && !triggers.includes(trimmed)) {
      setTriggers((prev) => [...prev, trimmed]);
      setTriggerInput("");
    }
  };

  const handleRemoveTrigger = (trigger: string) => {
    setTriggers((prev) => prev.filter((t) => t !== trigger));
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit?.({
      date,
      content: content.trim(),
      moodScore,
      moodEmoji,
      triggers,
      whatHelped: whatHelped.trim(),
      share,
    });
  };

  const canSubmit = content.trim().length > 0;

  return (
    <GlassCard padding="lg" className={cn(className)}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-amber/15 border border-brand-amber/30 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-brand-amber" />
          </div>
          <h3 className="text-heading-sm text-text-primary">Journal Entry</h3>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-caption text-text-muted font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-glass-sm px-4 py-2.5 text-body-sm text-text-primary focus:outline-none focus:border-brand-amber/30 transition-colors [color-scheme:dark]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-caption text-text-muted font-medium">Mood</label>
            <div className="flex items-center gap-2 flex-wrap">
              {moodEmojis.map((item) => (
                <motion.button
                  key={item.emoji}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMoodEmoji(item.emoji)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2.5 rounded-glass-sm border transition-all min-w-[56px]",
                    moodEmoji === item.emoji
                      ? "bg-brand-amber/15 border-brand-amber/30"
                      : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]"
                  )}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-[10px] text-text-muted">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-caption text-text-muted font-medium">Mood Score</label>
              <span
                className={cn(
                  "text-body-sm font-semibold tabular-nums",
                  moodScore >= 8
                    ? "text-brand-green-light"
                    : moodScore >= 5
                    ? "text-brand-amber-light"
                    : "text-brand-rose-light"
                )}
              >
                {moodScore}/10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={moodScore}
              onChange={(e) => setMoodScore(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none bg-gradient-to-r from-brand-rose via-brand-amber to-brand-green cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-amber [&::-webkit-slider-thumb]:cursor-pointer
                [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-brand-amber [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-caption text-text-muted font-medium">Entry</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What happened today? How are you feeling?"
              rows={4}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-glass-sm p-4 text-body-sm text-text-primary placeholder:text-text-subtle resize-none focus:outline-none focus:border-brand-amber/30 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-caption text-text-muted font-medium">Triggers</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={triggerInput}
                onChange={(e) => setTriggerInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTrigger();
                  }
                }}
                placeholder="Add a trigger..."
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-glass-sm px-4 py-2.5 text-body-sm text-text-primary placeholder:text-text-subtle focus:outline-none focus:border-brand-amber/30 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddTrigger}
                className="flex items-center justify-center w-10 h-10 rounded-glass-sm bg-white/[0.04] border border-white/[0.08] hover:border-brand-amber/20 text-text-muted hover:text-brand-amber transition-colors"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
            {triggers.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {triggers.map((trigger) => (
                  <span
                    key={trigger}
                    className="inline-flex items-center gap-1 text-caption px-2.5 py-1 rounded-full bg-brand-rose/10 border border-brand-rose/20 text-brand-rose-light"
                  >
                    {trigger}
                    <button onClick={() => handleRemoveTrigger(trigger)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-caption text-text-muted font-medium">What Helped</label>
            <input
              type="text"
              value={whatHelped}
              onChange={(e) => setWhatHelped(e.target.value)}
              placeholder="e.g., walking, deep breathing, calling a friend"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-glass-sm px-4 py-2.5 text-body-sm text-text-primary placeholder:text-text-subtle focus:outline-none focus:border-brand-amber/30 transition-colors"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShare(!share)}
              className={cn(
                "flex items-center gap-2 text-caption font-medium transition-colors",
                share ? "text-brand-green-light" : "text-text-muted"
              )}
            >
              <Share2 className="w-3.5 h-3.5" />
              Share with community
            </button>
          </div>

          <motion.button
            whileHover={canSubmit ? { scale: 1.02 } : undefined}
            whileTap={canSubmit ? { scale: 0.98 } : undefined}
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              "flex items-center justify-center gap-2 w-full py-3 rounded-glass-sm font-semibold transition-all",
              canSubmit
                ? "bg-brand-amber hover:bg-brand-amber/90 text-surface-darkest"
                : "bg-white/[0.04] text-text-subtle cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
            Save Entry
          </motion.button>
        </div>
      </div>
    </GlassCard>
  );
}
