"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Flame, Trophy, Calendar, CheckCircle, Coins } from "lucide-react";

interface StreakStatsCardProps {
  currentStreak: number;
  longestStreak: number;
  totalCleanDays: number;
  totalMoneySaved: number;
  checkInRate: number;
  currency?: string;
}

function formatMoney(value: number, currency: string) {
  return `${currency === "INR" ? "₹" : "$"}${value.toLocaleString()}`;
}

interface StatItem {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

export default function StreakStatsCard({
  currentStreak,
  longestStreak,
  totalCleanDays,
  totalMoneySaved,
  checkInRate,
  currency = "INR",
}: StreakStatsCardProps) {
  const stats: StatItem[] = [
    {
      label: "Current Streak",
      value: `${currentStreak} days`,
      icon: <Flame className="w-4 h-4" />,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
    },
    {
      label: "Longest Streak",
      value: `${longestStreak} days`,
      icon: <Trophy className="w-4 h-4" />,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
    },
    {
      label: "Total Clean Days",
      value: `${totalCleanDays}`,
      icon: <Calendar className="w-4 h-4" />,
      color: "text-brand-blue",
      bgColor: "bg-brand-blue/10",
    },
    {
      label: "Money Saved",
      value: formatMoney(totalMoneySaved, currency),
      icon: <Coins className="w-4 h-4" />,
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10",
    },
    {
      label: "Check-in Rate",
      value: `${checkInRate.toFixed(0)}%`,
      icon: <CheckCircle className="w-4 h-4" />,
      color: "text-rose-400",
      bgColor: "bg-rose-400/10",
    },
  ];

  return (
    <Card className="p-6 bg-white/5 border-white/10">
      <h3 className="font-heading font-medium text-white mb-5">Streak Stats</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center text-center p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-2 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-lg font-bold text-white">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
