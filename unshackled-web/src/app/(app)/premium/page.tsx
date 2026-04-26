"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Shield, Zap, Users, BarChart3, Crown, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import PricingTable from "@/components/premium/PricingTable"; // To be created in F-13.2
import { useCheckout } from "@/hooks/useCheckout"; // To be created in F-13.3

export default function PremiumPage() {
  const { handleCheckout, loading } = useCheckout();

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-700">
          <Crown className="w-3.5 h-3.5" />
          The Sovereign Plan
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
          Reclaim your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">absolute freedom.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The Free version is for starting. The <span className="text-white font-semibold">Sovereign Plan</span> is for finishing. Unlock everything you need to break the chains forever.
        </p>
      </div>

      {/* Pricing/Comparison Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-brand-blue/5 blur-[120px] rounded-full -z-10" />
        <PricingTable onUpgrade={() => handleCheckout()} loading={loading} />
      </div>

      {/* Testimonials Placeholder */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-white text-center flex items-center justify-center gap-3">
          <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
          What Sovereign Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "The unlimited friends and priority challenges made all the difference. I didn't feel alone this time.",
              author: "Alex R.",
              days: "142 Days Clean"
            },
            {
              quote: "Advanced analytics showed me exactly what my triggers were. I've saved ₹45,000 in 3 months.",
              author: "Priya K.",
              days: "90 Days Clean"
            },
            {
              quote: "The exclusive badges and community support keep me motivated. Sovereign is an investment in myself.",
              author: "Michael S.",
              days: "210 Days Clean"
            }
          ].map((t, i) => (
            <Card key={i} className="p-6 bg-white/[0.03] border-white/10 space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
              </div>
              <p className="text-slate-300 italic text-sm leading-relaxed">&quot;{t.quote}&quot;</p>
              <div>
                <p className="text-sm font-bold text-white">{t.author}</p>
                <p className="text-xs text-brand-blue font-medium">{t.days}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <Card className="p-8 md:p-12 bg-gradient-to-br from-brand-blue/20 to-cyan-500/10 border-brand-blue/30 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles className="w-32 h-32 text-white" />
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-white">Ready to be Sovereign?</h3>
        <p className="text-slate-400 max-w-xl mx-auto">
          Join 5,000+ others who have taken total control of their lives. No hidden fees, cancel anytime.
        </p>
        <Button 
          onClick={() => handleCheckout()} 
          disabled={loading}
          className="bg-brand-blue hover:bg-brand-blue/90 text-white px-10 py-6 text-lg font-black rounded-full transition-all hover:scale-105 active:scale-95"
        >
          {loading ? "Preparing Checkout..." : "Get Sovereign Access Now"}
        </Button>
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          SECURE PAYMENTS POWERED BY STRIPE
        </p>
      </Card>
    </div>
  );
}
