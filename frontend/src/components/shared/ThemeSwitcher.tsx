"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Palette, X } from "lucide-react";
import { useState } from "react";
import { useTheme, themes } from "@/lib/theme-context";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const currentTheme = themes.find((t) => t.name === theme);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card p-3 flex flex-col gap-1.5 min-w-[200px]"
          >
            <div className="flex items-center justify-between mb-1 px-2">
              <span className="text-caption font-semibold text-text-muted uppercase tracking-widest">
                Theme
              </span>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-full hover:bg-white/[0.06]"
              >
                <X className="w-3.5 h-3.5 text-text-subtle" />
              </button>
            </div>
            {themes.map((t) => {
              const active = theme === t.name;
              return (
                <button
                  key={t.name}
                  onClick={() => { setTheme(t.name); setOpen(false); }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-glass-sm transition-all duration-200 text-left ${
                    active
                      ? "bg-brand-amber/15 border border-brand-amber/20"
                      : "hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  <span className="text-lg">{t.icon}</span>
                  <span className={`text-body-sm font-medium ${
                    active ? "text-brand-amber-light" : "text-text-secondary"
                  }`}>
                    {t.label}
                  </span>
                  {active && (
                    <motion.div
                      layoutId="theme-active-dot"
                      className="ml-auto w-2 h-2 rounded-full bg-brand-amber"
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen(!open)}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-glass transition-all duration-300 ${
          open
            ? "bg-brand-amber text-surface-darkest"
            : "glass-card text-text-secondary hover:text-text-primary"
        }`}
        title={`Theme: ${currentTheme?.label ?? "Amber Fire"}`}
      >
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Palette className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </div>
  );
}
