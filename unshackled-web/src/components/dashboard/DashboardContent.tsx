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
  
  // Default fallback data for a clean first-time view
  const dashboard = initialData || {
    habits: [],
    totalSavedToday: 0,
    totalSavedWeek: 0,
    totalSavedMonth: 0,
    totalSavedAllTime: 0,
    level: 1,
    levelName: "Novice",
    currentXp: 0,
    nextLevelXp: 100,
    withdrawalMessage: null,
    dopamineSuggestions: []
  };

  const activeHabit = dashboard.habits && dashboard.habits.length > 0 
    ? dashboard.habits[0] 
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 space-y-12 pb-12">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Feed (Left) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Action Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {activeHabit ? (
                <>
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
                    {dashboard.todayMessage && (
                      <WithdrawalMessage message={dashboard.todayMessage} />
                    )}
                  </div>
                </>
              ) : (
                <Card className="col-span-2 p-12 bg-white/5 border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20">
                    <ShieldCheck className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No Habits Tracked</h3>
                  <p className="text-slate-400 mb-6 max-w-md">
                    Finish your onboarding to start tracking your progress and saving money.
                  </p>
                  <Button onClick={() => router.push("/onboarding")} className="bg-amber-500 text-black hover:bg-amber-600 font-bold">
                    Complete Onboarding
                  </Button>
                </Card>
              )}
            </div>

            {/* Progress Visualization */}
            {activeHabit && <HealthTimeline currentDays={activeHabit.currentStreak} />}

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

      {activeHabit && (
        <SlipFlow 
          isOpen={isSlipOpen}
          onClose={() => setIsSlipOpen(false)}
          userHabitId={activeHabit.userHabitId}
          habitName={activeHabit.habitName}
        />
      )}
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
