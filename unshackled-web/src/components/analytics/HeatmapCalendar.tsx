"use client";

import React, { useMemo } from "react";
// @ts-expect-error — no type declarations available for this package
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Card } from "@/components/ui/card";
import { format, subDays } from "date-fns";

interface HeatmapDayValue {
  date: string;
  count: number;
}

interface HeatmapCalendarProps {
  checkIns: { date: string; status: "clean" | "slipped" }[];
  title?: string;
}

export default function HeatmapCalendar({
  checkIns,
  title = "Your journey so far",
}: HeatmapCalendarProps) {
  const values = useMemo((): HeatmapDayValue[] => {
    const last6Months: HeatmapDayValue[] = [];
    const now = new Date();
    for (let i = 180; i >= 0; i--) {
      const d = subDays(now, i);
      const dateStr = format(d, "yyyy-MM-dd");
      const entry = checkIns.find((c) => c.date === dateStr);
      let count = 0;
      if (entry?.status === "clean") count = 1;
      else if (entry?.status === "slipped") count = -1;
      last6Months.push({ date: dateStr, count });
    }
    return last6Months;
  }, [checkIns]);

  return (
    <Card className="p-6 bg-white/5 border-white/10">
      <h3 className="font-heading font-medium text-white mb-4">{title}</h3>
      <style jsx global>{`
        .react-calendar-heatmap .color-empty {
          fill: rgba(255, 255, 255, 0.04);
        }
        .react-calendar-heatmap .color-scale-1 {
          fill: #10b981;
        }
        .react-calendar-heatmap .color-scale-negative-1 {
          fill: #f43f5e;
        }
        .react-calendar-heatmap text {
          fill: rgba(255, 255, 255, 0.3);
          font-size: 8px;
        }
        .react-calendar-heatmap rect {
          rx: 2px;
          ry: 2px;
        }
      `}</style>
      <CalendarHeatmap
        startDate={subDays(new Date(), 180)}
        endDate={new Date()}
        values={values}
        classForValue={(value: HeatmapDayValue | null) => {
          if (!value) return "color-empty";
          if (value.count === 1) return "color-scale-1";
          if (value.count === -1) return "color-scale-negative-1";
          return "color-empty";
        }}
        tooltipDataAttr={(value: HeatmapDayValue | null) => (value ? value.date : "")}
        tooltipFunc={(value: HeatmapDayValue | null) => {
          const dateStr = value ? value.date : "";
          const entry = checkIns.find((c) => c.date === dateStr);
          if (entry?.status === "clean") return `${dateStr} — Clean`;
          if (entry?.status === "slipped") return `${dateStr} — Slipped`;
          return dateStr || "";
        }}
        showWeekdayLabels
      />
      <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-[#10b981]" />
          Clean
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-[#f43f5e]" />
          Slipped
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-white/[0.04] border border-white/10" />
          No data
        </span>
      </div>
    </Card>
  );
}
