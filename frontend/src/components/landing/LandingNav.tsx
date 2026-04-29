"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2Off, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedButton } from "@/components/shared/AnimatedButton";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Science", href: "#science" },
  { label: "Community", href: "#stats" },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-surface-darkest/80 backdrop-blur-glass border-b border-white/[0.06] shadow-glass"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        <button
          onClick={() => scrollTo("#hero")}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-9 h-9 rounded-glass-sm bg-brand-amber/15 border border-brand-amber/20 flex items-center justify-center group-hover:bg-brand-amber/25 transition-colors duration-300">
            <Link2Off className="w-5 h-5 text-brand-amber-light" strokeWidth={1.5} />
          </div>
          <span className="text-heading-sm font-semibold text-text-primary tracking-tight">
            Unshackled
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="px-4 py-2 text-body-sm text-text-secondary hover:text-text-primary rounded-glass-sm hover:bg-white/[0.04] transition-all duration-200"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <AnimatedButton
            variant="premium"
            size="sm"
            onClick={() => scrollTo("#cta")}
          >
            Get Started
          </AnimatedButton>
        </div>

        <button
          className="md:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-surface-darkest/95 backdrop-blur-glass border-b border-white/[0.06] overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="w-full text-left px-4 py-3 text-body-md text-text-secondary hover:text-text-primary hover:bg-white/[0.04] rounded-glass-sm transition-all duration-200"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2">
                <button
                  onClick={() => scrollTo("#cta")}
                  className="w-full py-3 px-4 text-body-md font-semibold text-surface-darkest bg-gradient-to-r from-brand-amber to-brand-amber-dark rounded-glass-sm shadow-glow-amber"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
