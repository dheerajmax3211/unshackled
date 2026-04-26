"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Challenge } from "@/lib/api/types";
import { formatDistanceToNow } from "date-fns";

interface ChallengeHistoryListProps {
  challenges: Challenge[];
  currentUserId?: string;
  className?: string;
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; variant: string }> = {
  pending: {
    label: "Pending",
    icon: <Clock className="w-3 h-3" />,
    variant: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  responded: {
    label: "Responded",
    icon: <Shield className="w-3 h-3" />,
    variant: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  approved: {
    label: "Approved",
    icon: <CheckCircle className="w-3 h-3" />,
    variant: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  rejected: {
    label: "Rejected",
    icon: <XCircle className="w-3 h-3" />,
    variant: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
  expired: {
    label: "Expired",
    icon: <AlertTriangle className="w-3 h-3" />,
    variant: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  },
  verification_failed: {
    label: "Verification Failed",
    icon: <XCircle className="w-3 h-3" />,
    variant: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
};

export default function ChallengeHistoryList({
  challenges,
  currentUserId,
  className,
}: ChallengeHistoryListProps) {
  if (challenges.length === 0) {
    return (
      <Card
        className={cn(
          "p-6 border border-white/10 bg-white/[0.03] text-center",
          className
        )}
      >
        <p className="text-sm text-slate-500">
          No challenges yet. Send one to a friend!
        </p>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "border border-white/10 bg-white/[0.03]",
        className
      )}
    >
      <div className="p-4 border-b border-white/10">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-blue" />
          Challenge History
        </h3>
      </div>

      <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
        {challenges.map((challenge) => {
          const isChallenger = challenge.challengerId === currentUserId;
          const otherParty = isChallenger ? "Sent to" : "Received from";
          const statusConfig = STATUS_CONFIG[challenge.status] || STATUS_CONFIG.pending;

          return (
            <div
              key={challenge.id}
              className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-all"
            >
              {/* Direction icon */}
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                {isChallenger ? (
                  <span className="text-xs text-brand-blue">→</span>
                ) : (
                  <span className="text-xs text-amber-400">←</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant="outline"
                    className={cn("text-[10px] font-medium", statusConfig.variant)}
                  >
                    {statusConfig.icon}
                    <span className="ml-1">{statusConfig.label}</span>
                  </Badge>
                  <span className="text-xs text-slate-500">
                    {otherParty} {isChallenger ? "challenge" : ""}{" "}
                    {formatDistanceToNow(new Date(challenge.createdAt), { addSuffix: true })}
                  </span>
                </div>

                {challenge.message && (
                  <p className="text-xs text-slate-400 truncate">
                    "{challenge.message}"
                  </p>
                )}

                {challenge.status === "rejected" && challenge.reviewerNote && (
                  <p className="text-xs text-rose-400 mt-1">
                    Note: {challenge.reviewerNote}
                  </p>
                )}
              </div>

              {/* EXIF Verified badge */}
              {challenge.exifVerified && (
                <div className="shrink-0" title="EXIF verified">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}