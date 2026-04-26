"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, parseISO } from "date-fns";

interface MoneySavedChartProps {
  moneySavedData: { date: string; amount: number }[];
  currency?: string;
}

interface ChartPoint {
  date: string;
  amount: number;
}

function formatCurrency(value: number, currency: string) {
  return `${currency === "INR" ? "₹" : "$"}${value.toFixed(0)}`;
}

export default function MoneySavedChart({
  moneySavedData,
  currency = "INR",
}: MoneySavedChartProps) {
  const chartData: ChartPoint[] = React.useMemo(() => {
    if (!moneySavedData.length) {
      const now = new Date();
      const points: ChartPoint[] = [];
      for (let i = 90; i >= 0; i--) {
        const d = subDays(now, i);
        points.push({ date: format(d, "yyyy-MM-dd"), amount: 0 });
      }
      return points;
    }
    return moneySavedData;
  }, [moneySavedData]);

  return (
    <Card className="p-6 bg-white/5 border-white/10">
      <h3 className="font-heading font-medium text-white mb-5">Money Saved Over Time</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <defs>
              <linearGradient id="moneyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity="0.3" />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={(v) => format(parseISO(v), "MMM")}
              stroke="rgba(255,255,255,0.3)"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
              minTickGap={30}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCurrency(v as number, currency)}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(30,41,59,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#F8FAFC",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#3B82F6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: "#3B82F6", stroke: "#F8FAFC", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
