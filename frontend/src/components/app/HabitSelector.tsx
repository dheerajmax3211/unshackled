"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motionVariants } from "@/lib/design-tokens";

interface HabitOption {
  slug: string;
  displayName: string;
  icon: string;
}

interface HabitSelectorProps {
  options: HabitOption[];
  selected: string | null;
  onSelect: (slug: string) => void;
  className?: string;
}

export function HabitSelector({
  options,
  selected,
  onSelect,
  className,
}: HabitSelectorProps) {
  return (
    <motion.div
      variants={motionVariants.staggerChildren}
      initial="hidden"
      animate="visible"
      className={cn("grid grid-cols-2 sm:grid-cols-3 gap-3", className)}
    >
      {options.map((option) => {
        const isSelected = selected === option.slug;
        return (
          <motion.button
            key={option.slug}
            variants={motionVariants.scaleIn}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(option.slug)}
            className={cn(
              "glass-card-sm flex flex-col items-center gap-3 p-5 transition-all duration-300 relative",
              isSelected
                ? "border-brand-amber/40"
                : "hover:border-white/[0.1]"
            )}
          >
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand-amber flex items-center justify-center"
              >
                <Check className="w-3.5 h-3.5 text-surface-darkest" />
              </motion.div>
            )}
            <div
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center text-3xl transition-all",
                isSelected
                  ? "bg-brand-amber/15 border border-brand-amber/30"
                  : "bg-white/[0.03] border border-white/[0.06]"
              )}
            >
              {option.icon}
            </div>
            <span
              className={cn(
                "text-body-sm font-medium text-center",
                isSelected ? "text-text-primary" : "text-text-secondary"
              )}
            >
              {option.displayName}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
