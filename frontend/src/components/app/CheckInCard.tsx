"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";

type Mood = "PROUD" | "NEUTRAL" | "REGRETFUL" | "GRATEFUL";

interface CheckInCardProps {
  className?: string;
  onCheckIn?: (status: "clean" | "slipped", mood: Mood | null, note: string) => void;
  xpEarned?: number;
  showXpAnimation?: boolean;
}

const moodOptions: { value: Mood; emoji: string; label: string }[] = [
  { value: "PROUD", emoji: "💪", label: "Proud" },
  { value: "NEUTRAL", emoji: "😐", label: "Neutral" },
  { value: "REGRETFUL", emoji: "😔", label: "Regretful" },
  { value: "GRATEFUL", emoji: "🙏", label: "Grateful" },
];

export function CheckInCard({
  className,
  onCheckIn,
  xpEarned = 15,
  showXpAnimation = false,
}: CheckInCardProps) {
  const [status, setStatus] = useState<"clean" | "slipped" | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showXp, setShowXp] = useState(false);

  const handleSubmit = () => {
    if (!status || !mood) return;
    onCheckIn?.(status, mood, note);
    if (showXpAnimation) {
      setShowXp(true);
      setTimeout(() => {
        setShowXp(false);
        setSubmitted(true);
      }, 2500);
    } else {
      setSubmitted(true);
    }
  };

  const canSubmit = status && mood;

  return (
    <GlassCard padding="lg" className={cn(className)}>
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="submitted"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 py-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-full bg-brand-green/20 border border-brand-green/30 flex items-center justify-center"
            >
              <CheckCircle className="w-8 h-8 text-brand-green" />
            </motion.div>
            <h3 className="text-heading-sm text-text-primary">Check-in complete</h3>
            <p className="text-body-sm text-text-muted">We&apos;ll see you tomorrow. One day at a time.</p>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-body-sm text-text-muted text-center">How did today go?</p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStatus("clean")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-3 py-4 rounded-glass-sm border transition-all duration-300",
                    status === "clean"
                      ? "bg-brand-green/15 border-brand-green/40 text-brand-green-light"
                      : "bg-white/[0.03] border-white/[0.08] text-text-secondary hover:border-white/[0.15]"
                  )}
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-body-md font-semibold">I stayed clean</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStatus("slipped")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-3 py-4 rounded-glass-sm border transition-all duration-300",
                    status === "slipped"
                      ? "bg-brand-rose/15 border-brand-rose/40 text-brand-rose-light"
                      : "bg-white/[0.03] border-white/[0.08] text-text-secondary hover:border-white/[0.15]"
                  )}
                >
                  <XCircle className="w-5 h-5" />
                  <span className="text-body-md font-semibold">I slipped</span>
                </motion.button>
              </div>
            </div>

            <AnimatePresence>
              {status === "slipped" && (
                <motion.div
                  initial={{ opacity: 0, y: 8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-brand-rose/10 border border-brand-rose/20 rounded-glass-sm p-4 text-center">
                    <p className="text-body-sm text-brand-rose-light font-medium">
                      Relapses are part of the journey. Every slip teaches us something. What happened?
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex flex-col gap-3"
                >
                  <p className="text-body-sm text-text-muted text-center">How are you feeling?</p>
                  <div className="flex justify-center gap-2">
                    {moodOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setMood(option.value)}
                        className={cn(
                          "flex flex-col items-center gap-1 p-3 rounded-glass-sm border transition-all duration-300 min-w-[72px]",
                          mood === option.value
                            ? "bg-brand-amber/15 border-brand-amber/40"
                            : "bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12]"
                        )}
                      >
                        <span className="text-2xl">{option.emoji}</span>
                        <span className="text-caption text-text-muted">{option.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {status && mood && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-2"
                >
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note (optional)..."
                    rows={2}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-glass-sm p-3 text-body-sm text-text-primary placeholder:text-text-subtle resize-none focus:outline-none focus:border-brand-amber/30 transition-colors"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {canSubmit && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-glass-sm bg-brand-amber hover:bg-brand-amber/90 text-surface-darkest font-semibold transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Submit Check-in
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showXp && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-surface-darker/80 backdrop-blur-glass rounded-glass"
          >
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.6, repeat: 2 }}
              >
                <Sparkles className="w-12 h-12 text-brand-amber" />
              </motion.div>
              <span className="text-display-sm text-gradient-amber font-bold">+{xpEarned} XP</span>
              <span className="text-body-sm text-text-muted">Great work today!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
