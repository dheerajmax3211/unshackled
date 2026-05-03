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

function AnimatedFeatureIcon({ iconName, IconComponent }: { iconName: string, IconComponent: any }) {
  const getAnimationProps = () => {
    switch (iconName) {
      case "Streak Tracking":
        return {
          animate: { y: [0, -2, 0, -1, 0], scale: [1, 1.1, 1, 1.05, 1], opacity: [0.8, 1, 0.9, 1, 0.8] },
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        };
      case "Money Saved Calculator":
        return {
          animate: { y: [0, -3, 0], x: [0, 2, 0] },
          transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
        };
      case "Health Recovery Timeline":
        return {
          animate: { scale: [1, 1.2, 1, 1.1, 1] },
          transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
        };
      case "Dopamine Substitutions":
        return {
          animate: { rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] },
          transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2, ease: "linear" }
        };
      case "Friend Challenges":
        return {
          animate: { y: [0, -2, 0] },
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        };
      case "XP & Badges":
        return {
          animate: { rotateY: [0, 180, 360] },
          transition: { duration: 3, repeat: Infinity, ease: "linear" }
        };
      case "Journal & Mood":
        return {
          animate: { rotate: [0, 5, -5, 0] },
          transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        };
      case "Withdrawal Empathy":
        return {
          animate: { scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] },
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        };
      default:
        return {};
    }
  };

  return (
    <motion.div {...getAnimationProps()} className="flex items-center justify-center">
      <IconComponent className="w-5 h-5" strokeWidth={1.5} />
    </motion.div>
  );
}

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
    <section id="features" className="relative py-32 bg-surface-darker overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          title="Everything you need to succeed"
          subtitle="Purpose-built tools that turn the science of recovery into daily, actionable guidance."
          color="amber"
          badge="Features"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-16"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <GlassCard
                padding="md"
                className="group h-full"
                delay={i * 0.05}
                animated={false}
              >
                <div className="flex flex-col gap-4">
                  <motion.div
                    className={cn(
                      "w-10 h-10 rounded-glass-sm flex items-center justify-center transition-all duration-400",
                      iconColors[feature.color]
                    )}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <AnimatedFeatureIcon iconName={feature.title} IconComponent={feature.icon} />
                  </motion.div>

                  <div>
                    <h3 className="text-heading-sm font-display font-semibold text-text-primary mb-2">
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
