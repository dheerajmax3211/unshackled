"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { IndianRupee, TrendingDown, ArrowUpRight } from "lucide-react";
import { animate } from "framer-motion";
import { cn } from "@/lib/utils";

interface MoneyPanelProps {
  today: number;
  thisWeek: number;
  thisMonth: number;
  allTime: number;
}

const MoneyItem = ({ label, value, colorClass }: { label: string, value: number, colorClass: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (v) => setDisplayValue(Math.floor(v))
    });
    return () => controls.stop();
  }, [value]);

  return (
    <div className={cn("p-6 rounded-2xl border transition-all duration-300", colorClass)}>
      <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">{label}</p>
      <div className="flex items-center gap-1">
        <IndianRupee className="w-4 h-4" />
        <span className="text-2xl font-display font-black tracking-tight">
          {displayValue.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default function MoneyPanel({ today, thisWeek, thisMonth, allTime }: MoneyPanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-brand-blue" />
          Money Reclaimed
        </h3>
        <span className="text-xs text-slate-500 font-medium">Auto-calculated from habit costs</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MoneyItem 
          label="Saved Today" 
          value={today} 
          colorClass="bg-brand-blue/5 border-brand-blue/10 text-brand-blue" 
        />
        <MoneyItem 
          label="This Week" 
          value={thisWeek} 
          colorClass="bg-indigo-500/5 border-indigo-500/10 text-indigo-400" 
        />
        <MoneyItem 
          label="This Month" 
          value={thisMonth} 
          colorClass="bg-violet-500/5 border-violet-500/10 text-violet-400" 
        />
        <MoneyItem 
          label="Total Saved" 
          value={allTime} 
          colorClass="bg-emerald-500/5 border-emerald-500/10 text-emerald-400" 
        />
      </div>

      <Card className="p-6 bg-brand-blue/10 border-brand-blue/20 flex items-center justify-between group cursor-pointer hover:bg-brand-blue/15 transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-blue text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-white font-bold">Invest your savings</p>
            <p className="text-slate-400 text-xs">See what ₹{allTime.toLocaleString()} could grow into in 10 years.</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full border border-brand-blue/20 flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-all">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </Card>
    </div>
  );
}
