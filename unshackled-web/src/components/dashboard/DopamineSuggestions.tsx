"use client";

import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Zap, Music, Dumbbell, Coffee, Book, CloudMoon, Gamepad2 } from "lucide-react";
import { DopamineSuggestion } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface DopamineSuggestionsProps {
  initialSuggestions: DopamineSuggestion[];
}

const ICON_MAP: Record<string, React.ElementType> = {
  music: Music,
  exercise: Dumbbell,
  meditation: CloudMoon,
  reading: Book,
  gaming: Gamepad2,
  beverage: Coffee,
  default: Zap
};

export default function DopamineSuggestions({ initialSuggestions }: DopamineSuggestionsProps) {
  const [currentIndices, setCurrentIndices] = useState([0, 1, 2]);
  const [isShuffling, setIsShuffling] = useState(false);

  const visibleSuggestions = useMemo(() => {
    return currentIndices.map(idx => initialSuggestions[idx % initialSuggestions.length]);
  }, [currentIndices, initialSuggestions]);

  const shuffle = () => {
    setIsShuffling(true);
    setTimeout(() => {
      const newIndices: number[] = [];
      const total = initialSuggestions.length;
      while (newIndices.length < Math.min(3, total)) {
        const r = Math.floor(Math.random() * total);
        if (!newIndices.includes(r)) newIndices.push(r);
      }
      setCurrentIndices(newIndices);
      setIsShuffling(false);
    }, 600);
  };

  if (initialSuggestions.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-400" />
          Dopamine Substitutes
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={shuffle}
          disabled={isShuffling}
          className="text-xs text-slate-500 hover:text-white gap-2 font-bold uppercase tracking-widest"
        >
          <RefreshCcw className={cn("w-3 h-3", isShuffling && "animate-spin")} />
          Shuffle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visibleSuggestions.map((suggestion, idx) => {
          const Icon = ICON_MAP[suggestion.iconType || "default"] || ICON_MAP.default;
          return (
            <Card 
              key={`${suggestion.id}-${idx}`}
              className={cn(
                "p-4 bg-white/5 border-white/10 hover:border-indigo-500/30 transition-all group cursor-pointer",
                isShuffling && "animate-out fade-out zoom-out-95 duration-300"
              )}
            >
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-black transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">{suggestion.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                    {suggestion.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
