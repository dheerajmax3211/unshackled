"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Send, Sparkles, Heart, Sun, CloudRain, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";

type Mood = "PROUD" | "NEUTRAL" | "REGRETFUL" | "GRATEFUL";

interface CheckInCardProps {
  className?: string;
  onCheckIn?: (status: "clean" | "slipped", mood: Mood | null, note: string) => void;
  xpEarned?: number;
  showXpAnimation?: boolean;
}

const moodOptions: { value: Mood; emoji: string; label: string; icon: React.ReactNode; color: string }[] = [
  { value: "PROUD", emoji: "💪", label: "Proud", icon: <Star className="w-5 h-5" />, color: "amber" },
  { value: "NEUTRAL", emoji: "😐", label: "Neutral", icon: <Sun className="w-5 h-5" />, color: "blue" },
  { value: "REGRETFUL", emoji: "😔", label: "Regretful", icon: <CloudRain className="w-5 h-5" />, color: "rose" },
  { value: "GRATEFUL", emoji: "🙏", label: "Grateful", icon: <Heart className="w-5 h-5" />, color: "green" },
];

const moodColors: Record<string, { bg: string; border: string; text: string; light: string }> = {
  amber: { bg: "bg-brand-amber", border: "border-brand-amber", text: "text-brand-amber", light: "text-brand-amber-light" },
  blue: { bg: "bg-brand-blue", border: "border-brand-blue", text: "text-brand-blue", light: "text-brand-blue-light" },
  rose: { bg: "bg-brand-rose", border: "border-brand-rose", text: "text-brand-rose", light: "text-brand-rose-light" },
  green: { bg: "bg-brand-green", border: "border-brand-green", text: "text-brand-green", light: "text-brand-green-light" },
};

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
    <GlassCard padding="lg" className={cn("relative overflow-hidden", className)}>
      {/* Background glow effect */}
      <motion.div
        className={cn(
          "absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl transition-colors duration-500",
          status === "clean" && "bg-brand-green/15",
          status === "slipped" && "bg-brand-rose/15",
          !status && "bg-brand-amber/10"
        )}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />



      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="submitted"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-5 py-6 relative"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-brand-green/20 border-2 border-brand-green/40 flex items-center justify-center relative"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-brand-green/30"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <CheckCircle className="w-10 h-10 text-brand-green relative" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center"
            >
              <h3 className="text-heading-md text-text-primary mb-1">Check-in complete</h3>
              <p className="text-body-sm text-text-muted">We&apos;ll see you tomorrow. One day at a time.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-green/10 border border-brand-green/20"
            >
              <Sparkles className="w-4 h-4 text-brand-green" />
              <span className="text-body-sm text-brand-green-light font-medium">+{xpEarned} XP earned</span>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 relative">
            <div className="flex flex-col gap-3">
              <p className="text-body-md text-text-secondary text-center font-medium">How did today go?</p>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStatus("clean")}
                  className={cn(
                    "relative flex items-center justify-center gap-3 py-5 rounded-xl border transition-all duration-300 overflow-hidden",
                    status === "clean"
                      ? "bg-brand-green/20 border-brand-green/50 text-brand-green-light"
                      : "bg-white/[0.03] border-white/[0.08] text-text-secondary hover:border-white/[0.15]"
                  )}
                >
                  {/* Background glow for selected state */}
                  {status === "clean" && (
                    <motion.div
                      className="absolute inset-0 bg-brand-green/10"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-body-md font-semibold">I stayed clean</span>
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStatus("slipped")}
                  className={cn(
                    "relative flex items-center justify-center gap-3 py-5 rounded-xl border transition-all duration-300 overflow-hidden",
                    status === "slipped"
                      ? "bg-brand-rose/20 border-brand-rose/50 text-brand-rose-light"
                      : "bg-white/[0.03] border-white/[0.08] text-text-secondary hover:border-white/[0.15]"
                  )}
                >
                  {status === "slipped" && (
                    <motion.div
                      className="absolute inset-0 bg-brand-rose/10"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    <span className="text-body-md font-semibold">I slipped</span>
                  </span>
                </motion.button>
              </div>
            </div>

            <AnimatePresence>
              {status === "slipped" && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="relative p-4 rounded-xl bg-brand-rose/10 border border-brand-rose/20 text-center overflow-hidden">
                    {/* Animated background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-brand-rose/5 via-brand-rose/10 to-brand-rose/5"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-body-sm text-brand-rose-light font-medium relative">
                      Relapses are part of the journey. Every slip teaches us something. What happened?
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-3"
                >
                  <p className="text-body-md text-text-secondary text-center font-medium">How are you feeling?</p>
                  <div className="grid grid-cols-4 gap-2">
                    {moodOptions.map((option, index) => {
                      const colors = moodColors[option.color];
                      const isSelected = mood === option.value;
                      return (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.08, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setMood(option.value)}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={cn(
                            "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-300 relative overflow-hidden",
                            isSelected
                              ? `${colors.bg}/20 ${colors.border}/50 ${colors.text}`
                              : "bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] text-text-secondary"
                          )}
                        >
                          {isSelected && (
                            <motion.div
                              className={cn("absolute inset-0 opacity-20", colors.bg)}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                          <span className="relative">{option.icon}</span>
                          <span className={cn("text-caption font-medium relative", isSelected && colors.light)}>
                            {option.label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {status && mood && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-2"
                >
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note (optional)..."
                    rows={2}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 text-body-sm text-text-primary placeholder:text-text-subtle resize-none focus:outline-none focus:border-brand-amber/30 transition-colors"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {canSubmit && (
                <motion.button
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  className="relative flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-brand-amber hover:bg-brand-amber/90 text-surface-darkest font-semibold transition-all overflow-hidden group"
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <Send className="w-4 h-4 relative group-hover:translate-x-0.5 transition-transform" />
                  <span className="relative">Submit Check-in</span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showXp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-surface-darker/90 backdrop-blur-xl rounded-glass z-20"
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: 3 }}
              >
                <Sparkles className="w-14 h-14 text-brand-amber" />
              </motion.div>
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-display-sm text-gradient-amber font-bold"
              >
                +{xpEarned} XP
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-body-sm text-text-muted"
              >
                Great work today!
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
