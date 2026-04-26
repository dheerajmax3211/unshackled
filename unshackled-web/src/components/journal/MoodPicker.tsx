"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const MOODS = [
  { value: 1, emoji: "\u{1F62D}", label: "Devastated" },
  { value: 2, emoji: "\u{1FAE4}", label: "Awful" },
  { value: 3, emoji: "\u{1F614}", label: "Sad" },
  { value: 4, emoji: "\u{1F610}", label: "Meh" },
  { value: 5, emoji: "\u{1F642}", label: "Okay" },
  { value: 6, emoji: "\u{1F60A}", label: "Good" },
  { value: 7, emoji: "\u{1F60C}", label: "Calm" },
  { value: 8, emoji: "\u{1F600}", label: "Happy" },
  { value: 9, emoji: "\u{1F929}", label: "Amazing" },
  { value: 10, emoji: "\u{1F525}", label: "On fire" },
];

function moodColor(score: number): string {
  if (score <= 3) return "border-rose-500/50 shadow-rose-500/30";
  if (score <= 5) return "border-amber-500/50 shadow-amber-500/30";
  if (score <= 7) return "border-emerald-500/50 shadow-emerald-500/30";
  return "border-amber-400/50 shadow-amber-400/30";
}

interface MoodPickerProps {
  selected: number | null;
  onChange: (mood: number) => void;
}

export default function MoodPicker({ selected, onChange }: MoodPickerProps) {
  return (
    <div className="w-full">
      <label className="text-sm font-medium text-slate-400 mb-3 block">
        How are you feeling today?
      </label>
      <div className="flex flex-wrap items-center gap-2">
        {MOODS.map((m) => {
          const isActive = selected === m.value;
          return (
            <button
              key={m.value}
              type="button"
              onClick={() => onChange(m.value)}
              aria-label={`Mood ${m.value}: ${m.label}`}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl border-2 bg-white/5 p-2 transition-all hover:bg-white/10",
                isActive
                  ? `scale-110 border-2 ${moodColor(m.value)} shadow-lg ${moodColor(m.value)}`
                  : "border-white/10 opacity-60 hover:opacity-100"
              )}
            >
              <span className={cn("text-xl", isActive && "text-2xl transition-transform duration-150")}>
                {m.emoji}
              </span>
              <span className={cn("text-[9px] font-semibold", isActive ? "text-white" : "text-slate-500")}>
                {m.value}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
