"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { format, parseISO } from "date-fns";

interface MoodTrendChartProps {
  moodScores: { date: string; score: number }[];
}

interface ChartPoint {
  date: string;
  label: string;
  score: number;
}

const moodEmojis: Record<number, string> = {
  1: "\u{1F62D}",
  2: "\u{1FAE4}",
  3: "\u{1F614}",
  4: "\u{1F610}",
  5: "\u{1F642}",
  6: "\u{1F60A}",
  7: "\u{1F60C}",
  8: "\u{1F600}",
  9: "\u{1F929}",
  10: "\u{1F525}",
};

function getMoodColor(score: number): string {
  if (score <= 3) return "#f43f5e";
  if (score <= 5) return "#f59e0b";
  if (score <= 7) return "#10b981";
  return "#22d3ee";
}

export default function MoodTrendChart({ moodScores }: MoodTrendChartProps) {
  const chartData: ChartPoint[] = useMemo(() => {
    if (!moodScores.length) return [];
    return moodScores
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30)
      .map((entry) => ({
        date: entry.date,
        label: format(parseISO(entry.date), "MMM d"),
        score: entry.score,
      }));
  }, [moodScores]);

  return (
    <Card className="p-6 bg-white/5 border-white/10">
      <h3 className="font-heading font-medium text-white mb-2">Mood Over Time</h3>
      <p className="text-sm text-slate-500 mb-5">
        Your daily journal mood scores over the last month
      </p>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              stroke="rgba(255,255,255,0.3)"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              interval={3}
            />
            <YAxis
              domain={[0, 10]}
              tick={{ fontSize: 11, stroke: "rgba(255,255,255,0.3)", strokeWidth: 0 }}
              tickLine={false}
              tickFormatter={(v) => moodEmojis[v as number] || ""}
              axisLine={false}
              width={40}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.score > 0 ? getMoodColor(entry.score) : "rgba(255,255,255,0.04)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
