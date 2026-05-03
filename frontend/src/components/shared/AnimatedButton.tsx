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
    setRipple(true);
    setTimeout(() => setRipple(false), 400);
    onClick?.();
  }, [onClick]);

  const isPremium = variant === "premium";
  const isOutline = variant === "outline";
  const isDefault = variant === "default";

  return (
    <motion.div
      ref={ref}
      className={cn("relative", isPremium && "relative")}
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
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Premium glow effect */}
      {isPremium && (
        <>
          <motion.div
            className="absolute -inset-1 rounded-glass-sm bg-gradient-to-r from-brand-amber via-brand-amber-light to-brand-amber blur-sm opacity-0"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="absolute -inset-[1px] rounded-glass-sm bg-gradient-to-r from-brand-amber via-brand-amber-light to-brand-amber opacity-50" />
        </>
      )}

      {/* Default variant glow */}
      {isDefault && (
        <motion.div
          className="absolute -inset-1 rounded-glass-sm bg-brand-amber/20 blur-md"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}

      <Button
        variant={variant}
        size={size}
        className={cn(
          "relative overflow-hidden will-change-transform",
          isOutline && "group",
          isPremium && "relative",
          className
        )}
        onClick={handleClick}
        onMouseDown={() => setPressing(true)}
        onMouseUp={() => setPressing(false)}
      >
        {/* Background shimmer for premium */}
        {isPremium && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
        )}

        {/* Outline variant: animated underline */}
        {isOutline && (
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 h-px bg-text-secondary origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-300 w-[60%]" />
        )}

        {/* Click ripple pulse */}
        {ripple && (
          <motion.span
            className="absolute inset-0 rounded-[inherit] bg-white/20"
            initial={{ opacity: 0.5, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.8 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Hover glow for premium */}
        {isPremium && (
          <motion.div
            className="absolute inset-0 rounded-[inherit] bg-white/5 opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}

        <span className="relative z-10">{children}</span>
      </Button>
    </motion.div>
  );
}
