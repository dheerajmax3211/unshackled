"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline" | "ghost" | "danger" | "premium" | "link";
  size?: "default" | "sm" | "lg" | "xl" | "icon";
  className?: string;
  onClick?: () => void;
}

export function AnimatedButton({
  children,
  variant = "default",
  size = "default",
  className,
  onClick,
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button variant={variant} size={size} className={className} onClick={onClick}>
        {children}
      </Button>
    </motion.div>
  );
}
