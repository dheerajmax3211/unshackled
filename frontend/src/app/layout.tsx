import type { Metadata } from "next";
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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-surface-darkest text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
