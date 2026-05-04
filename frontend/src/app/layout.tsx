import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/lib/theme-context";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { SmoothScroll } from "@/components/shared/SmoothScroll";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { ToastProvider } from "@/components/shared/Toast";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://unshackled.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Unshackled — Break Free. Stay Free.",
    template: "%s | Unshackled",
  },
  description:
    "The science-backed, socially accountable way to quit bad habits. Track streaks, earn XP, and join a community that supports each other.",
  keywords: [
    "quit smoking",
    "quit drinking",
    "habit tracker",
    "addiction recovery",
    "accountability",
    "streak tracker",
    "self-improvement",
    "quit bad habits",
  ],
  authors: [{ name: "Unshackled" }],
  creator: "Unshackled",
  publisher: "Unshackled",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Unshackled",
    title: "Unshackled — Break Free. Stay Free.",
    description:
      "The science-backed, socially accountable way to quit bad habits. Track streaks, earn XP, and join a community that supports each other.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Unshackled - Break Free. Stay Free.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unshackled — Break Free. Stay Free.",
    description:
      "The science-backed, socially accountable way to quit bad habits.",
    images: ["/og-image.png"],
    creator: "@unshackled",
  },
  alternates: {
    canonical: BASE_URL,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Unshackled",
  },
  formatDetection: {
    email: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F59E0B" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen antialiased">
        <ErrorBoundary>
          <ThemeProvider>
            <ToastProvider>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-brand-amber focus:text-surface-darkest focus:font-medium"
              >
                Skip to main content
              </a>
              <SmoothScroll>
                <main id="main-content">
                  {children}
                </main>
                <ScrollProgress />
                <ThemeSwitcher />
              </SmoothScroll>
            </ToastProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
