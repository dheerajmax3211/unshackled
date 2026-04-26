"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { BadgeStatus } from "@/lib/api/types";
import { getBadges } from "@/lib/api/badges";

interface BadgeGridProps {
  userId: string;
  className?: string;
}

const RARITY_COLORS: Record<string, string> = {
  COMMON: "bg-slate-500/20 border-slate-500/30 text-slate-400",
  RARE: "bg-blue-500/20 border-blue-500/30 text-blue-400",
  EPIC: "bg-purple-500/20 border-purple-500/30 text-purple-400",
  LEGENDARY: "bg-amber-500/20 border-amber-500/30 text-amber-400",
};

export default function BadgeGrid({ userId, className }: BadgeGridProps) {
  const [badges, setBadges] = useState<BadgeStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const allBadges = await getBadges();
        setBadges(allBadges);
      } catch (error) {
        console.error("Failed to fetch badges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [userId]);

  if (loading) {
    return (
      <Card className={cn("p-4 border border-white/10 bg-white/[0.03]", className)}>
        <div className="animate-pulse grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-white/5 rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-4 border border-white/10 bg-white/[0.03]", className)}>
      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
        Achievements ({badges.filter((b) => b.earned).length}/{badges.length})
      </h3>

      <div className="grid grid-cols-3 gap-3">
        {badges.map((badgeStatus) => (
          <div
            key={badgeStatus.badge.id}
            className={cn(
              "flex flex-col items-center p-3 rounded-xl border transition-all",
              badgeStatus.earned
                ? cn("bg-white/5 border-white/10", RARITY_COLORS[badgeStatus.badge.rarity])
                : "bg-white/[0.02] border-white/5 opacity-50"
            )}
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2 relative">
              {badgeStatus.earned ? (
                <span className="text-lg">{badgeStatus.badge.imageUrl || "🏆"}</span>
              ) : (
                <Lock className="w-4 h-4 text-slate-500" />
              )}
            </div>
            <p
              className={cn(
                "text-xs font-semibold text-center truncate w-full",
                badgeStatus.earned ? "text-white" : "text-slate-500"
              )}
            >
              {badgeStatus.badge.name}
            </p>
            {badgeStatus.earned && (
              <UIBadge
                variant="outline"
                className={cn(
                  "text-[9px] mt-1",
                  RARITY_COLORS[badgeStatus.badge.rarity]
                )}
              >
                {badgeStatus.badge.rarity}
              </UIBadge>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}