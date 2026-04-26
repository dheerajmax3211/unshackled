"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingTableProps {
  onUpgrade: () => void;
  loading: boolean;
}

export default function PricingTable({ onUpgrade, loading }: PricingTableProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      {/* Free Plan */}
      <Card className="p-8 bg-white/5 border-white/10 opacity-80 scale-95 origin-right">
        <h3 className="text-xl font-bold text-white mb-2">Free</h3>
        <p className="text-4xl font-black text-white mb-6">₹0<span className="text-sm font-medium text-slate-500">/mo</span></p>
        <ul className="space-y-4 mb-8">
          <FeatureItem included>1 Active Habit</FeatureItem>
          <FeatureItem included>3 Friends Limit</FeatureItem>
          <FeatureItem included>Basic Analytics</FeatureItem>
          <FeatureItem included={false}>Priority Challenges</FeatureItem>
          <FeatureItem included={false}>Exclusive Badges</FeatureItem>
        </ul>
        <Button variant="outline" disabled className="w-full">Current Plan</Button>
      </Card>

      {/* Sovereign Plan */}
      <Card className="p-8 bg-white/[0.05] border-brand-blue/50 shadow-2xl shadow-brand-blue/10 relative z-10">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest rounded-full">
          Most Powerful
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Sovereign</h3>
        <p className="text-4xl font-black text-white mb-1">₹499<span className="text-sm font-medium text-slate-500">/mo</span></p>
        <p className="text-xs text-brand-blue font-bold mb-6 uppercase tracking-wider">Save 25% with annual billing</p>
        <ul className="space-y-4 mb-8">
          <FeatureItem included>Unlimited Habits</FeatureItem>
          <FeatureItem included>Unlimited Friends</FeatureItem>
          <FeatureItem included>Advanced Analytics</FeatureItem>
          <FeatureItem included>Priority Challenges</FeatureItem>
          <FeatureItem included>Exclusive Badges</FeatureItem>
          <FeatureItem included>Ad-Free Experience</FeatureItem>
        </ul>
        <Button 
          onClick={onUpgrade} 
          disabled={loading}
          className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-black h-12"
        >
          {loading ? "Processing..." : "Upgrade Now"}
        </Button>
      </Card>
    </div>
  );
}

function FeatureItem({ children, included }: { children: React.ReactNode; included: boolean }) {
  return (
    <li className="flex items-center gap-3">
      {included ? (
        <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-500">
          <Check className="w-3 h-3" />
        </div>
      ) : (
        <div className="p-1 rounded-full bg-rose-500/20 text-rose-500">
          <X className="w-3 h-3" />
        </div>
      )}
      <span className={cn("text-sm", included ? "text-slate-300" : "text-slate-500")}>{children}</span>
    </li>
  );
}
