import React from "react";
import { Metadata } from "next";
import { format, subDays } from "date-fns";
import HeatmapCalendar from "@/components/analytics/HeatmapCalendar";
import MoneySavedChart from "@/components/analytics/MoneySavedChart";
import StreakStatsCard from "@/components/analytics/StreakStatsCard";
import MoodTrendChart from "@/components/analytics/MoodTrendChart";

export const metadata: Metadata = {
  title: "Analytics | Unshackled",
  description: "Track your progress, savings, and mood over time.",
};

export default function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ habit?: string }>;
}) {
  const { habit } = React.use(searchParams);

  // Generate placeholder data for the UI
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em]">Analytics</h1>
        <h2 className="text-2xl font-heading font-bold text-white mt-1">Your Journey in Numbers</h2>
      </div>

      {/* Habit selector tabs */}
      <div className="flex gap-3">
        {habit ? (
          <span className="rounded-full bg-brand-blue/20 text-brand-blue text-sm font-semibold px-4 py-2 border border-brand-blue/20">
            Active Habit
          </span>
        ) : (
          <span className="rounded-full bg-white/5 text-slate-400 text-sm font-semibold px-4 py-2 border border-white/10">
            No habit selected
          </span>
        )}
      </div>

      {/* Stats cards */}
      <StreakStatsCard
        currentStreak={14}
        longestStreak={14}
        totalCleanDays={14}
        totalMoneySaved={2520}
        checkInRate={95}
      />

      {/* Chart grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="col-span-1 lg:col-span-2">
          <HeatmapCalendar
            checkIns={[]}
            title="Last 6 months — clean days"
          />
        </div>
        <MoneySavedChart
          moneySavedData={[]}
          currency={habit ? "INR" : "INR"}
        />
        <MoodTrendChart moodScores={[]} />
      </div>
    </div>
  );
}
