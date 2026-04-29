import type { Metadata } from "next";
import { ThemeProvider } from "@/lib/theme-context";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unshackled — Break Free. Stay Free.",
  description:
    "The science-backed, socially accountable way to quit bad habits. For good.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          {children}
          <ThemeSwitcher />
        </ThemeProvider>
      </body>
    </html>
  );
}
