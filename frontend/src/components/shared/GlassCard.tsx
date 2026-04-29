"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { motionVariants } from "@/lib/design-tokens";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: "amber" | "blue" | "green" | "rose" | "none";
  hover?: boolean;
  onClick?: () => void;
  padding?: "sm" | "md" | "lg" | "none";
  animated?: boolean;
}

const glowMap = {
  amber: "hover:shadow-glow-amber",
  blue: "hover:shadow-glow-blue",
  green: "hover:shadow-glow-green",
  rose: "hover:shadow-glow-rose",
  none: "",
};

const paddingMap = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  none: "p-0",
};

export function GlassCard({
  children,
  className,
  glow = "none",
  hover = true,
  onClick,
  padding = "md",
  animated = true,
}: GlassCardProps) {
  return (
    <motion.div
      variants={animated ? motionVariants.fadeInUp : undefined}
      initial={animated ? "hidden" : undefined}
      whileInView={animated ? "visible" : undefined}
      viewport={{ once: true, margin: "-40px" }}
      onClick={onClick}
      className={cn(
        "glass-card",
        paddingMap[padding],
        hover && "glass-hover cursor-pointer",
        glow !== "none" && `hover:${glowMap[glow]}`,
        "transition-all duration-400",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function GlassPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-glass-gradient backdrop-blur-glass border border-white/[0.06]",
        className
      )}
    >
      {children}
    </div>
  );
}
