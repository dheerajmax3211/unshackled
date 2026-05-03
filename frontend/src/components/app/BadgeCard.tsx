"use client";

import { motion } from "framer-motion";
import { Lock, Star, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";

type Rarity = "common" | "rare" | "epic" | "legendary";

interface BadgeData {
  slug: string;
  name: string;
  description: string;
  rarity: Rarity;
}

interface BadgeCardProps {
  badge: BadgeData;
  earned: boolean;
  className?: string;
}

const rarityConfig: Record<
  Rarity,
  { border: string; glow: string; hoverState: string; icon: string; bg: string; textColor: string }
> = {
  common: {
    border: "border-slate-400/30",
    glow: "shadow-[0_0_25px_rgba(148,163,184,0.2)]",
    hoverState: "hover:bg-slate-400/[0.15] hover:border-slate-400/50",
    icon: "text-slate-400",
    bg: "bg-slate-400/10",
    textColor: "text-slate-400",
  },
  rare: {
    border: "border-brand-blue/30",
    glow: "shadow-[0_0_25px_rgba(59,130,246,0.3)]",
    hoverState: "hover:bg-brand-blue/[0.15] hover:border-brand-blue/50",
    icon: "text-brand-blue-light",
    bg: "bg-brand-blue/10",
    textColor: "text-brand-blue-light",
  },
  epic: {
    border: "border-purple-500/30",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.35)]",
    hoverState: "hover:bg-purple-500/[0.15] hover:border-purple-500/50",
    icon: "text-purple-400",
    bg: "bg-purple-500/10",
    textColor: "text-purple-400",
  },
  legendary: {
    border: "border-brand-amber/40",
    glow: "shadow-[0_0_35px_rgba(245,158,11,0.4)]",
    hoverState: "hover:bg-brand-amber/[0.15] hover:border-brand-amber/60",
    icon: "text-brand-amber",
    bg: "bg-brand-amber/10",
    textColor: "text-brand-amber-light",
  },
};

const rarityLabel: Record<Rarity, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

export function BadgeCard({ badge, earned, className }: BadgeCardProps) {
  const config = rarityConfig[badge.rarity];

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      whileHover={earned ? { scale: 1.05, y: -2 } : undefined}
      className={cn(
        "group glass-card-sm flex flex-col items-center gap-3 p-5 transition-all duration-300 relative overflow-hidden",
        earned && config.glow,
        earned && config.hoverState,
        earned && config.bg.replace('/10', '/5'), // Subtle base tint
        !earned && "opacity-50 grayscale",
        className
      )}
    >
      {/* Dynamic background gradient for earned badges to remove the washed-out look */}
      {earned && (
        <div className={cn("absolute inset-0 opacity-20 pointer-events-none transition-opacity group-hover:opacity-40", config.bg)} />
      )}
      <div
        className={cn(
          "w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all",
          earned ? cn(config.border, config.bg) : "border-white/[0.06] bg-white/[0.02]"
        )}
      >
        {earned ? (
          <Award className={cn("w-7 h-7", config.icon)} />
        ) : (
          <Lock className="w-6 h-6 text-text-subtle" />
        )}
      </div>

      <div className="flex flex-col items-center text-center gap-1">
        <h4
          className={cn(
            "text-body-md font-semibold",
            earned ? "text-text-primary" : "text-text-muted"
          )}
        >
          {badge.name}
        </h4>
        <p className="text-caption text-text-muted leading-relaxed">{badge.description}</p>
      </div>

      <span
        className={cn(
          "text-caption font-medium px-2.5 py-0.5 rounded-full border",
          earned
            ? cn(config.border, config.bg, config.textColor)
            : "border-white/[0.04] text-text-subtle"
        )}
      >
        {rarityLabel[badge.rarity]}
      </span>
    </motion.div>
  );
}
