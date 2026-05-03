"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { GlassCard } from "@/components/shared/GlassCard";
import { StatCounter } from "@/components/shared/StatCounter";
import { mockGlobalStats } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const stats = [
  {
    value: mockGlobalStats.totalUsers,
    label: "Total Users",
    color: "amber" as const,
    suffix: "+",
  },
  {
    value: mockGlobalStats.totalHabitsTracked,
    label: "Habits Tracked",
    color: "blue" as const,
    suffix: "+",
  },
  {
    value: mockGlobalStats.totalCleanDays,
    label: "Clean Days",
    color: "green" as const,
    suffix: "+",
  },
  {
    value: mockGlobalStats.totalMoneySaved,
    label: "Money Saved",
    color: "amber" as const,
    prefix: "₹",
  },
];

const colorBorders = {
  amber: "border-brand-amber/10 hover:border-brand-amber/20",
  blue: "border-brand-blue/10 hover:border-brand-blue/20",
  green: "border-brand-green/10 hover:border-brand-green/20",
  rose: "border-brand-rose/10 hover:border-brand-rose/20",
};

export default function StatsSection() {
  return (
    <section
      id="stats"
      className="relative py-32 bg-surface-darkest overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          title="The Unshackled Community"
          subtitle="Real numbers from real people reclaiming their lives, one day at a time."
          color="amber"
          badge="Global Stats"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <GlassCard
                padding="lg"
                className={cn(
                  "text-center",
                  colorBorders[stat.color],
                  stat.color === "green" && "animate-pulse-glow"
                )}
                animated={false}
              >
                <StatCounter
                  value={stat.value}
                  label={stat.label}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  color={stat.color}
                />
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
