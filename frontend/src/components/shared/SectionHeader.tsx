"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  alignment?: "left" | "center";
  color?: "amber" | "blue" | "green" | "rose";
  badge?: string;
}

const colorMap = {
  amber: "from-brand-amber-light via-brand-amber to-brand-amber-dark",
  blue: "from-brand-blue-light via-brand-blue to-brand-blue-dark",
  green: "from-brand-green-light via-brand-green to-brand-green-dark",
  rose: "from-brand-rose-light via-brand-rose to-brand-rose-dark",
};

/* Word-by-word reveal: each word wraps in overflow-hidden, inner span slides up */
function WordReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.06, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: "110%" },
              visible: { y: "0%" },
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function SectionHeader({
  title,
  subtitle,
  className,
  alignment = "center",
  color = "amber",
  badge,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        alignment === "center" ? "items-center text-center" : "items-start",
        className
      )}
    >
      {badge && (
        <motion.span
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center rounded-full border border-brand-amber/20 bg-brand-amber/10 px-3 py-1 text-caption font-medium text-brand-amber-light"
        >
          {badge}
        </motion.span>
      )}
      <h2
        className={cn(
          "text-display-sm md:text-display-md font-display font-bold bg-clip-text text-transparent bg-gradient-to-r animate-gradient-drift",
          colorMap[color]
        )}
      >
        <WordReveal text={title} />
      </h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="text-body-lg text-text-muted max-w-2xl"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
