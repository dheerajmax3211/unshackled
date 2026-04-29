"use client";

import { motion } from "framer-motion";
import { Brain, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";

interface WithdrawalMessage {
  dayOffset: number;
  message: string;
  tone?: "empathetic" | "encouraging" | "informational";
}

interface WithdrawalCardProps {
  message: WithdrawalMessage;
  currentDay: number;
  className?: string;
}

export function WithdrawalCard({
  message,
  currentDay,
  className,
}: WithdrawalCardProps) {
  const isCurrentDay = message.dayOffset <= currentDay;

  return (
    <GlassCard glow="rose" padding="lg" className={cn("relative overflow-hidden", className)}>
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-brand-rose/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-brand-amber/5 rounded-full blur-2xl" />

      <div className="relative flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-full bg-brand-rose/15 border border-brand-rose/30 flex items-center justify-center"
            animate={{ boxShadow: ["0 0 20px rgba(244,63,94,0.1)", "0 0 30px rgba(244,63,94,0.05)", "0 0 20px rgba(244,63,94,0.1)"] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Brain className="w-5 h-5 text-brand-rose-light" />
          </motion.div>
          <div>
            <h3 className="text-heading-sm text-text-primary">Day {message.dayOffset}</h3>
            <p className="text-caption text-text-muted">
              {message.tone === "empathetic" ? "You're not alone" : "Stay the course"}
            </p>
          </div>
        </div>

        <div className="relative pl-5 border-l-2 border-brand-rose/20">
          <Heart className="absolute -left-[9px] top-0 w-4 h-4 text-brand-rose/40" />
          <p className="text-body-md text-text-secondary leading-relaxed italic">
            &ldquo;{message.message}&rdquo;
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 px-4 py-3 bg-brand-rose/5 border border-brand-rose/10 rounded-glass-sm"
        >
          <span className="text-caption text-brand-rose-light font-semibold uppercase tracking-wider">
            This is withdrawal, not weakness
          </span>
        </motion.div>

        <p className="text-body-sm text-text-muted">
          Your brain is healing. Every uncomfortable moment is proof that your neurochemistry is
          recalibrating. This is your body reclaiming itself.
        </p>
      </div>
    </GlassCard>
  );
}
