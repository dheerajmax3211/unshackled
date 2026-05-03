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
              "group glass-card-sm flex flex-col items-center gap-3 p-5 transition-all duration-300 relative",
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
            <motion.div
              animate={isSelected ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] } : {}}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center text-3xl transition-all",
                isSelected
                  ? "bg-brand-amber/15 border border-brand-amber/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                  : "bg-white/[0.03] border border-white/[0.06] group-hover:bg-white/[0.06] group-hover:scale-110"
              )}
            >
              <motion.span
                animate={isSelected ? { y: [-2, 2, -2] } : {}}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {option.icon}
              </motion.span>
            </motion.div>
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
