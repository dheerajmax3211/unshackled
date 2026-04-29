import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          amber: "var(--brand-amber, #F59E0B)",
          "amber-light": "var(--brand-amber-light, #FCD34D)",
          "amber-dark": "var(--brand-amber-dark, #B45309)",
          blue: "var(--brand-blue, #3B82F6)",
          "blue-light": "var(--brand-blue-light, #93C5FD)",
          "blue-dark": "var(--brand-blue-dark, #1D4ED8)",
          green: "var(--brand-green, #10B981)",
          "green-light": "var(--brand-green-light, #6EE7B7)",
          "green-dark": "var(--brand-green-dark, #047857)",
          rose: "var(--brand-rose, #F43F5E)",
          "rose-light": "var(--brand-rose-light, #FDA4AF)",
          "rose-dark": "var(--brand-rose-dark, #BE123C)",
        },
        surface: {
          darkest: "var(--surface-darkest, #020617)",
          darker: "var(--surface-darker, #0F172A)",
          dark: "var(--surface-dark, #1E293B)",
          mid: "var(--surface-mid, #334155)",
          light: "var(--surface-light, #475569)",
          lighter: "var(--surface-lighter, #64748B)",
        },
        text: {
          primary: "var(--text-primary, #F8FAFC)",
          secondary: "var(--text-secondary, #CBD5E1)",
          muted: "var(--text-muted, #94A3B8)",
          subtle: "var(--text-subtle, #64748B)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        display: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "display-xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "700" }],
        "display-lg": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-md": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-sm": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
        "heading-xl": ["1.875rem", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        "heading-lg": ["1.5rem", { lineHeight: "1.35", letterSpacing: "-0.01em", fontWeight: "600" }],
        "heading-md": ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
        "heading-sm": ["1.125rem", { lineHeight: "1.45", fontWeight: "500" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body-md": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        "caption": ["0.75rem", { lineHeight: "1.4" }],
      },
      spacing: { "18": "4.5rem", "88": "22rem", "120": "30rem" },
      borderRadius: {
        glass: "1.25rem", "glass-sm": "0.875rem", "glass-lg": "1.75rem", "glass-xl": "2rem",
      },
      backdropBlur: { glass: "24px", "glass-heavy": "40px" },
      boxShadow: {
        "glass": "0 8px 32px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.06) inset",
        "glass-hover": "0 12px 40px rgba(0, 0, 0, 0.4), 0 2px 0 rgba(255, 255, 255, 0.08) inset",
        "glass-sm": "0 4px 16px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(255, 255, 255, 0.04) inset",
        "elevation-1": "0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.1)",
        "elevation-2": "0 4px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)",
        "elevation-3": "0 10px 15px rgba(0,0,0,0.2), 0 4px 6px rgba(0,0,0,0.1)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "slide-up": "slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-down": "slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "scale-in": "scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-10px)" } },
        "pulse-glow": { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.7" } },
        "slide-up": { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "slide-down": { from: { opacity: "0", transform: "translateY(-10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "scale-in": { from: { opacity: "0", transform: "scale(0.95)" }, to: { opacity: "1", transform: "scale(1)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      transitionDuration: { "400": "400ms", "600": "600ms", "800": "800ms" },
    },
  },
  plugins: [],
};

export default config;
