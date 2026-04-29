"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCounterProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  color?: "amber" | "blue" | "green" | "rose";
  duration?: number;
}

const colorMap = {
  amber: "text-gradient-amber",
  blue: "text-gradient-blue",
  green: "text-gradient-green",
  rose: "text-gradient-rose",
};

export function StatCounter({
  value,
  label,
  prefix = "",
  suffix = "",
  className,
  color = "amber",
  duration = 2000,
}: StatCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn("flex flex-col items-center", className)}
    >
      <span
        className={cn(
          "text-display-sm md:text-display-md lg:text-display-lg font-bold tabular-nums",
          colorMap[color]
        )}
      >
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </span>
      <span className="text-body-sm text-text-muted mt-2">{label}</span>
    </motion.div>
  );
}
