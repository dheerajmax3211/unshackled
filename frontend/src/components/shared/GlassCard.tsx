"use client";

import { useRef, useState, useCallback, useEffect } from "react";
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
  glow?: "amber" | "blue" | "green" | "rose" | boolean;
  "aria-label"?: string;
  role?: string;
  tabIndex?: number;
}

const paddingMap = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  none: "p-0",
};

const glowColors = {
  amber: { bg: "bg-brand-amber", shadow: "shadow-brand-amber/20" },
  blue: { bg: "bg-brand-blue", shadow: "shadow-brand-blue/20" },
  green: { bg: "bg-brand-green", shadow: "shadow-brand-green/20" },
  rose: { bg: "bg-brand-rose", shadow: "shadow-brand-rose/20" },
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
  glow = false,
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

    setTiltStyle({ rotateX: -normalY * 1.5, rotateY: normalX * 2 });
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
        initial: { opacity: 0, y: 30, scale: 0.96, filter: "blur(4px)" },
        whileInView: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
      }
    : {};

  return (
    <motion.div
      {...motionProps}
      onClick={onClick}
      className={cn("perspective-1000 relative", onClick && "cursor-pointer")}
    >
      {/* Glow effect behind card */}
      {glow && (
        <motion.div
          className={cn(
            "absolute inset-0 rounded-[1.25rem] blur-xl -z-10",
            typeof glow === "string" ? glowColors[glow]?.bg : "bg-brand-amber",
            typeof glow === "string" ? `opacity-20` : "opacity-15"
          )}
          animate={{ scale: isHovered ? 1.05 : 1, opacity: isHovered ? 0.3 : 0.15 }}
          transition={{ duration: 0.3 }}
        />
      )}

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        animate={{
          rotateX: tiltStyle.rotateX,
          rotateY: tiltStyle.rotateY,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
        className={cn(
          "glass-card preserve-3d will-change-transform relative",
          paddingMap[padding],
          hover && "glass-hover",
          "transition-all duration-400",
          className
        )}
      >
        {/* Animated border glow for glow variant */}
        {glow && (
          <div className="absolute inset-[-1px] rounded-[1.25rem] pointer-events-none">
            <div
              className={cn(
                "absolute inset-0 rounded-[1.25rem]",
                "bg-gradient-to-r from-transparent via-white/20 to-transparent",
                "animate-[shimmer-rainbow_3s_linear_infinite]",
                "[background-size:200%_100%]"
              )}
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${
                  typeof glow === "string"
                    ? `rgb(var(--brand-${glow}) / 0.3)`
                    : "rgb(var(--brand-amber) / 0.3)"
                } 50%, transparent 100%)`,
              }}
            />
          </div>
        )}



        {/* Specular highlight overlay */}
        {tilt && hover && (
          <div
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-[1] transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle 150px at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(255,255,255,0.1) 0%, transparent 100%)`,
              opacity: isHovered ? 1 : 0,
            }}
          />
        )}

        {/* Animated breathing background */}
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.03) 0%, transparent 50%)",
              "radial-gradient(circle at 70% 70%, rgba(255,255,255,0.05) 0%, transparent 50%)",
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.03) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

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
    <div className={cn("glass relative", className)}>
      <div className="glass-content relative z-[1]">{children}</div>
    </div>
  );
}
