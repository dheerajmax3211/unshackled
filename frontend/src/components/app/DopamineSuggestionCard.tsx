"use client";

import { motion } from "framer-motion";
import { Sparkles, Dumbbell, Users, Palette, Brain, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";

type Category = "physical" | "social" | "creative" | "mindfulness";
type Difficulty = "easy" | "medium" | "hard";

interface DopamineSuggestionCardProps {
  suggestion: string;
  category: Category;
  difficulty: Difficulty;
  onTry?: () => void;
  tried?: boolean;
  className?: string;
}

const categoryConfig: Record<
  Category,
  { icon: React.ElementType; label: string; color: string; bg: string; border: string }
> = {
  physical: {
    icon: Dumbbell,
    label: "Physical",
    color: "text-brand-green-light",
    bg: "bg-brand-green/10",
    border: "border-brand-green/20",
  },
  social: {
    icon: Users,
    label: "Social",
    color: "text-brand-blue-light",
    bg: "bg-brand-blue/10",
    border: "border-brand-blue/20",
  },
  creative: {
    icon: Palette,
    label: "Creative",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  mindfulness: {
    icon: Brain,
    label: "Mindfulness",
    color: "text-brand-amber-light",
    bg: "bg-brand-amber/10",
    border: "border-brand-amber/20",
  },
};

const difficultyColors: Record<Difficulty, string> = {
  easy: "bg-brand-green/15 text-brand-green-light border-brand-green/20",
  medium: "bg-brand-amber/15 text-brand-amber-light border-brand-amber/20",
  hard: "bg-brand-rose/15 text-brand-rose-light border-brand-rose/20",
};

export function DopamineSuggestionCard({
  suggestion,
  category,
  difficulty,
  onTry,
  tried = false,
  className,
}: DopamineSuggestionCardProps) {
  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <GlassCard
        padding="md"
        className={cn(
          "flex flex-col gap-4 transition-all",
          tried && "opacity-80",
          className
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", config.bg, config.border)}>
              <Icon className={cn("w-5 h-5", config.color)} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={cn("text-caption font-semibold px-2 py-0.5 rounded-full border", config.bg, config.border, config.color)}>
                  {config.label}
                </span>
                <span className={cn("text-caption px-2 py-0.5 rounded-full border", difficultyColors[difficulty])}>
                  {difficulty}
                </span>
              </div>
            </div>
          </div>
          {tried && (
            <CheckCircle className="w-5 h-5 text-brand-green flex-shrink-0" />
          )}
        </div>

        <p className="text-body-sm text-text-secondary leading-relaxed">{suggestion}</p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onTry}
          disabled={tried}
          className={cn(
            "flex items-center justify-center gap-2 w-full py-2.5 rounded-glass-sm font-semibold text-body-sm transition-all",
            tried
              ? "bg-white/[0.04] text-text-subtle cursor-not-allowed"
              : "bg-brand-green hover:bg-brand-green/90 text-surface-darkest"
          )}
        >
          <Sparkles className="w-4 h-4" />
          {tried ? "Completed" : "Try this"}
        </motion.button>
      </GlassCard>
    </motion.div>
  );
}
