"use client";

import { motion } from "framer-motion";
import { Flame, MessageCircle, Swords, UserMinus, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface FriendCardProps {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  currentStreak: number;
  status: "accepted" | "pending";
  onChallenge?: (id: string) => void;
  onMessage?: (id: string) => void;
  onRemove?: (id: string) => void;
  className?: string;
}

export function FriendCard({
  id,
  username,
  displayName,
  avatarUrl,
  currentStreak,
  status,
  onChallenge,
  onMessage,
  onRemove,
  className,
}: FriendCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <GlassCard padding="md" className={cn("flex flex-col gap-4", className)}>
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12 rounded-full flex-shrink-0">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-brand-amber/20 text-brand-amber-light">
              {displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-body-md font-semibold text-text-primary truncate">
                {displayName}
              </h4>
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-caption px-2 py-0.5 rounded-full border",
                  status === "accepted"
                    ? "bg-brand-green/10 border-brand-green/20 text-brand-green-light"
                    : "bg-brand-amber/10 border-brand-amber/20 text-brand-amber-light"
                )}
              >
                {status === "accepted" ? (
                  <>
                    <CheckCircle className="w-3 h-3" /> Friend
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3" /> Pending
                  </>
                )}
              </span>
            </div>
            <p className="text-caption text-text-muted">@{username}</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
            <Flame className="w-3.5 h-3.5 text-brand-amber" />
            <span className="text-body-sm font-semibold text-text-primary tabular-nums">
              {currentStreak}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChallenge?.(id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-glass-sm bg-brand-amber/15 border border-brand-amber/20 hover:bg-brand-amber/20 text-brand-amber-light text-caption font-semibold transition-colors"
          >
            <Swords className="w-3.5 h-3.5" />
            Challenge
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onMessage?.(id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-glass-sm bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.15] text-text-secondary text-caption font-semibold transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Message
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onRemove?.(id)}
            className="flex items-center justify-center w-9 h-9 rounded-glass-sm border border-white/[0.06] hover:border-brand-rose/30 hover:bg-brand-rose/10 text-text-muted hover:text-brand-rose-light transition-colors"
          >
            <UserMinus className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
