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
   FLOATING ORB — decorative background element
   ═══════════════════════════════════════ */
function FloatingOrb({
  className,
  size = 200,
  duration = 8,
  delay = 0,
}: {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={cn("orb rounded-full", className)}
      style={{ width: size, height: size }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/* ═══════════════════════════════════════
   DECORATIVE STARS
   ═══════════════════════════════════════ */
function DecorativeStars() {
  const stars = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 2,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════
   ANIMATED WORD — individual word with custom entry
   ═══════════════════════════════════════ */
type WordAnimation = "slideLeft" | "scaleExplode" | "dropDown" | "glitch" | "dramaticReveal";

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
      case "dramaticReveal":
        return { initial: { opacity: 0, y: 80, scale: 0.8, filter: "blur(12px)" }, animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } };
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
          duration: animation === "glitch" ? 0.6 : 0.9,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={gradient ? { backgroundSize: "200% 100%" } : undefined}
        onAnimationComplete={() => {
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
            hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
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

      {/* Atmospheric floating orbs */}
      <FloatingOrb className="orb-amber -top-20 -left-20" size={400} duration={10} delay={0} />
      <FloatingOrb className="orb-blue top-1/4 -right-32" size={300} duration={12} delay={2} />
      <FloatingOrb className="orb-green bottom-20 left-1/4" size={250} duration={9} delay={1} />
      <FloatingOrb className="orb-rose top-1/3 left-1/3 opacity-50" size={180} duration={11} delay={3} />

      {/* Decorative stars */}
      <DecorativeStars />

      {/* Gradient overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 40%, rgb(var(--brand-amber) / 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 20% 80%, rgb(var(--brand-blue) / 0.06) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 80% 20%, rgb(var(--brand-green) / 0.05) 0%, transparent 50%)
          `,
        }}
      />

      {/* Bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-darkest pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-32">
        {/* Asymmetric layout - badge offset to the left */}
        <motion.div
          initial={{ opacity: 0, x: -60, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute -left-12 top-8 hidden lg:block"
        >
          <div className="w-px h-32 bg-gradient-to-b from-transparent via-brand-amber/30 to-transparent" />
        </motion.div>

        {/* Pill badge - dramatic entrance */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-amber/20 via-brand-blue/20 to-brand-green/20 rounded-full blur-xl opacity-60" />
          <span className="relative inline-flex items-center rounded-full border border-brand-amber/30 bg-brand-amber/10 px-5 py-2 text-body-sm font-medium text-brand-amber-light mb-10">
            <motion.span
              className="w-2 h-2 rounded-full bg-brand-amber mr-2"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Recovery, Reimagined
          </span>
        </motion.div>

        {/* Kinetic headline — parallax at 0.7x with dramatic reveal */}
        <motion.h1
          style={{ y: headlineY }}
          className="text-hero-sm md:text-hero-md lg:text-hero-lg xl:text-hero-xl font-display font-extrabold tracking-tight mb-8 leading-none relative"
        >
          {/* Decorative accent behind text */}
          <motion.div
            className="absolute -left-8 top-1/2 -translate-y-1/2 w-32 h-32 bg-brand-amber/10 rounded-full blur-3xl"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          />

          <AnimatedWord word="Break" animation="slideLeft" delay={0.4} />{" "}
          <AnimatedWord word="free." animation="dramaticReveal" delay={0.7} gradient />{" "}
          <br className="hidden sm:block" />
          <AnimatedWord word="Stay" animation="dropDown" delay={1.0} />{" "}
          <AnimatedWord word="free." animation="glitch" delay={1.3} gradient />
        </motion.h1>

        {/* Subheading — character-by-character reveal, parallax at 0.9x */}
        <motion.p
          style={{ y: subtextY }}
          className="text-body-lg md:text-heading-sm text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed relative"
        >
          {/* Decorative line accent */}
          <motion.span
            className="absolute -left-6 top-1/2 w-2 h-px bg-gradient-to-r from-brand-amber to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          />
          <CharReveal
            text="The science-backed, socially accountable way to quit bad habits. For good."
            delay={1.6}
          />
        </motion.p>

        {/* CTA Buttons - staggered with scale */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 2.0 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <AnimatedButton
              variant="premium"
              size="lg"
              onClick={() => scrollTo("#cta")}
            >
              Start Your Journey
            </AnimatedButton>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <AnimatedButton
              variant="outline"
              size="lg"
              onClick={() => scrollTo("#science")}
            >
              See the Science
            </AnimatedButton>
          </motion.div>
        </motion.div>

        {/* Social proof row - glassmorphic with shimmer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.4 }}
          className="relative inline-flex items-center gap-4 px-6 py-3 rounded-full glass shimmer-sweep"
        >
          {/* Avatar stack with flip-in */}
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 2.6 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="w-8 h-8 rounded-full border-2 border-surface-darkest bg-surface-mid flex items-center justify-center text-caption"
                style={{ perspective: "400px" }}
              />
            ))}
          </div>
          <div className="h-8 w-px bg-white/10" />
          <span className="text-body-sm text-text-muted glass-content">
            Join{" "}
            <motion.span
              className="text-text-primary font-bold tabular-nums inline-block"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 2.8, duration: 0.4 }}
            >
              {userCount.toLocaleString()}
            </motion.span>{" "}
            people who have already unshackled themselves
          </span>
        </motion.div>

        {/* Bottom decorative elements */}
        <motion.div
          className="absolute bottom-32 right-12 hidden lg:block"
          initial={{ opacity: 0, rotate: -45 }}
          animate={{ opacity: 0.6, rotate: 0 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          <div className="w-16 h-16 border border-brand-amber/20 rounded-full" />
          <div className="absolute top-4 left-4 w-16 h-16 border border-brand-blue/20 rounded-full" />
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
