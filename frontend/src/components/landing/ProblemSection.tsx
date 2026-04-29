"use client";

import { motion } from "framer-motion";
import { Brain, Frown, TrendingUp } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { GlassCard } from "@/components/shared/GlassCard";
import { motionVariants } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

const problems = [
  {
    icon: Brain,
    title: "The Dopamine Gap",
    description:
      "Addiction hijacks your brain's reward pathways, flooding them with dopamine. When you stop, your brain is left with a deficit — that's the craving. This isn't a character flaw. It's neurochemistry.",
    color: "amber" as const,
    borderClass: "border-brand-amber/10 hover:border-brand-amber/25",
    glowClass: "before:absolute before:inset-0 before:rounded-glass before:bg-gradient-to-b before:from-brand-amber/5 before:to-transparent before:pointer-events-none",
  },
  {
    icon: Frown,
    title: "Willpower Isn't Enough",
    description:
      "87% of solo quit attempts fail within the first year. Willpower is a finite resource that depletes with stress, fatigue, and emotional strain. You need systems, not just grit — and you need people who understand.",
    color: "rose" as const,
    borderClass: "border-brand-rose/10 hover:border-brand-rose/25",
    glowClass: "before:absolute before:inset-0 before:rounded-glass before:bg-gradient-to-b before:from-brand-rose/5 before:to-transparent before:pointer-events-none",
  },
  {
    icon: TrendingUp,
    title: "Recovery Has a Timeline",
    description:
      "Your body and brain heal on a predictable schedule. Dopamine receptors upregulate by Day 14. Circulation improves by Day 21. By Day 90, your baseline is nearly restored. Knowing what to expect makes the journey measurable — and possible.",
    color: "green" as const,
    borderClass: "border-brand-green/10 hover:border-brand-green/25",
    glowClass: "before:absolute before:inset-0 before:rounded-glass before:bg-gradient-to-b before:from-brand-green/5 before:to-transparent before:pointer-events-none",
  },
];

const iconBgColors = {
  amber: "bg-brand-amber/10 text-brand-amber-light",
  rose: "bg-brand-rose/10 text-brand-rose-light",
  green: "bg-brand-green/10 text-brand-green-light",
};

const titleGradients = {
  amber: "from-brand-amber-light via-brand-amber to-brand-amber-dark",
  rose: "from-brand-rose-light via-brand-rose to-brand-rose-dark",
  green: "from-brand-green-light via-brand-green to-brand-green-dark",
};

export default function ProblemSection() {
  return (
    <section className="relative py-32 bg-surface-darker">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          title="Addiction isn't a choice. It's a hijacked brain."
          subtitle="Understanding what's happening inside your head is the first step toward reclaiming it."
          color="amber"
        />

        <motion.div
          variants={motionVariants.staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          {problems.map((problem) => (
            <motion.div key={problem.title} variants={motionVariants.scaleIn}>
              <GlassCard
                padding="lg"
                className={cn("relative overflow-hidden group", problem.borderClass)}
              >
                <div className={problem.glowClass} />

                <div className="relative z-10 flex flex-col items-center text-center gap-5">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-glass-sm flex items-center justify-center transition-transform duration-400 group-hover:scale-110",
                      iconBgColors[problem.color]
                    )}
                  >
                    <problem.icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>

                  <h3
                    className={cn(
                      "text-heading-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r",
                      titleGradients[problem.color]
                    )}
                  >
                    {problem.title}
                  </h3>

                  <p className="text-body-md text-text-muted leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
