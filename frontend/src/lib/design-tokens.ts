export const designTokens = {
  colors: {
    brand: {
      amber: "#F59E0B",
      amberLight: "#FCD34D",
      amberDark: "#B45309",
      blue: "#3B82F6",
      blueLight: "#93C5FD",
      blueDark: "#1D4ED8",
      green: "#10B981",
      greenLight: "#6EE7B7",
      greenDark: "#047857",
      rose: "#F43F5E",
      roseLight: "#FDA4AF",
      roseDark: "#BE123C",
    },
    background: {
      deepest: "#020617",
      deep: "#0F172A",
      surface: "#1E293B",
      elevated: "#334155",
    },
    text: {
      primary: "#F8FAFC",
      secondary: "#CBD5E1",
      muted: "#94A3B8",
    },
  },
  glass: {
    background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.04) 100%)",
    backdropFilter: "blur(24px) saturate(180%)",
    border: "1px solid rgba(255,255,255,0.09)",
    shadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2)",
  },
  motion: {
    spring: {
      default: { tension: 300, friction: 20 },
      snappy: { tension: 400, friction: 17 },
      gentle: { tension: 200, friction: 25 },
      bouncy: { tension: 400, friction: 10 },
    },
    ease: {
      smooth: [0.16, 1, 0.3, 1] as [number, number, number, number],
      snap: [0.68, -0.55, 0.27, 1.55] as [number, number, number, number],
    },
    stagger: {
      fast: 0.04,
      default: 0.08,
      slow: 0.12,
    },
    duration: {
      fast: 0.3,
      default: 0.5,
      slow: 0.8,
      cinematic: 1.2,
    },
  },
} as const;

export const motionVariants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: designTokens.motion.ease.smooth },
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  },
  staggerChildren: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: designTokens.motion.ease.smooth },
    },
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: designTokens.motion.ease.smooth },
    },
  },
  clipReveal: {
    hidden: { clipPath: "inset(0 0 100% 0)" },
    visible: {
      clipPath: "inset(0 0 0% 0)",
      transition: { duration: 0.8, ease: designTokens.motion.ease.smooth },
    },
  },
  wordReveal: {
    hidden: { y: "110%" },
    visible: {
      y: "0%",
      transition: { duration: 0.6, ease: designTokens.motion.ease.smooth },
    },
  },
  dramaticReveal: {
    hidden: { opacity: 0, y: 60, scale: 0.9, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  },
  floatUp: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: designTokens.motion.ease.smooth },
    },
  },
  slideUpReveal: {
    hidden: { clipPath: "inset(0 100% 0 0)" },
    visible: {
      clipPath: "inset(0 0% 0 0)",
      transition: { duration: 0.7, ease: designTokens.motion.ease.smooth },
    },
  },
  orbitalReveal: {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.8, ease: [0.34, 1.56, 0.64, 1] },
    },
  },
  springBounce: {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 15 },
    },
  },
};
