"use client";

import React from "react";
import { useUserStore } from "@/store/useUserStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Lock, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PremiumGateProps {
  children: React.ReactNode;
  feature?: string;
  className?: string;
}

export default function PremiumGate({ 
  children, 
  feature = "This advanced feature",
  className 
}: PremiumGateProps) {
  const { user } = useUserStore();
  const isPremium = user?.premiumStatus === "PREMIUM" || user?.premiumStatus === "premium" || user?.premiumStatus === "PRO" || user?.premiumStatus === "pro";

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <Card className={cn(
      "relative overflow-hidden p-8 text-center border-brand-blue/30 bg-brand-blue/5 space-y-6",
      className
    )}>
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Crown className="w-24 h-24 text-brand-blue" />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="p-3 rounded-2xl bg-brand-blue/20 text-brand-blue border border-brand-blue/30 shadow-xl shadow-brand-blue/10">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-white flex items-center justify-center gap-2">
            Sovereign Access Only
            <Sparkles className="w-4 h-4 text-brand-blue" />
          </h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            {feature} is reserved for those on the <span className="text-white font-bold">Sovereign Plan</span>. Unlock your full potential today.
          </p>
        </div>
      </div>

      <Link href="/premium" className="block">
        <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white font-black px-8 py-6 text-lg rounded-2xl shadow-2xl shadow-brand-blue/20 transition-all hover:scale-105 active:scale-95 group">
          Upgrade to Sovereign
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
      
      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
        Starts at ₹499/mo • Cancel Anytime
      </p>
    </Card>
  );
}
