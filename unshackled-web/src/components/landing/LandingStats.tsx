import React from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Wallet, Trophy } from "lucide-react";

export default function LandingStats() {
  return (
    <section id="stats" className="py-24 md:py-32 bg-white/[0.02] border-y border-white/5 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-20 opacity-5 rotate-12">
        <TrendingUp className="w-96 h-96 text-brand-blue" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div className="space-y-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            THE NUMBERS OF <br />
            <span className="text-brand-blue">ABSOLUTE VICTORY.</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Every day, thousands of people use Unshackled to take back control of their lives. Our platform isn&apos;t just about avoiding bad habits; it&apos;s about building a legacy of discipline.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500">
                <Trophy className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-slate-300">98.2% Completion rate for first-month challenges.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-brand-blue/20 text-brand-blue">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-slate-300">Average squad size: 4 active accountability partners.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <Card className="p-8 bg-white/[0.03] border-white/10 space-y-4">
            <p className="text-4xl font-black text-white tracking-tighter">₹45K</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Avg. Annual Savings</p>
            <p className="text-xs text-slate-600">Based on smoking cessation data across our user base.</p>
          </Card>
          <Card className="p-8 bg-brand-blue/10 border-brand-blue/20 space-y-4">
            <p className="text-4xl font-black text-brand-blue tracking-tighter">2.5M+</p>
            <p className="text-xs font-bold text-brand-blue/70 uppercase tracking-widest">Dopamine Resets</p>
            <p className="text-xs text-brand-blue/50">Successful clean check-ins recorded since launch.</p>
          </Card>
          <Card className="p-8 bg-white/[0.03] border-white/10 space-y-4">
            <p className="text-4xl font-black text-white tracking-tighter">180</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Average Clean Days</p>
            <p className="text-xs text-slate-600">For users who stay active for more than 3 months.</p>
          </Card>
          <Card className="p-8 bg-white/[0.03] border-white/10 space-y-4">
            <p className="text-4xl font-black text-white tracking-tighter">15+</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Habit Types</p>
            <p className="text-xs text-slate-600">From digital addiction to physical dependency.</p>
          </Card>
        </div>
      </div>
    </section>
  );
}
