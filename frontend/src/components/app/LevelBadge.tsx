"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: number;
  levelName: string;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

function getLevelTierConfig(level: number) {
  if (level >= 20)
    return {
      gradient: "from-amber-300 via-amber-500 to-amber-700",
      border: "border-amber-400/50",
      glow: "shadow-[0_0_30px_rgba(245,158,11,0.3),0_0_60px_rgba(245,158,11,0.15)]",
      bg: "bg-amber-500/15",
    };
  if (level >= 15)
    return {
      gradient: "from-amber-400 via-amber-500 to-amber-600",
      border: "border-amber-400/40",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.25)]",
      bg: "bg-amber-500/10",
    };
  if (level >= 10)
    return {
      gradient: "from-purple-400 via-purple-500 to-purple-600",
      border: "border-purple-400/40",
      glow: "shadow-[0_0_20px_rgba(168,85,247,0.25)]",
      bg: "bg-purple-500/10",
    };
  if (level >= 5)
    return {
      gradient: "from-brand-blue-light via-brand-blue to-brand-blue-dark",
      border: "border-brand-blue/40",
      glow: "shadow-[0_0_20px_rgba(59,130,246,0.2)]",
      bg: "bg-brand-blue/10",
    };
  return {
    gradient: "from-brand-green-light via-brand-green to-brand-green-dark",
    border: "border-brand-green/40",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]",
    bg: "bg-brand-green/10",
  };
}

const sizeConfig = {
  sm: {
    container: "w-16 h-16",
    levelText: "text-heading-md",
    nameText: "text-[10px]",
  },
  md: {
    container: "w-20 h-20",
    levelText: "text-heading-xl",
    nameText: "text-caption",
  },
  lg: {
    container: "w-24 h-24",
    levelText: "text-display-sm",
    nameText: "text-body-sm",
  },
};

export function LevelBadge({
  level,
  levelName,
  size = "md",
  animated = true,
  className,
}: LevelBadgeProps) {
  const config = getLevelTierConfig(level);
  const sizes = sizeConfig[size];

  return (
    <motion.div
      animate={
        animated
          ? {
              boxShadow: [
                config.glow.replace("0px", "1px"),
                config.glow,
                config.glow.replace("0px", "1px"),
              ],
            }
          : undefined
      }
      transition={{ duration: 3, repeat: Infinity }}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-full border-2",
        sizes.container,
        config.border,
        config.bg,
        config.glow,
        className
      )}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.04] to-transparent" />
      <span
        className={cn(
          "relative z-10 font-bold bg-clip-text text-transparent bg-gradient-to-r tabular-nums leading-none",
          sizes.levelText,
          config.gradient
        )}
      >
        {level}
      </span>
      <span
        className={cn(
          "relative z-10 text-text-muted font-medium mt-0.5",
          sizes.nameText
        )}
      >
        {levelName}
      </span>
    </motion.div>
  );
}
