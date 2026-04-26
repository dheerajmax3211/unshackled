"use client";

import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import StreakCard from "./StreakCard";
import CheckInButton from "./CheckInButton";
import SlipFlow from "./SlipFlow";
import MoneyPanel from "./MoneyPanel";
import MoneySuggestion from "./MoneySuggestion";
import HealthTimeline from "./HealthTimeline";
import WithdrawalMessage from "./WithdrawalMessage";
import DopamineSuggestions from "./DopamineSuggestions";
import XPBar from "./XPBar";
import GlobalStatsBar from "./GlobalStatsBar";

import { DashboardSummary } from "@/lib/api/types";
import { Card } from "@/components/ui/card";
import { Zap, ShieldCheck, Flame, Trophy } from "lucide-react";

interface DashboardContentProps {
  initialData: DashboardSummary | null;
}

export default function DashboardContent({ initialData }: DashboardContentProps) {
  const [isSlipOpen, setIsSlipOpen] = useState(false);
  
  // Default fallback data for a polished first-time view if API is not available
  const dashboard = initialData || {
    habits: [{
      userHabitId: "demo-habit",
      habitName: "Smoking",
      habitIcon: "🚬",
      currentStreak: 12,
    }],
    totalSavedToday: 180,
    totalSavedWeek: 1260,
    totalSavedMonth: 5400,
    totalSavedAllTime: 12400,
    level: 5,
    levelName: "Iron Will",
    currentXp: 1450,
    nextLevelXp: 2000,
    withdrawalMessage: {
      id: "demo-msg",
      habitId: "demo-habit",
      dayOffset: 12,
      phase: "Stabilization",
      message: "Your nicotine receptors are starting to downregulate. The mental fog is lifting.",
      tone: "EMPATHETIC",
      createdAt: new Date().toISOString()
    },
    dopamineSuggestions: [
      { id: "1", title: "Quick HIIT", description: "5 minutes of jumping jacks to reset your pulse.", iconType: "exercise", activity: "Jumping Jacks", category: "Physical", durationMinutes: 5, intensity: "HIGH" },
      { id: "2", title: "Lofi Beats", description: "Put on your headphones and focus on the bass.", iconType: "music", activity: "Listening to music", category: "Entertainment", durationMinutes: 15, intensity: "LOW" },
      { id: "3", title: "Cold Water", description: "Splash your face with ice cold water for an instant reset.", iconType: "default", activity: "Cold splash", category: "Self-care", durationMinutes: 1, intensity: "MEDIUM" }
    ]
  };

  const activeHabit = dashboard.habits[0];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 space-y-12 pb-12">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Feed (Left) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Action Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <StreakCard 
                habitName={activeHabit.habitName}
                streakDays={activeHabit.currentStreak}
                habitColor="amber"
              />
              <div className="space-y-6">
                <CheckInButton 
                  userHabitId={activeHabit.userHabitId}
                  habitName={activeHabit.habitName}
                  currentStreak={activeHabit.currentStreak}
                  onSlip={() => setIsSlipOpen(true)}
                />
                <WithdrawalMessage message={dashboard.withdrawalMessage} />
              </div>
            </div>

            {/* Progress Visualization */}
            <HealthTimeline currentDays={activeHabit.currentStreak} />

            <div className="space-y-8">
              <MoneyPanel 
                today={dashboard.totalSavedToday}
                thisWeek={dashboard.totalSavedWeek}
                thisMonth={dashboard.totalSavedMonth}
                allTime={dashboard.totalSavedAllTime}
              />
              <MoneySuggestion totalSaved={dashboard.totalSavedAllTime} />
            </div>

            <DopamineSuggestions initialSuggestions={dashboard.dopamineSuggestions} />
          </div>

          {/* Sidebar (Right) */}
          <div className="space-y-8">
            <Card className="p-8 bg-gradient-to-br from-indigo-500/10 to-brand-blue/10 border-white/10 space-y-6 overflow-hidden relative group">
              <XPBar 
                currentLevel={dashboard.level}
                levelName={dashboard.levelName}
                currentXp={dashboard.currentXp}
                nextLevelXp={dashboard.nextLevelXp}
              />
              <div className="pt-4 border-t border-white/5">
                 <div className="flex items-center justify-between mb-4">
                    <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Recent Achievements</h5>
                    <Trophy className="w-4 h-4 text-amber-400" />
                 </div>
                 <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center grayscale hover:grayscale-0 transition-all cursor-help">
                        <Award className="w-5 h-5 text-brand-blue" />
                      </div>
                    ))}
                 </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/5 border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-blue/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-brand-blue" />
                </div>
                <h4 className="font-bold text-white">The Spark</h4>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed italic">
                &quot;The secret of getting ahead is getting started. Don&apos;t look at the mountain, look at your next step.&quot;
              </p>
            </Card>

            <Card className="p-6 bg-emerald-500/5 border-emerald-500/10 space-y-4">
               <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h4 className="font-bold text-white">Accountability</h4>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Your supporter, <span className="text-white font-bold">Coach Alex</span>, is active. Your last clean check-in has been shared.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Persistent Bottom Bar */}
      <GlobalStatsBar />

      <SlipFlow 
        isOpen={isSlipOpen}
        onClose={() => setIsSlipOpen(false)}
        userHabitId={activeHabit.userHabitId}
        habitName={activeHabit.habitName}
      />
    </div>
  );
}

// Sub-component for achievements placeholder
function Award({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}
