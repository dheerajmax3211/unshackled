import { Inter, Outfit } from "next/font/google";

/**
 * Body font: Inter
 * Clean, highly readable, and professional.
 */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Heading/Display font: Outfit
 * Modern, geometric, and premium feel.
 */
export const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});
