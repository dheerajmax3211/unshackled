"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type ThemeName = "amber" | "ocean" | "forest" | "midnight" | "dawn";

export const themes: { name: ThemeName; label: string; icon: string }[] = [
  { name: "amber", label: "Amber Fire", icon: "🔥" },
  { name: "ocean", label: "Ocean Calm", icon: "🌊" },
  { name: "forest", label: "Forest Heal", icon: "🌿" },
  { name: "midnight", label: "Midnight Sky", icon: "🌙" },
  { name: "dawn", label: "Dawn Light", icon: "☀️" },
];

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "amber",
  setTheme: () => {},
  cycleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function applyTheme(t: ThemeName) {
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem("unshackled-theme", t);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("amber");

  useEffect(() => {
    const stored = localStorage.getItem("unshackled-theme") as ThemeName | null;
    const valid = stored && themes.some((t) => t.name === stored) ? stored : "amber";
    setThemeState(valid);
    applyTheme(valid);
  }, []);

  const setTheme = useCallback((newTheme: ThemeName) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  }, []);

  const cycleTheme = useCallback(() => {
    const idx = themes.findIndex((t) => t.name === theme);
    const next = themes[(idx + 1) % themes.length].name;
    setTheme(next);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
