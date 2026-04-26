"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Sparkles, Map, Gift, ShoppingBag, Utensils, Plane } from "lucide-react";

interface MoneySuggestionProps {
  totalSaved: number;
}

const SUGGESTIONS = [
  { threshold: 500, text: "a premium Netflix subscription", icon: ShoppingBag },
  { threshold: 1500, text: "a nice dinner for two at a top restaurant", icon: Utensils },
  { threshold: 5000, text: "a weekend getaway to a nearby hill station", icon: Map },
  { threshold: 12000, text: "a new pair of high-end sneakers", icon: Gift },
  { threshold: 25000, text: "a luxury staycation in your city", icon: Plane },
  { threshold: 50000, text: "a cross-country road trip with friends", icon: Map },
  { threshold: 100000, text: "a down payment on a new vehicle", icon: ShoppingBag },
];

export default function MoneySuggestion({ totalSaved }: MoneySuggestionProps) {
  // Find the highest suggestion that the user can afford with their savings
  const suggestion = useMemo(() => {
    const affordable = SUGGESTIONS.filter(s => s.threshold <= totalSaved);
    if (affordable.length === 0) return null;
    // Pick the most relevant one (the closest threshold)
    return affordable[affordable.length - 1];
  }, [totalSaved]);

  if (!suggestion) {
    return (
      <Card className="p-6 bg-white/5 border-dashed border-white/10 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-slate-600" />
        </div>
        <p className="text-slate-500 text-sm italic">
          Keep saving to see what your clean days can buy.
        </p>
      </Card>
    );
  }

  const Icon = suggestion.icon;

  return (
    <Card className="p-6 bg-brand-blue/5 border-brand-blue/20 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 flex items-center justify-center border border-brand-blue/30 shadow-lg shadow-brand-blue/10">
        <Icon className="w-6 h-6 text-brand-blue" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-blue mb-0.5">
          Clean Money Potential
        </p>
        <p className="text-white text-sm font-medium leading-relaxed">
          Your savings of ₹{totalSaved.toLocaleString()} could have paid for <span className="text-brand-blue font-bold">{suggestion.text}</span>.
        </p>
      </div>
    </Card>
  );
}
