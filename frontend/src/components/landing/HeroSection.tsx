"use client";

import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedButton } from "@/components/shared/AnimatedButton";
import { mockGlobalStats } from "@/lib/mock-data";
import ThreeBackground from "./ThreeBackground";

/* ═══════════════════════════════════════
   COUNT-UP HOOK
   ═══════════════════════════════════════ */
function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return count;
}

/* ═══════════════════════════════════════
   ANIMATED WORD — individual word with custom entry
   ═══════════════════════════════════════ */
type WordAnimation = "slideLeft" | "scaleExplode" | "dropDown" | "glitch";

function AnimatedWord({
  word,
  animation,
  delay,
  gradient = false,
}: {
  word: string;
  animation: WordAnimation;
  delay: number;
  gradient?: boolean;
}) {
  const getMotionProps = (anim: WordAnimation) => {
    switch (anim) {
      case "slideLeft":
        return { initial: { x: -80, opacity: 0, filter: "blur(8px)" }, animate: { x: 0, opacity: 1, filter: "blur(0px)" } };
      case "scaleExplode":
        return { initial: { scale: 0.1, opacity: 0, filter: "blur(20px)" }, animate: { scale: 1, opacity: 1, filter: "blur(0px)" } };
      case "dropDown":
        return { initial: { y: -60, opacity: 0 }, animate: { y: 0, opacity: 1 } };
      case "glitch":
        return { initial: { scale: 0.1, opacity: 0, filter: "blur(20px)" }, animate: { scale: 1, opacity: 1, filter: "blur(0px)" } };
    }
  };

  const mp = getMotionProps(animation);

  return (
    <span className="inline-block overflow-hidden">
      <motion.span
        className={cn(
          "inline-block will-change-transform",
          gradient && "text-gradient-animated bg-gradient-to-r from-brand-amber-light via-brand-amber to-brand-amber-dark bg-clip-text text-transparent",
          animation === "glitch" && "animate-glitch-resolve"
        )}
        initial={mp.initial}
        animate={mp.animate}
        transition={{
          duration: animation === "glitch" ? 0.6 : 0.8,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={gradient ? { backgroundSize: "200% 100%" } : undefined}
        onAnimationComplete={() => {
          // Glitch effect: apply glitch CSS animation briefly
          if (animation === "glitch") {
            const el = document.querySelector(".animate-glitch-resolve") as HTMLElement;
            if (el) {
              el.style.animation = "glitch-1 0.15s steps(2) 3";
              setTimeout(() => { el.style.animation = "none"; }, 450);
            }
          }
        }}
      >
        {word}
      </motion.span>
    </span>
  );
}

/* ═══════════════════════════════════════
   CHARACTER REVEAL — staggered char animation
   ═══════════════════════════════════════ */
function CharReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const chars = text.split("");
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.015, delayChildren: delay } },
      }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block will-change-transform"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* ═══════════════════════════════════════
   SCROLL INDICATOR
   ═══════════════════════════════════════ */
function ScrollIndicator() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
    >
      <motion.div
        className="w-px h-10 bg-gradient-to-b from-transparent via-brand-amber/50 to-brand-amber origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.svg
        width="12" height="8" viewBox="0 0 12 8"
        className="text-brand-amber"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { duration: 0.3, delay: 2.5 },
          y: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 2.5 },
        }}
      >
        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </motion.svg>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════ */
export default function HeroSection() {
  const userCount = useCountUp(mockGlobalStats.totalUsers, 1200);
  const sectionRef = useRef<HTMLElement>(null);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Parallax layers via scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const subtextY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-surface-darkest"
    >
      {/* Background scene — parallax at 0.3x */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <ThreeBackground />
      </motion.div>

      {/* Gradient overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, rgb(var(--brand-amber) / 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 20% 80%, rgb(var(--brand-blue) / 0.04) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 80% 20%, rgb(var(--brand-green) / 0.03) 0%, transparent 50%)
          `,
        }}
      />

      {/* Bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-darkest pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center">
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center rounded-full border border-brand-amber/20 bg-brand-amber/10 px-4 py-1.5 text-body-sm font-medium text-brand-amber-light mb-8">
            Recovery, Reimagined
          </span>
        </motion.div>

        {/* Kinetic headline — parallax at 0.7x */}
        <motion.h1
          style={{ y: headlineY }}
          className="text-hero-sm md:text-hero-md lg:text-hero-lg xl:text-hero-xl font-display font-extrabold tracking-tight mb-6 leading-none"
        >
          <AnimatedWord word="Break" animation="slideLeft" delay={0.3} />{" "}
          <AnimatedWord word="free." animation="scaleExplode" delay={0.6} gradient />{" "}
          <br className="hidden sm:block" />
          <AnimatedWord word="Stay" animation="dropDown" delay={0.9} />{" "}
          <AnimatedWord word="free." animation="glitch" delay={1.1} gradient />
        </motion.h1>

        {/* Subheading — character-by-character reveal, parallax at 0.9x */}
        <motion.p
          style={{ y: subtextY }}
          className="text-body-lg md:text-heading-sm text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          <CharReveal
            text="The science-backed, socially accountable way to quit bad habits. For good."
            delay={1.4}
          />
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.8 }}
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

        {/* Social proof row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass shimmer-sweep"
        >
          {/* Avatar stack with flip-in */}
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 2.4 + i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-7 h-7 rounded-full border-2 border-surface-darkest bg-surface-mid flex items-center justify-center text-caption"
                style={{ perspective: "400px" }}
              />
            ))}
          </div>
          <span className="text-body-sm text-text-muted glass-content">
            Join{" "}
            <span className="text-text-primary font-semibold tabular-nums">
              {userCount.toLocaleString()}
            </span>{" "}
            people who have already unshackled themselves
          </span>
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
