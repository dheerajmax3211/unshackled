"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface HabitStreakListProps {
  userId: string;
  className?: string;
}

export default function HabitStreakList({ userId, className }: HabitStreakListProps) {
  const [loading, setLoading] = useState(true);

  // Placeholder - would fetch user's habits and streaks
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [userId]);

  if (loading) {
    return (
      <Card className={cn("p-4 border border-white/10 bg-white/[0.03]", className)}>
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-white/5 rounded-lg w-32" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-lg" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-4 border border-white/10 bg-white/[0.03]", className)}>
      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
        <Flame className="w-4 h-4 text-amber-400" />
        Active Habits
      </h3>

      <div className="space-y-3">
        <div className="text-center py-8 text-slate-500 text-sm">
          <Flame className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>No habits tracked yet</p>
        </div>
      </div>
    </Card>
  );
}