import React from "react";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-dark-bg relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 w-full max-w-md px-6 py-12">
        <div className="flex flex-col items-center mb-12">
          <Logo size="lg" className="mb-2" />
          <p className="text-slate-400 font-medium tracking-wide">
            Your path to freedom begins here.
          </p>
        </div>
        
        {children}
        
        <div className="mt-12 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Unshackled. Built for the persistent.</p>
        </div>
      </div>
    </div>
  );
}
