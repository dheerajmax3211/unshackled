"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedButton } from "@/components/shared/AnimatedButton";
import { mockGlobalStats } from "@/lib/mock-data";
import ThreeBackground from "./ThreeBackground";

export default function HeroSection() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-darkest"
    >
      <ThreeBackground />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, rgb(var(--brand-amber) / 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 20% 80%, rgb(var(--brand-blue) / 0.06) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 80% 20%, rgb(var(--brand-green) / 0.04) 0%, transparent 50%)
          `,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-darkest pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center rounded-full border border-brand-amber/20 bg-brand-amber/10 px-4 py-1.5 text-body-sm font-medium text-brand-amber-light mb-8">
            Recovery, reimagined
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-display-sm md:text-display-md lg:text-display-lg xl:text-display-xl font-bold tracking-tight mb-6"
        >
          Break{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-amber-light via-brand-amber to-brand-amber-dark">
            free.
          </span>{" "}
          Stay{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-amber-light via-brand-amber to-brand-amber-dark">
            free.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="text-body-lg md:text-heading-sm text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The science-backed, socially accountable way to quit bad habits. For good.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <AnimatedButton
            variant="premium"
            size="lg"
            onClick={() => scrollTo("#cta")}
          >
            Start Your Journey
          </AnimatedButton>
          <AnimatedButton
            variant="outline"
            size="lg"
            onClick={() => scrollTo("#science")}
          >
            See the Science
          </AnimatedButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.06]"
        >
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-surface-darkest bg-surface-mid flex items-center justify-center text-caption"
              />
            ))}
          </div>
          <span className="text-body-sm text-text-muted">
            Join{" "}
            <span className="text-text-primary font-semibold">
              {mockGlobalStats.totalUsers.toLocaleString()}
            </span>{" "}
            people who have already unshackled themselves
          </span>
        </motion.div>
      </div>
    </section>
  );
}
