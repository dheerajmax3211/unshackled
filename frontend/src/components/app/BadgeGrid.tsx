"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { motionVariants } from "@/lib/design-tokens";
import { GlassCard } from "@/components/shared/GlassCard";
import { BadgeCard } from "@/components/app/BadgeCard";

interface BadgeItem {
  earned: boolean;
  badge: {
    slug: string;
    name: string;
    description: string;
    rarity: "common" | "rare" | "epic" | "legendary";
  };
}

interface BadgeGridProps {
  badges: BadgeItem[];
  className?: string;
}

export function BadgeGrid({ badges, className }: BadgeGridProps) {
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <GlassCard glow="amber" padding="lg" className={cn(className)}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-amber/15 border border-brand-amber/30 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-brand-amber" />
          </div>
          <div>
            <h3 className="text-heading-sm text-text-primary">Your Badges</h3>
            <p className="text-caption text-text-muted">
              {earnedCount} of {badges.length} earned
            </p>
          </div>
        </div>

        <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-amber-dark via-brand-amber to-brand-amber-light"
            initial={{ width: 0 }}
            animate={{ width: `${(earnedCount / badges.length) * 100}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <motion.div
          variants={motionVariants.staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
        >
          {badges.map((item) => (
            <BadgeCard
              key={item.badge.slug}
              badge={item.badge}
              earned={item.earned}
            />
          ))}
        </motion.div>
      </div>
    </GlassCard>
  );
}
