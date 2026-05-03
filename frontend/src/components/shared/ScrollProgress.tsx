"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="scroll-progress">
      <motion.div
        className="scroll-progress-bar"
        style={{
          scaleY,
          transformOrigin: "top",
          height: "100%",
        }}
      />
    </div>
  );
}
