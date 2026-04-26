"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Flame, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { LeaderboardEntry } from "@/lib/api/types";

interface FriendLeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  className?: string;
}

export default function FriendLeaderboard({
  entries,
  currentUserId,
  className,
}: FriendLeaderboardProps) {
  if (entries.length === 0) {
    return (
      <Card
        className={cn(
          "p-6 border border-white/10 bg-white/[0.03] text-center",
          className
        )}
      >
        <p className="text-sm text-slate-500">
          Add friends to see how you stack up!
        </p>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "border border-white/10 bg-white/[0.03] overflow-hidden",
        className
      )}
    >
      <div className="p-4 border-b border-white/10">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          Friend Leaderboard
        </h3>
      </div>

      <div className="divide-y divide-white/5">
        {entries.map((entry, index) => {
          const isCurrentUser = entry.userId === currentUserId;
          const rankColor =
            index === 0
              ? "text-amber-400"
              : index === 1
                ? "text-slate-300"
                : index === 2
                  ? "text-amber-700"
                  : "text-slate-500";

          return (
            <div
              key={entry.userId}
              className={cn(
                "flex items-center gap-4 p-3 transition-all",
                isCurrentUser && "bg-brand-blue/5"
              )}
            >
              {/* Rank */}
              <div className={cn("text-lg font-black w-8 text-center shrink-0", rankColor)}>
                {index + 1}
              </div>

              {/* Avatar */}
              <Avatar className="w-10 h-10 border border-white/10 shrink-0">
                <AvatarImage src={entry.avatarUrl || ""} />
                <AvatarFallback className="bg-brand-blue/20 text-brand-blue font-bold text-xs">
                  {entry.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Name + Stats */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      "text-sm font-semibold truncate",
                      isCurrentUser ? "text-brand-blue" : "text-white"
                    )}
                  >
                    {entry.username}
                    {isCurrentUser && " (You)"}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400" />
                    {entry.totalCleanDays} clean days
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-brand-blue" />
                    {entry.totalXp} XP
                  </span>
                </div>
              </div>

              {/* Level badge */}
              <div className="shrink-0 text-center">
                <div className="text-xs font-bold text-slate-400 bg-white/5 px-2 py-1 rounded-full">
                  Lv {entry.level}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}