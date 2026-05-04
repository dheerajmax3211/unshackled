"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "shimmer" | "none";
  lines?: number;
}

export function Skeleton({
  className,
  variant = "rounded",
  width,
  height,
  animation = "wave",
  lines,
}: SkeletonProps) {
  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-lg",
  };

  const animationStyles = {
    pulse: {
      animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    },
    wave: {
      position: "relative" as const,
      overflow: "hidden" as const,
      "&::after": {
        content: '""',
        position: "absolute" as const,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        transform: "translateX(-100%)",
        backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
        animation: "wave-skeleton 1.5s infinite",
      },
    },
    shimmer: {
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
      backgroundSize: "200% 100%",
      animation: "shimmer-skeleton 1.5s infinite",
    },
    none: {},
  };

  return (
    <motion.div
      className={cn(
        "bg-white/[0.05]",
        variantClasses[variant],
        className
      )}
      style={{
        width: width,
        height: height,
        ...animationStyles[animation],
      }}
      animate={
        animation === "pulse"
          ? { opacity: [0.5, 1, 0.5] }
          : animation === "shimmer"
          ? { backgroundPosition: ["200% 0", "-200% 0"] }
          : {}
      }
      transition={
        animation === "pulse"
          ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
          : animation === "shimmer"
          ? { duration: 1.5, repeat: Infinity, ease: "linear" }
          : {}
      }
    />
  );
}

interface SkeletonCardProps {
  showAvatar?: boolean;
  showImage?: boolean;
  lines?: number;
  className?: string;
}

export function SkeletonCard({
  showAvatar = true,
  showImage = false,
  lines = 3,
  className,
}: SkeletonCardProps) {
  return (
    <div className={cn("p-6 rounded-xl bg-surface-dark/30 border border-white/[0.04]", className)}>
      <div className="flex items-start gap-4">
        {showAvatar && (
          <Skeleton variant="circular" width={48} height={48} animation="wave" />
        )}
        <div className="flex-1 space-y-3">
          <Skeleton variant="text" height={20} width="60%" animation="wave" />
          <Skeleton variant="text" height={16} width="40%" animation="wave" />
        </div>
      </div>
      {showImage && (
        <Skeleton variant="rounded" height={160} className="mt-4" animation="wave" />
      )}
      <div className="mt-4 space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            height={14}
            width={`${100 - i * 15}%`}
            animation="wave"
          />
        ))}
      </div>
    </div>
  );
}

interface SkeletonListProps {
  count?: number;
  type?: "card" | "item" | "line";
  className?: string;
}

export function SkeletonList({ count = 5, type = "item", className }: SkeletonListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          {type === "card" && <SkeletonCard />}
          {type === "item" && (
            <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-dark/20">
              <Skeleton variant="circular" width={40} height={40} animation="wave" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" height={16} width="50%" animation="wave" />
                <Skeleton variant="text" height={12} width="30%" animation="wave" />
              </div>
            </div>
          )}
          {type === "line" && (
            <Skeleton variant="text" height={16} width="100%" animation="wave" />
          )}
        </motion.div>
      ))}
    </div>
  );
}

interface SkeletonDashboardProps {
  className?: string;
}

export function SkeletonDashboard({ className }: SkeletonDashboardProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SkeletonCard className="h-32" showAvatar={false} lines={1} />
        <SkeletonCard className="h-32" showAvatar={false} lines={1} />
        <SkeletonCard className="h-32" showAvatar={false} lines={1} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard showAvatar lines={4} />
        <SkeletonCard showAvatar lines={4} />
      </div>
    </div>
  );
}

interface SkeletonProfileProps {
  className?: string;
}

export function SkeletonProfile({ className }: SkeletonProfileProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center gap-6">
        <Skeleton variant="circular" width={80} height={80} animation="wave" />
        <div className="space-y-3">
          <Skeleton variant="text" height={24} width={160} animation="wave" />
          <Skeleton variant="text" height={16} width={100} animation="wave" />
        </div>
      </div>
      <SkeletonCard lines={4} />
    </div>
  );
}