"use client";

import { useRef, useCallback, useState } from "react";
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
  const ref = useRef<HTMLDivElement>(null);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
  const [pressing, setPressing] = useState(false);
  const [ripple, setRipple] = useState(false);

  // Magnetic pull: shift button toward cursor within 80px
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 80) {
      const force = (80 - dist) / 80;
      setMagneticOffset({
        x: dx * force * 0.3,
        y: dy * force * 0.3,
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMagneticOffset({ x: 0, y: 0 });
  }, []);

  const handleClick = useCallback(() => {
    // Visual pulse on click
    setRipple(true);
    setTimeout(() => setRipple(false), 400);
    onClick?.();
  }, [onClick]);

  const isPremium = variant === "premium";
  const isOutline = variant === "outline";

  return (
    <motion.div
      ref={ref}
      className={cn("relative", isPremium && "conic-border rounded-glass-sm")}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: magneticOffset.x,
        y: magneticOffset.y,
        rotateX: pressing ? 8 : 0,
        scale: pressing ? 0.96 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
        mass: 0.8,
      }}
      style={{ perspective: "600px" }}
      whileHover={{ scale: 1.03 }}
    >
      <Button
        variant={variant}
        size={size}
        className={cn(
          "relative overflow-hidden will-change-transform",
          isOutline && "group",
          className
        )}
        onClick={handleClick}
        onMouseDown={() => setPressing(true)}
        onMouseUp={() => setPressing(false)}
      >
        {/* Outline variant: animated underline */}
        {isOutline && (
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 h-px bg-text-secondary origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-300 w-[60%]" />
        )}

        {/* Click ripple pulse */}
        {ripple && (
          <motion.span
            className="absolute inset-0 rounded-[inherit] bg-white/10"
            initial={{ opacity: 0.4, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.4 }}
          />
        )}

        <span className="relative z-10">{children}</span>
      </Button>
    </motion.div>
  );
}
