import type { Metadata } from "next";
import { inter, outfit } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unshackled | Break Free, Level Up",
  description: "A gamified, socially accountable platform for quitting bad habits and reclaiming your life.",
};

import { StoreHydrator } from "@/providers/StoreHydrator";
import { AnimationProvider } from "@/components/animations/AnimationController";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Apply custom fonts as CSS variables and force dark mode class
      className={`${inter.variable} ${outfit.variable} dark h-full antialiased`}
      // Ensure the browser recognizes the dark color scheme
      style={{ colorScheme: 'dark' }}
    >
      <body className="min-h-full flex flex-col bg-dark-bg text-slate-50 selection:bg-brand-blue/30 font-sans">
        <AnimationProvider>
          <StoreHydrator>
            {children}
          </StoreHydrator>
        </AnimationProvider>
      </body>
    </html>
  );
}
