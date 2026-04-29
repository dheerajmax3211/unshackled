"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { DollarSign, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";

interface MoneySavedCardProps {
  savedToday: number;
  savedWeek: number;
  savedMonth: number;
  savedAllTime: number;
  currency?: string;
  suggestion?: string;
  className?: string;
}

type Tab = "today" | "week" | "month" | "alltime";

const tabs: { key: Tab; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "alltime", label: "All Time" },
];

export function MoneySavedCard({
  savedToday,
  savedWeek,
  savedMonth,
  savedAllTime,
  currency = "INR",
  suggestion,
  className,
}: MoneySavedCardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("alltime");
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const amounts: Record<Tab, number> = {
    today: savedToday,
    week: savedWeek,
    month: savedMonth,
    alltime: savedAllTime,
  };

  const maxAmount = Math.max(...Object.values(amounts));

  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;
    const target = amounts[activeTab];
    const duration = 1500;
    setCount(0);
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, activeTab]);

  return (
    <GlassCard glow="blue" padding="lg" className={cn(className)}>
      <div ref={ref} className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-brand-blue/15 border border-brand-blue/30 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-brand-blue-light" />
          </div>
          <div>
            <h3 className="text-heading-sm text-text-primary">Money Saved</h3>
            <p className="text-caption text-text-muted">Every day not spent is money saved</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <motion.span
            key={activeTab}
            className="text-display-sm md:text-display-md text-gradient-blue font-bold tabular-nums"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {formatCurrency(count, currency)}
          </motion.span>
        </div>

        <div className="flex gap-1 p-1 bg-white/[0.03] rounded-glass-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 py-2 text-caption font-medium rounded-md transition-all duration-200",
                activeTab === tab.key
                  ? "bg-brand-blue/20 text-brand-blue-light"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-caption text-text-muted">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Progress
            </span>
            <span>
              {Math.round((amounts[activeTab] / maxAmount) * 100)}% of peak rate
            </span>
          </div>
          <div className="w-full h-2 bg-white/[0.04] rounded-full overflow-hidden">
            {Object.entries(amounts).map(([key, val]) => (
              <motion.div
                key={key}
                className={cn(
                  "h-full rounded-full",
                  key === "today" && "bg-brand-blue-light/30",
                  key === "week" && "bg-brand-blue-light/50",
                  key === "month" && "bg-brand-blue/60",
                  key === "alltime" && "bg-brand-blue"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${(val / maxAmount) * 100}%` }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </div>
          <div className="flex justify-between text-caption text-text-subtle mt-1">
            <span>Day</span>
            <span>Week</span>
            <span>Month</span>
            <span>All Time</span>
          </div>
        </div>

        {suggestion && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-start gap-2 p-3 bg-brand-blue/10 border border-brand-blue/20 rounded-glass-sm"
          >
            <span className="text-lg">💡</span>
            <p className="text-body-sm text-text-secondary">{suggestion}</p>
          </motion.div>
        )}
      </div>
    </GlassCard>
  );
}
