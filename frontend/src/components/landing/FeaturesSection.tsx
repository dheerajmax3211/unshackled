"use client";

import { motion } from "framer-motion";
import {
  Flame,
  TrendingUp,
  Heart,
  Users,
  Shield,
  Zap,
  BookOpen,
  Brain,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { GlassCard } from "@/components/shared/GlassCard";
import { motionVariants } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Flame,
    title: "Streak Tracking",
    description: "Visual streak counters that make every clean day feel like a victory.",
    color: "amber" as const,
  },
  {
    icon: TrendingUp,
    title: "Money Saved Calculator",
    description: "Watch your savings grow in real-time. Freedom pays — literally.",
    color: "green" as const,
  },
  {
    icon: Heart,
    title: "Health Recovery Timeline",
    description: "Track exactly how your body is healing, backed by medical data.",
    color: "rose" as const,
  },
  {
    icon: Users,
    title: "Friend Challenges",
    description: "Compete and support each other with shared quests and accountability.",
    color: "blue" as const,
  },
  {
    icon: Shield,
    title: "XP & Badges",
    description: "Earn recognition for every milestone. Your progress, gamified and celebrated.",
    color: "amber" as const,
  },
  {
    icon: Zap,
    title: "Dopamine Substitutions",
    description: "Science-backed, healthy dopamine hits to replace the cravings.",
    color: "green" as const,
  },
  {
    icon: BookOpen,
    title: "Journal & Mood",
    description: "Track your emotional state. Patterns emerge. Progress becomes visible.",
    color: "blue" as const,
  },
  {
    icon: Brain,
    title: "Withdrawal Empathy",
    description: "Day-by-day messages that understand exactly what you're going through.",
    color: "rose" as const,
  },
];

const iconColors = {
  amber: "bg-brand-amber/10 text-brand-amber-light group-hover:bg-brand-amber/20",
  blue: "bg-brand-blue/10 text-brand-blue-light group-hover:bg-brand-blue/20",
  green: "bg-brand-green/10 text-brand-green-light group-hover:bg-brand-green/20",
  rose: "bg-brand-rose/10 text-brand-rose-light group-hover:bg-brand-rose/20",
};

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 bg-surface-darker">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          title="Everything you need to succeed"
          subtitle="Purpose-built tools that turn the science of recovery into daily, actionable guidance."
          color="amber"
          badge="Features"
        />

        <motion.div
          variants={motionVariants.staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-16"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={motionVariants.scaleIn}
              custom={i}
            >
              <GlassCard
                padding="md"
                className="group h-full"
              >
                <div className="flex flex-col gap-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-glass-sm flex items-center justify-center transition-all duration-400",
                      iconColors[feature.color]
                    )}
                  >
                    <feature.icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>

                  <div>
                    <h3 className="text-heading-sm font-semibold text-text-primary mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-body-sm text-text-muted leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
