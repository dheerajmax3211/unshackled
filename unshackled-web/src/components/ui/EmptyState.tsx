"use client";

import React from "react";
import { LucideIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  message,
  action,
  className
}: EmptyStateProps) {
  return (
    <Card className={cn(
      "flex flex-col items-center justify-center p-12 text-center border-dashed border-white/10 bg-white/[0.02] space-y-6 animate-in fade-in zoom-in-95 duration-500",
      className
    )}>
      <div className="relative group">
        <div className="absolute inset-0 bg-brand-blue/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-600 group-hover:text-brand-blue group-hover:border-brand-blue/30 transition-all">
          <Icon className="w-12 h-12" />
        </div>
        <div className="absolute -top-1 -right-1">
          <Sparkles className="w-4 h-4 text-brand-blue animate-pulse" />
        </div>
      </div>

      <div className="space-y-2 max-w-sm">
        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          {message}
        </p>
      </div>

      {action && (
        <Button 
          onClick={action.onClick}
          className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold h-11 px-8 rounded-xl transition-all hover:scale-105"
        >
          {action.icon && <action.icon className="w-4 h-4 mr-2" />}
          {action.label}
        </Button>
      )}
    </Card>
  );
}
