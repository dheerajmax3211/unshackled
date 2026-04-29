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
    background: "rgba(15, 23, 42, 0.5)",
    border: "rgba(255, 255, 255, 0.06)",
    blur: 24,
    shadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  },
} as const;

export const motionVariants = {
  fadeInUp: {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
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
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  },
  slideRight: {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  },
};
