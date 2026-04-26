"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Quote, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { JournalEntry, Friend } from "@/lib/api/types";
import { format } from "date-fns";

interface SharedEntriesViewProps {
  entries: JournalEntry[];
  friends: Friend[];
  className?: string;
}

export default function SharedEntriesView({ entries, friends, className }: SharedEntriesViewProps) {
  if (entries.length === 0) {
    return (
      <Card className={cn(
        "p-12 border border-dashed border-white/10 bg-white/[0.02] text-center",
        className
      )}>
        <Users className="w-16 h-16 mx-auto mb-6 text-slate-700" />
        <h3 className="text-lg font-bold text-white mb-2">No shared stories yet</h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          When your friends choose to share their journal entries with you, they will appear here. Vulnerability builds strength.
        </p>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center gap-3 px-1">
        <MessageCircle className="w-5 h-5 text-brand-blue" />
        <h3 className="text-lg font-bold text-white">Community Shared</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entries.map((entry) => {
          const friend = friends.find(f => f.friendId === entry.userId);
          const name = friend?.displayName || "Anonymous Warrior";
          const avatar = friend?.avatarUrl;

          return (
            <Card key={entry.id} className="relative p-6 border border-white/10 bg-white/[0.03] overflow-hidden group">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Quote className="w-16 h-16 text-white" />
              </div>

              <div className="flex items-start gap-4 mb-6">
                <Avatar className="w-10 h-10 border border-white/10">
                  <AvatarImage src={avatar || ""} />
                  <AvatarFallback className="bg-brand-blue/20 text-brand-blue font-bold text-xs">
                    {name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-white">{name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {format(new Date(entry.entryDate), "MMM do, yyyy")}
                  </p>
                </div>
                <div className="ml-auto text-xl">{entry.moodEmoji || "😐"}</div>
              </div>

            <div className="relative">
              <p className="text-sm text-slate-400 leading-relaxed italic">
                &quot;{entry.content}&quot;
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex gap-1.5">
                {entry.triggers.slice(0, 2).map(t => (
                  <span key={t} className="text-[9px] bg-white/5 px-2 py-0.5 rounded-full text-slate-500 font-bold uppercase tracking-widest">
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-slate-600 font-medium">Shared with you</p>
            </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
