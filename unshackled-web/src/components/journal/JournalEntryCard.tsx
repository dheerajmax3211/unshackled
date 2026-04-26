"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Lock, Share2, Sparkles, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { JournalEntry } from "@/lib/api/types";
import { format } from "date-fns";

interface JournalEntryCardProps {
  entry: JournalEntry;
  className?: string;
}

const MOOD_CONFIG: Record<number, { color: string; label: string; bg: string }> = {
  1: { color: "text-rose-500", label: "Devastated", bg: "bg-rose-500/10" },
  2: { color: "text-rose-500", label: "Awful", bg: "bg-rose-500/10" },
  3: { color: "text-rose-400", label: "Sad", bg: "bg-rose-400/10" },
  4: { color: "text-amber-500", label: "Meh", bg: "bg-amber-500/10" },
  5: { color: "text-amber-400", label: "Okay", bg: "bg-amber-400/10" },
  6: { color: "text-emerald-500", label: "Good", bg: "bg-emerald-500/10" },
  7: { color: "text-emerald-400", label: "Calm", bg: "bg-emerald-400/10" },
  8: { color: "text-amber-400", label: "Happy", bg: "bg-amber-400/10" },
  9: { color: "text-amber-300", label: "Amazing", bg: "bg-amber-300/10" },
  10: { color: "text-amber-300", label: "On Fire", bg: "bg-amber-300/10" },
};

export default function JournalEntryCard({ entry, className }: JournalEntryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const mood = MOOD_CONFIG[entry.moodScore] || MOOD_CONFIG[5];

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-500 border border-white/10 group hover:border-white/20",
      mood.bg,
      className
    )}>
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border transition-transform group-hover:scale-110",
              "bg-white/5 border-white/10"
            )}>
              {entry.moodEmoji || "😐"}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                {format(new Date(entry.entryDate), "EEEE")}
              </p>
              <h4 className="text-lg font-black text-white">
                {format(new Date(entry.entryDate), "MMMM do, yyyy")}
              </h4>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest", mood.bg, mood.color)}>
              {mood.label}
            </div>
            {entry.isShared ? (
              <Share2 className="w-3.5 h-3.5 text-brand-blue opacity-60" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-slate-600 opacity-60" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          <p className={cn(
            "text-slate-300 leading-relaxed transition-all duration-500",
            !isExpanded && "line-clamp-3"
          )}>
            {entry.content}
          </p>
          {!isExpanded && entry.content.length > 180 && (
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
          )}
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="pt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {entry.whatHelped && (
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  What Helped
                </p>
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  &quot;{entry.whatHelped}&quot;
                </p>
              </div>
            )}
            
            {entry.isShared && entry.sharedWith.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Share2 className="w-3 h-3" />
                <span>Shared with {entry.sharedWith.length} friends</span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-wrap gap-1.5">
            {entry.triggers.map(trigger => (
              <Badge key={trigger} variant="outline" className="text-[9px] border-white/5 bg-white/5 text-slate-500 font-medium">
                {trigger}
              </Badge>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-slate-500 hover:text-white gap-1"
          >
            {isExpanded ? (
              <>Less <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>More <ChevronDown className="w-4 h-4" /></>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
