"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Bell, BellOff } from "lucide-react";

interface AnimatedSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  id?: string;
}

export function AnimatedSwitch({ checked, onChange, className, id }: AnimatedSwitchProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300",
        checked ? "bg-brand-amber/20 border-brand-amber/30" : "bg-white/[0.04] border-white/[0.08]",
        "border p-0.5",
        className
      )}
    >
      <span className="sr-only">Enable notifications</span>
      <motion.div
        initial={false}
        animate={{
          x: checked ? 24 : 0,
          backgroundColor: checked ? "#F59E0B" : "#9CA3AF",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="flex h-6 w-6 items-center justify-center rounded-full shadow-lg"
      >
        <motion.div
          initial={false}
          animate={{ rotate: checked ? 0 : -45, scale: checked ? 1 : 0.8 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {checked ? (
            <Bell className="h-3 w-3 text-surface-darkest" />
          ) : (
            <BellOff className="h-3 w-3 text-surface-darkest" />
          )}
        </motion.div>
      </motion.div>
    </button>
  );
}
