"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AnimatedButton } from "@/components/shared/AnimatedButton";
import { cn } from "@/lib/utils";

export default function CTASection() {
  return (
    <section id="cta" className="relative py-32 bg-surface-darkest overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-darkest via-surface-darker/50 to-surface-darkest pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-amber/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-3xl mx-auto px-6 text-center"
      >
        <span className="inline-flex items-center rounded-full border border-brand-amber/20 bg-brand-amber/10 px-4 py-1.5 text-body-sm font-medium text-brand-amber-light mb-8">
          Your journey starts now
        </span>

        <h2 className="text-display-sm md:text-display-md lg:text-display-lg font-bold tracking-tight mb-6">
          Your brain is ready{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-amber-light via-brand-amber to-brand-amber-dark">
            to heal.
          </span>
          <br />
          Start today.
        </h2>

        <p className="text-body-lg text-text-muted max-w-xl mx-auto mb-10 leading-relaxed">
          Every day you wait is a day your brain could have been rebuilding its dopamine
          receptors. The first step is the hardest. We&apos;ll handle the rest.
        </p>

        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="inline-block"
        >
          <a
            href="/register"
            className={cn(
              "inline-flex items-center gap-3 px-10 py-5 rounded-glass",
              "bg-gradient-to-r from-brand-amber to-brand-amber-dark",
              "text-heading-sm font-semibold text-surface-darkest",
              "shadow-glow-amber shadow-lg",
              "hover:from-brand-amber-light hover:to-brand-amber",
              "transition-all duration-300"
            )}
          >
            Begin Your Unshackling
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </a>
        </motion.div>

        <p className="text-caption text-text-muted mt-6">
          No credit card required. Free forever tier available.
        </p>
      </motion.div>
    </section>
  );
}
