"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Shield, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Aspirant",
    price: "0",
    description: "For those testing the waters of freedom.",
    features: [
      { name: "1 Active Habit Tracking", included: true },
      { name: "3 Accountability Partners", included: true },
      { name: "Basic Clean Streak Stats", included: true },
      { name: "Standard Daily Reminders", included: true },
      { name: "Priority Challenges", included: false },
      { name: "Neuro-Analytics Dashboard", included: false },
      { name: "Exclusive Badge Collection", included: false },
    ],
    cta: "Start Tracking",
    href: "/signup",
    popular: false
  },
  {
    name: "Sovereign",
    price: "499",
    description: "For those who refuse to lose.",
    features: [
      { name: "Unlimited Habit Tracking", included: true },
      { name: "Unlimited Accountability Partners", included: true },
      { name: "Full Neuro-Analytics Suite", included: true },
      { name: "Priority Verification Challenges", included: true },
      { name: "Exclusive Sovereign Badges", included: true },
      { name: "Ad-Free Immersive Experience", included: true },
      { name: "Priority Support Access", included: true },
    ],
    cta: "Reclaim Sovereignty",
    href: "/signup?plan=sovereign",
    popular: true
  }
];

export default function LandingPricing() {
  return (
    <section id="pricing" className="py-24 md:py-40 max-w-7xl mx-auto px-6 space-y-20 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-blue/5 blur-[120px] -z-10 rounded-full" />
      
      <div className="text-center space-y-6">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          INVEST IN YOUR <span className="text-brand-blue">FUTURE SELF.</span>
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          The cost of dependency is far higher than the price of freedom. Choose your plan and start your revolution today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {PLANS.map((plan) => (
          <Card 
            key={plan.name} 
            className={cn(
              "relative p-8 md:p-12 transition-all duration-500 overflow-hidden group",
              plan.popular 
                ? "bg-white/[0.05] border-brand-blue/50 shadow-2xl shadow-brand-blue/10 scale-105 z-10" 
                : "bg-white/[0.02] border-white/10 scale-100"
            )}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 px-6 py-2 bg-brand-blue text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
                Most Powerful
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-500">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-6xl font-black text-white">₹{plan.price}</span>
                <span className="text-slate-600 font-bold uppercase tracking-widest text-xs">/ Month</span>
              </div>

              <div className="space-y-4 pt-6">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {feature.included ? (
                      <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-500">
                        <Check className="w-3 h-3" />
                      </div>
                    ) : (
                      <div className="p-1 rounded-full bg-rose-500/20 text-rose-500">
                        <X className="w-3 h-3" />
                      </div>
                    )}
                    <span className={cn(
                      "text-sm font-medium",
                      feature.included ? "text-slate-300" : "text-slate-600"
                    )}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <Link href={plan.href} className="block pt-8">
                <Button 
                  className={cn(
                    "w-full h-14 text-lg font-black rounded-xl transition-all",
                    plan.popular 
                      ? "bg-brand-blue hover:bg-brand-blue/90 text-white" 
                      : "bg-white/10 hover:bg-white/20 text-white"
                  )}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center pt-10">
        <p className="text-sm text-slate-600 font-medium">
          Need a custom plan for your organization or clinic? <Link href="#" className="text-brand-blue hover:underline">Contact us</Link>.
        </p>
      </div>
    </section>
  );
}
