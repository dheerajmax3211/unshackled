import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-6xl",
  };

  return (
    <div className={`flex items-center gap-2 font-display font-black tracking-tighter ${sizeClasses[size]} ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Abstract "U" or "Chain" being broken icon */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-blue to-indigo-600 flex items-center justify-center transform -rotate-12">
          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-[spin_3s_linear_infinite]" />
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-blue rounded-full blur-sm animate-pulse" />
      </div>
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
        UNSHACKLED
      </span>
    </div>
  );
}
