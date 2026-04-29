"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { GlassCard } from "@/components/shared/GlassCard";
import { motionVariants } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    name: "Priya Sharma",
    avatar: "PS",
    daysClean: 184,
    habit: "Smoking",
    quote:
      "I tried quitting seven times before Unshackled. The difference? This time I could see my lungs healing day by day. And the accountability partner kept me honest. I haven't touched a cigarette in 6 months.",
  },
  {
    name: "Rahul Mehta",
    avatar: "RM",
    daysClean: 92,
    habit: "Social Media",
    quote:
      "The dopamine replacement suggestions were a game-changer. When I got the 4 PM scroll urge, the app told me to do 20 pushups instead. It sounds simple, but it rewired my brain. 90 days clean — I read books now.",
  },
  {
    name: "Ananya Patel",
    avatar: "AP",
    daysClean: 247,
    habit: "Drinking",
    quote:
      "I saved ₹1,84,000 in 8 months. That's not just money — that's a family vacation, a new laptop, and a therapy fund. Unshackled made the cost of my addiction visible. I can never unsee it.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-32 bg-surface-darkest">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader
          title="Real people. Real results."
          subtitle="Stories from the Unshackled community — ordinary people doing extraordinary things."
          color="amber"
          badge="Testimonials"
        />

        <motion.div
          variants={motionVariants.staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={motionVariants.scaleIn}>
              <GlassCard padding="lg" className="h-full flex flex-col">
                <Quote className="w-8 h-8 text-brand-amber/30 mb-4" strokeWidth={1.5} />

                <p className="text-body-md text-text-secondary leading-relaxed flex-1 mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-amber to-brand-amber-dark flex items-center justify-center text-body-sm font-semibold text-surface-darkest flex-shrink-0">
                    {t.avatar}
                  </div>

                  <div>
                    <p className="text-body-sm font-semibold text-text-primary">
                      {t.name}
                    </p>
                    <p className="text-caption text-text-muted">
                      {t.daysClean} days clean · {t.habit}
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
