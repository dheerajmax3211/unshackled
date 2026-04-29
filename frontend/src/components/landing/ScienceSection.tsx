"use client";

import { motion } from "framer-motion";
import { FlaskConical, Users, Brain, TrendingUp } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { GlassCard } from "@/components/shared/GlassCard";
import { motionVariants } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

const pillars = [
  {
    number: "01",
    icon: FlaskConical,
    headline: "Gamification doubles abstinence",
    description:
      "A comprehensive meta-analysis published in JAMA found that gamification interventions produced a relative risk of 2.12 for sustained behavioral change. Structured reward systems work — and they work better than self-directed attempts.",
    color: "amber" as const,
  },
  {
    number: "02",
    icon: Users,
    headline: "Social accountability is the #1 predictor",
    description:
      "Studies consistently show that individuals with a committed accountability partner have 65-95% higher success rates. The act of being seen and supported transforms an internal struggle into a shared mission.",
    color: "blue" as const,
  },
  {
    number: "03",
    icon: Brain,
    headline: "The Dopamine Gap theory",
    description:
      "Addiction creates a biochemical deficit in dopamine receptors. Recovery requires rebuilding this baseline — a process that takes 14-90 days. Understanding this timeline transforms cravings from moral failures into predictable neurochemical events.",
    color: "green" as const,
  },
  {
    number: "04",
    icon: TrendingUp,
    headline: "Recovery follows a quantifiable timeline",
    description:
      "From carbon monoxide normalization at Day 1 to full dopamine baseline restoration at Day 90, your body's healing process is scientifically documented. Seeing your progress mapped against this timeline builds momentum.",
    color: "rose" as const,
  },
];

const numberColors = {
  amber: "text-brand-amber/30",
  blue: "text-brand-blue/30",
  green: "text-brand-green/30",
  rose: "text-brand-rose/30",
};

const iconColors = {
  amber: "bg-brand-amber/10 text-brand-amber-light",
  blue: "bg-brand-blue/10 text-brand-blue-light",
  green: "bg-brand-green/10 text-brand-green-light",
  rose: "bg-brand-rose/10 text-brand-rose-light",
};

const borderColors = {
  amber: "border-brand-amber/10 hover:border-brand-amber/25",
  blue: "border-brand-blue/10 hover:border-brand-blue/25",
  green: "border-brand-green/10 hover:border-brand-green/25",
  rose: "border-brand-rose/10 hover:border-brand-rose/25",
};

export default function ScienceSection() {
  return (
    <section id="science" className="relative py-32 bg-surface-darkest">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          title="Built on behavioral science"
          subtitle="Every feature is grounded in peer-reviewed research on addiction recovery and behavior change."
          color="blue"
          badge="The Research"
        />

        <motion.div
          variants={motionVariants.staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16"
        >
          {pillars.map((pillar) => (
            <motion.div key={pillar.number} variants={motionVariants.scaleIn}>
              <GlassCard
                padding="lg"
                className={cn("relative group", borderColors[pillar.color])}
              >
                <div className="flex items-start gap-5">
                  <span
                    className={cn(
                      "text-display-sm font-bold leading-none opacity-50 flex-shrink-0",
                      numberColors[pillar.color]
                    )}
                  >
                    {pillar.number}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-glass-sm flex items-center justify-center flex-shrink-0",
                          iconColors[pillar.color]
                        )}
                      >
                        <pillar.icon className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-heading-sm font-semibold text-text-primary">
                        {pillar.headline}
                      </h3>
                    </div>

                    <p className="text-body-sm text-text-muted leading-relaxed">
                      {pillar.description}
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
