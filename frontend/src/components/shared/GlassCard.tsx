"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { motionVariants } from "@/lib/design-tokens";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: "sm" | "md" | "lg" | "none";
  animated?: boolean;
  delay?: number;
}

const paddingMap = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  none: "p-0",
};

const motionProps: HTMLMotionProps<"div"> = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

export function GlassCard({
  children,
  className,
  hover = true,
  onClick,
  padding = "md",
  animated = true,
  delay = 0,
}: GlassCardProps) {
  return (
    <motion.div
      {...(animated ? motionProps : {})}
      transition={{
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
      onClick={onClick}
      className={cn(
        "glass-card",
        paddingMap[padding],
        hover && "glass-hover cursor-pointer",
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
  return <div className={cn("glass", className)}>{children}</div>;
}
