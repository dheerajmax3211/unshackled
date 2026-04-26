"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Flame, Users, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserResponse } from "@/lib/api/types";

interface ProfileHeaderProps {
  user: UserResponse;
  className?: string;
}

export default function ProfileHeader({ user, className }: ProfileHeaderProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden p-6 border border-white/10 bg-white/[0.03]",
        className
      )}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-amber-500/5" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar with streak ring */}
        <div className="relative">
          <Avatar className="w-24 h-24 border-4 border-brand-blue/30">
            <AvatarImage src={user.avatarUrl || ""} />
            <AvatarFallback className="bg-brand-blue/20 text-brand-blue text-2xl font-bold">
              {user.displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-black text-white">{user.displayName}</h1>
            {user.premiumStatus === "PREMIUM" && (
              <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Sovereign
              </Badge>
            )}
          </div>
          <p className="text-slate-400 mb-2">@{user.username}</p>
          {user.bio && (
            <p className="text-sm text-slate-300 max-w-md">{user.bio}</p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-center">
            <div className="text-2xl font-black text-amber-400">0</div>
            <div className="text-xs text-slate-500 font-bold uppercase">Supporting</div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-black text-brand-blue">0</div>
            <div className="text-xs text-slate-500 font-bold uppercase">Friends</div>
          </div>
        </div>
      </div>
    </Card>
  );
}