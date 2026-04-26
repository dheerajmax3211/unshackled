"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Hand, X, Info } from "lucide-react";
import { WithdrawalMessage as WithdrawalMessageType } from "@/lib/api/types";

interface WithdrawalMessageProps {
  message: WithdrawalMessageType | undefined;
}

export default function WithdrawalMessage({ message }: WithdrawalMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!message || !isVisible) return null;

  return (
    <Card className="relative p-6 bg-rose-500/10 border-rose-500/20 animate-in zoom-in duration-500">
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-rose-500/40 hover:text-rose-500 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center shrink-0 border border-rose-500/30">
          <Hand className="w-6 h-6 text-rose-500" />
        </div>
        <div className="space-y-1 pr-6">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-rose-400">Day {message.dayOffset} Insights</h4>
            <span className="text-[10px] bg-rose-500/20 text-rose-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {message.phase}
            </span>
          </div>
          <p className="text-white text-sm font-medium leading-relaxed italic">
            &quot;{message.message}&quot;
          </p>
          <div className="flex items-center gap-1.5 pt-2">
            <Info className="w-3 h-3 text-rose-500/60" />
            <p className="text-[10px] text-slate-500 font-medium">
              This message is specifically curated for your current stage of recovery.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
