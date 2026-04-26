import React from "react";
import LandingFooter from "@/components/landing/LandingFooter"; // To be created
import { Navigation } from "@/components/landing/Navigation"; // To be created

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#020617] selection:bg-brand-blue/30 selection:text-white">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-blue/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow">
          {children}
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
