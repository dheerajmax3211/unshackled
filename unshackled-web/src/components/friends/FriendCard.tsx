"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Flame, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Friend } from "@/lib/api/types";
import SendChallengeModal from "./SendChallengeModal";

interface FriendCardProps {
  friend: Friend & {
    currentStreak?: number;
    longestStreak?: number;
    habits?: { name: string; icon: string; streak: number }[];
  };
  onChallengeSent?: () => void;
  className?: string;
}

export default function FriendCard({
  friend,
  onChallengeSent,
  className,
}: FriendCardProps) {
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  const bestStreak = friend.currentStreak ?? 0;

  return (
    <>
      <Card
        className={cn(
          "flex items-center gap-4 p-4 border border-white/10 bg-white/[0.03] hover:border-white/20 transition-all",
          className
        )}
      >
        <Avatar className="w-14 h-14 border border-white/10 shrink-0">
          <AvatarImage src={friend.avatarUrl || ""} />
          <AvatarFallback className="bg-brand-blue/20 text-brand-blue font-bold text-sm">
            {friend.displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-white truncate">
              {friend.displayName}
            </p>
            {friend.status === "PENDING" && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                Pending
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 truncate">@{friend.username}</p>

          {friend.habits && friend.habits.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              {friend.habits.slice(0, 3).map((habit, i) => (
                <span
                  key={i}
                  className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-slate-400"
                >
                  {habit.icon} {habit.streak}d
                </span>
              ))}
              {friend.habits.length > 3 && (
                <span className="text-xs text-slate-500">
                  +{friend.habits.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Streak Badge */}
        {bestStreak > 0 && (
          <div className="flex flex-col items-center shrink-0">
            <Flame className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold text-amber-400">
              {bestStreak}d
            </span>
          </div>
        )}

        {/* Challenge Button */}
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 border-brand-blue/30 text-brand-blue hover:bg-brand-blue/10 hover:text-brand-blue"
          onClick={() => setShowChallengeModal(true)}
        >
          <Shield className="w-4 h-4 mr-1" />
          Challenge
        </Button>
      </Card>

      <SendChallengeModal
        open={showChallengeModal}
        onOpenChange={setShowChallengeModal}
        friendId={friend.friendId}
        friendName={friend.displayName}
        onSuccess={() => {
          setShowChallengeModal(false);
          onChallengeSent?.();
        }}
      />
    </>
  );
}