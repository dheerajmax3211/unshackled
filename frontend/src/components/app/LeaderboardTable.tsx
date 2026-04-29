"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Users, Globe, Crown, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface LeaderboardEntry {
  userId: string;
  username: string;
  avatarUrl: string;
  totalCleanDays: number;
  longestStreak: number;
  totalXp: number;
  level: number;
  rank: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
  className?: string;
}

type Tab = "friends" | "global";

function getRankBadge(rank: number) {
  if (rank === 1)
    return (
      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
        <Crown className="w-4 h-4 text-amber-400" />
      </div>
    );
  if (rank === 2)
    return (
      <div className="w-8 h-8 rounded-full bg-slate-300/20 border border-slate-300/40 flex items-center justify-center">
        <Medal className="w-4 h-4 text-slate-300" />
      </div>
    );
  if (rank === 3)
    return (
      <div className="w-8 h-8 rounded-full bg-amber-700/20 border border-amber-700/40 flex items-center justify-center">
        <Medal className="w-4 h-4 text-amber-700" />
      </div>
    );
  return (
    <span className="w-8 h-8 flex items-center justify-center text-body-sm font-semibold text-text-muted">
      {rank}
    </span>
  );
}

export function LeaderboardTable({
  entries,
  currentUserId,
  className,
}: LeaderboardTableProps) {
  const [tab, setTab] = useState<Tab>("global");

  return (
    <GlassCard glow="amber" padding="lg" className={cn(className)}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-amber/15 border border-brand-amber/30 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-brand-amber" />
            </div>
            <h3 className="text-heading-sm text-text-primary">Leaderboard</h3>
          </div>
          <div className="flex gap-1 p-1 bg-white/[0.03] rounded-glass-sm">
            <button
              onClick={() => setTab("friends")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-caption font-medium transition-all",
                tab === "friends"
                  ? "bg-brand-amber/15 text-brand-amber-light"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              <Users className="w-3.5 h-3.5" />
              Friends
            </button>
            <button
              onClick={() => setTab("global")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-caption font-medium transition-all",
                tab === "global"
                  ? "bg-brand-amber/15 text-brand-amber-light"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              <Globe className="w-3.5 h-3.5" />
              Global
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-[48px_1fr_80px_60px_48px] items-center gap-2 px-2 py-2 text-caption text-text-subtle border-b border-white/[0.04]">
            <span className="text-center">#</span>
            <span>User</span>
            <span className="text-center">Days</span>
            <span className="text-center">XP</span>
            <span className="text-center">Lvl</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              {entries.map((entry) => {
                const isCurrentUser = entry.userId === currentUserId;
                return (
                  <motion.div
                    key={entry.userId}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: entry.rank * 0.05 }}
                    className={cn(
                      "grid grid-cols-[48px_1fr_80px_60px_48px] items-center gap-2 px-2 py-3 rounded-glass-sm transition-all",
                      isCurrentUser && "bg-brand-amber/10 border border-brand-amber/20"
                    )}
                  >
                    <div className="flex justify-center">{getRankBadge(entry.rank)}</div>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar className="w-8 h-8 rounded-full flex-shrink-0">
                        <AvatarImage src={entry.avatarUrl} />
                        <AvatarFallback className="bg-brand-amber/20 text-brand-amber-light text-caption">
                          {entry.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p
                          className={cn(
                            "text-body-sm font-semibold truncate",
                            isCurrentUser ? "text-brand-amber-light" : "text-text-primary"
                          )}
                        >
                          {entry.username}
                        </p>
                        <p className="text-caption text-text-subtle truncate">
                          Best: {entry.longestStreak}d
                        </p>
                      </div>
                    </div>
                    <span className="text-center text-body-sm text-text-secondary font-semibold tabular-nums">
                      {entry.totalCleanDays}
                    </span>
                    <span className="text-center text-body-sm text-text-muted tabular-nums">
                      {entry.totalXp.toLocaleString()}
                    </span>
                    <span className="text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-amber/10 text-caption font-semibold text-brand-amber-light">
                        {entry.level}
                      </span>
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </GlassCard>
  );
}
