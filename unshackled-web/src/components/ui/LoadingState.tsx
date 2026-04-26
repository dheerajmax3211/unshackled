"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2, Shield } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function LoadingState({ 
  message = "Initializing freedom...", 
  fullScreen = false,
  className 
}: LoadingStateProps) {
  const content = (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in duration-500",
      className
    )}>
      <div className="relative">
        {/* Pulsing Outer Ring */}
        <div className="absolute inset-0 rounded-full bg-brand-blue/20 animate-ping" />
        
        {/* Core Icon */}
        <div className="relative p-6 rounded-full bg-slate-900 border border-brand-blue/30 shadow-2xl shadow-brand-blue/20">
          <Shield className="w-10 h-10 text-brand-blue animate-pulse" />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-black text-white uppercase tracking-[0.3em] ml-[0.3em]">
          {message}
        </p>
        <div className="flex items-center justify-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-blue/40 animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-blue/60 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-bounce" />
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617]">
        <div className="absolute inset-0 bg-brand-blue/5 blur-[120px] pointer-events-none" />
        {content}
      </div>
    );
  }

  return content;
}
