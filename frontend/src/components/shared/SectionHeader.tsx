"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  alignment?: "left" | "center";
  color?: "amber" | "blue" | "green" | "rose";
  badge?: string;
}

const colorMap = {
  amber: "from-brand-amber-light via-brand-amber to-brand-amber-dark",
  blue: "from-brand-blue-light via-brand-blue to-brand-blue-dark",
  green: "from-brand-green-light via-brand-green to-brand-green-dark",
  rose: "from-brand-rose-light via-brand-rose to-brand-rose-dark",
};

export function SectionHeader({
  title,
  subtitle,
  className,
  alignment = "center",
  color = "amber",
  badge,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col gap-4",
        alignment === "center" ? "items-center text-center" : "items-start",
        className
      )}
    >
      {badge && (
        <span className="inline-flex items-center rounded-full border border-brand-amber/20 bg-brand-amber/10 px-3 py-1 text-caption font-medium text-brand-amber-light">
          {badge}
        </span>
      )}
      <h2
        className={cn(
          "text-display-sm md:text-display-md font-bold bg-clip-text text-transparent bg-gradient-to-r",
          colorMap[color]
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-body-lg text-text-muted max-w-2xl">{subtitle}</p>
      )}
    </motion.div>
  );
}
