"use client";

import { useRef, useState, useCallback } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: "sm" | "md" | "lg" | "none";
  animated?: boolean;
  delay?: number;
  tilt?: boolean;
}

const paddingMap = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  none: "p-0",
};

export function GlassCard({
  children,
  className,
  hover = true,
  onClick,
  padding = "md",
  animated: isAnimated = true,
  delay = 0,
  tilt = true,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 });
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current || !tilt || !hover) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const normalX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width / 2)));
    const normalY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height / 2)));

    setTiltStyle({ rotateX: -normalY * 6, rotateY: normalX * 10 });
    setSpotlightPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, [tilt, hover]);

  const handleMouseLeave = useCallback(() => {
    setTiltStyle({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
    setSpotlightPos({ x: 50, y: 50 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const motionProps: HTMLMotionProps<"div"> = isAnimated
    ? {
        initial: { opacity: 0, y: 20, scale: 0.98 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay },
      }
    : {};

  return (
    <motion.div
      {...motionProps}
      onClick={onClick}
      className={cn("perspective-1000", onClick && "cursor-pointer")}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        animate={{
          rotateX: tiltStyle.rotateX,
          rotateY: tiltStyle.rotateY,
          scale: isHovered ? 1.01 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "glass-card preserve-3d will-change-transform animate-breathe",
          paddingMap[padding],
          hover && "glass-hover",
          "transition-shadow duration-400 relative",
          className
        )}
      >
        {/* Specular highlight overlay */}
        {tilt && hover && (
          <div
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-[1] transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle 120px at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(255,255,255,0.08) 0%, transparent 100%)`,
              opacity: isHovered ? 1 : 0,
            }}
          />
        )}

        {/* Content sits above noise + specular */}
        <div className="glass-content relative z-[2]">
          {children}
        </div>
      </motion.div>
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
    <div className={cn("glass", className)}>
      <div className="glass-content relative z-[1]">{children}</div>
    </div>
  );
}
