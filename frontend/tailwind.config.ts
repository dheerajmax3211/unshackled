import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          amber: "rgb(var(--brand-amber) / <alpha-value>)",
          "amber-light": "rgb(var(--brand-amber-light) / <alpha-value>)",
          "amber-dark": "rgb(var(--brand-amber-dark) / <alpha-value>)",
          blue: "rgb(var(--brand-blue) / <alpha-value>)",
          "blue-light": "rgb(var(--brand-blue-light) / <alpha-value>)",
          "blue-dark": "rgb(var(--brand-blue-dark) / <alpha-value>)",
          green: "rgb(var(--brand-green) / <alpha-value>)",
          "green-light": "rgb(var(--brand-green-light) / <alpha-value>)",
          "green-dark": "rgb(var(--brand-green-dark) / <alpha-value>)",
          rose: "rgb(var(--brand-rose) / <alpha-value>)",
          "rose-light": "rgb(var(--brand-rose-light) / <alpha-value>)",
          "rose-dark": "rgb(var(--brand-rose-dark) / <alpha-value>)",
        },
        surface: {
          darkest: "rgb(var(--surface-darkest) / <alpha-value>)",
          darker: "rgb(var(--surface-darker) / <alpha-value>)",
          dark: "rgb(var(--surface-dark) / <alpha-value>)",
          mid: "rgb(var(--surface-mid) / <alpha-value>)",
          light: "rgb(var(--surface-light) / <alpha-value>)",
          lighter: "rgb(var(--surface-lighter) / <alpha-value>)",
        },
        text: {
          primary: "rgb(var(--text-primary) / <alpha-value>)",
          secondary: "rgb(var(--text-secondary) / <alpha-value>)",
          muted: "rgb(var(--text-muted) / <alpha-value>)",
          subtle: "rgb(var(--text-subtle) / <alpha-value>)",
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
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "slide-up": "slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-down": "slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "scale-in": "scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-10px)" } },
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
