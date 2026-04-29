"use client";

import { motion } from "framer-motion";

export function LoadingSpinner({ text }: { text?: string }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-4 py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-brand-amber/20" />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-amber"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, ease: "linear", repeat: Infinity }}
        />
      </div>
      {text && (
        <motion.p
          className="text-body-sm text-text-muted"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
}
