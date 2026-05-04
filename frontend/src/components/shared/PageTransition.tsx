"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  mode?: "wait" | "sync" | "popLayout";
}

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    filter: "blur(8px)",
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 1.02,
    filter: "blur(4px)",
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const headerVariants: Variants = {
  initial: { opacity: 0, y: -10 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};

const contentVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.15,
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
};

interface PageTransitionSection {
  children: ReactNode;
  className?: string;
}

export function PageHeader({ children, className }: PageTransitionSection) {
  return (
    <motion.div variants={headerVariants} initial="initial" animate="enter" exit="exit" className={className}>
      {children}
    </motion.div>
  );
}

export function PageContent({ children, className }: PageTransitionSection) {
  return (
    <motion.div
      variants={contentVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function PageTransition({ children, mode = "wait" }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode={mode}>
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
  delayChildren = 0.1,
}: StaggerContainerProps) {
  const containerVariants: Variants = {
    initial: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="enter"
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const itemVariants: Variants = {
    initial: { opacity: 0, y: 20, filter: "blur(4px)" },
    enter: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  direction = "up",
}: FadeInProps) {
  const directions = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { x: 20, y: 0 },
    right: { x: -20, y: 0 },
    none: { x: 0, y: 0 },
  };

  const variants = {
    initial: { opacity: 0, ...directions[direction], filter: "blur(4px)" },
    animate: {
      opacity: 1,
      y: 0,
      x: 0,
      filter: "blur(0px)",
      transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div variants={variants} initial="initial" animate="animate" className={className}>
      {children}
    </motion.div>
  );
}

interface ScaleInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function ScaleIn({ children, className, delay = 0, duration = 0.4 }: ScaleInProps) {
  const variants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div variants={variants} initial="initial" animate="animate" className={className}>
      {children}
    </motion.div>
  );
}

interface SlideInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: "left" | "right" | "top" | "bottom";
}

export function SlideIn({ children, className, delay = 0, from = "right" }: SlideInProps) {
  const directions = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    top: { x: 0, y: -50 },
    bottom: { x: 0, y: 50 },
  };

  const variants = {
    initial: { opacity: 0, ...directions[from] },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div variants={variants} initial="initial" animate="animate" className={className}>
      {children}
    </motion.div>
  );
}