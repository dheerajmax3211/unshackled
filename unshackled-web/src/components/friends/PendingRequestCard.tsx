"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserCheck, UserX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Friend } from "@/lib/api/types";
import { respondToRequest } from "@/lib/api/friends";

interface PendingRequestCardProps {
  request: Friend;
  onRespond?: (status: "ACCEPTED" | "REJECTED") => void;
  className?: string;
}

export default function PendingRequestCard({
  request,
  onRespond,
  className,
}: PendingRequestCardProps) {
  const [loading, setLoading] = useState(false);

  const handleRespond = async (response: "ACCEPTED" | "REJECTED") => {
    setLoading(true);
    try {
      await respondToRequest(request.id, response);
      onRespond?.(response);
    } catch (error) {
      console.error("Failed to respond to friend request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className={cn(
        "flex items-center gap-4 p-4 border border-amber-500/20 bg-amber-500/[0.03] hover:border-amber-500/30 transition-all",
        className
      )}
    >
      <Avatar className="w-12 h-12 border border-white/10 shrink-0">
        <AvatarImage src={request.avatarUrl || ""} />
        <AvatarFallback className="bg-amber-500/20 text-amber-400 font-bold text-sm">
          {request.displayName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">
          {request.displayName}
        </p>
        <p className="text-xs text-slate-500 truncate">@{request.username}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          variant="outline"
          className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-400"
          onClick={() => handleRespond("REJECTED")}
          disabled={loading}
        >
          <UserX className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          className="bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 hover:text-amber-400"
          onClick={() => handleRespond("ACCEPTED")}
          disabled={loading}
        >
          <UserCheck className="w-4 h-4 mr-1" />
          Accept
        </Button>
      </div>
    </Card>
  );
}