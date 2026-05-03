"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Palette, X } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useTheme, themes } from "@/lib/theme-context";

/* Theme color previews — gradient pairs for the orbs */
const themeGradients: Record<string, [string, string]> = {
  amber: ["#F59E0B", "#B45309"],
  ocean: ["#0EA5E9", "#0369A1"],
  forest: ["#22C55E", "#15803D"],
  midnight: ["#A855F7", "#7E22CE"],
  dawn: ["#D97706", "#92400E"],
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [irisActive, setIrisActive] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });

  const currentTheme = themes.find((t) => t.name === theme);

  // Magnetic pull for trigger button
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 80) {
      const force = (80 - dist) / 80;
      setMagneticOffset({ x: dx * force * 0.25, y: dy * force * 0.25 });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMagneticOffset({ x: 0, y: 0 });
  }, []);

  const handleThemeSwitch = useCallback((themeName: string) => {
    // Trigger iris wipe
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
      const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
      document.documentElement.style.setProperty("--iris-x", `${x}%`);
      document.documentElement.style.setProperty("--iris-y", `${y}%`);
    }

    setIrisActive(true);
    setTimeout(() => {
      setTheme(themeName as any);
      setTimeout(() => {
        setIrisActive(false);
      }, 400);
    }, 50);
    setOpen(false);
  }, [setTheme]);

  return (
    <>
      {/* Iris wipe overlay */}
      <AnimatePresence>
        {irisActive && (
          <motion.div
            className="fixed inset-0 z-[200] pointer-events-none"
            style={{
              background: `rgb(var(--brand-amber))`,
            }}
            initial={{ clipPath: `circle(0% at var(--iris-x, 95%) var(--iris-y, 95%))` }}
            animate={{ clipPath: `circle(150% at var(--iris-x, 95%) var(--iris-y, 95%))` }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>

      <div
        className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.85, filter: "blur(8px)" }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="glass-card p-3 flex flex-col gap-1.5 min-w-[220px]"
            >
              <div className="flex items-center justify-between mb-1 px-2 glass-content">
                <span className="text-caption font-semibold text-text-muted uppercase tracking-widest">
                  Theme
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-full hover:bg-white/[0.06] transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-text-subtle" />
                </button>
              </div>
              {themes.map((t) => {
                const active = theme === t.name;
                const gradient = themeGradients[t.name];
                return (
                  <motion.button
                    key={t.name}
                    onClick={() => handleThemeSwitch(t.name)}
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-glass-sm transition-all duration-200 text-left glass-content ${
                      active
                        ? "bg-brand-amber/15 border border-brand-amber/20"
                        : "hover:bg-white/[0.04] border border-transparent"
                    }`}
                  >
                    {/* Animated gradient orb */}
                    <div
                      className={`w-8 h-8 rounded-full flex-shrink-0 ${
                        active ? "animate-pulse-glow" : ""
                      }`}
                      style={{
                        background: gradient
                          ? `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`
                          : undefined,
                        boxShadow: active
                          ? `0 0 12px ${gradient?.[0]}60`
                          : "none",
                        animation: !active ? "breathe 3s ease-in-out infinite" : undefined,
                      }}
                    />
                    <span
                      className={`text-body-sm font-medium ${
                        active ? "text-brand-amber-light" : "text-text-secondary"
                      }`}
                    >
                      {t.label}
                    </span>
                    {active && (
                      <motion.div
                        layoutId="theme-active-dot"
                        className="ml-auto w-2 h-2 rounded-full bg-brand-amber"
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          ref={buttonRef}
          animate={{
            x: magneticOffset.x,
            y: magneticOffset.y,
          }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onClick={() => setOpen(!open)}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-glass transition-all duration-300 ${
            open
              ? "bg-brand-amber text-surface-darkest"
              : "glass-card text-text-secondary hover:text-text-primary"
          }`}
          style={{
            background: !open
              ? undefined
              : undefined,
          }}
          title={`Theme: ${currentTheme?.label ?? "Amber Fire"}`}
        >
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="glass-content"
          >
            <Palette className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </div>
    </>
  );
}
