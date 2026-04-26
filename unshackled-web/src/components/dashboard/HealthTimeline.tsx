"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { 
  Heart, 
  Wind, 
  Brain, 
  ShieldCheck, 
  Zap, 
  Timer,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Milestone {
  time: string;
  days: number;
  label: string;
  description: string;
  icon: React.ElementType;
}

const MILESTONES: Milestone[] = [
  { time: "2 Hours", days: 0.08, label: "Heart Rate", description: "Heart rate and blood pressure drop to normal.", icon: Heart },
  { time: "12 Hours", days: 0.5, label: "Carbon Monoxide", description: "Carbon monoxide level in blood drops to normal.", icon: Wind },
  { time: "24 Hours", days: 1, label: "Heart Attack Risk", description: "Risk of heart attack begins to decrease.", icon: ShieldCheck },
  { time: "48 Hours", days: 2, label: "Taste & Smell", description: "Nerve endings start regrowing, taste and smell improve.", icon: Zap },
  { time: "72 Hours", days: 3, label: "Breathing", description: "Bronchial tubes relax, breathing becomes easier.", icon: Wind },
  { time: "2 Weeks", days: 14, label: "Circulation", description: "Lung function and circulation significantly improve.", icon: Timer },
  { time: "1 Month", days: 30, label: "Energy Levels", description: "Coughing and shortness of breath decrease.", icon: Zap },
  { time: "3 Months", days: 90, label: "Lung Health", description: "Lungs begin to clean themselves, reducing infection risk.", icon: ShieldCheck },
  { time: "6 Months", days: 180, label: "Mental Clarity", description: "Stress management and mental clarity improve.", icon: Brain },
  { time: "1 Year", days: 365, label: "Heart Disease", description: "Risk of coronary heart disease is half that of a smoker.", icon: Heart },
];

interface HealthTimelineProps {
  currentDays: number;
}

export default function HealthTimeline({ currentDays }: HealthTimelineProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Heart className="w-5 h-5 text-emerald-400" />
          Health Recovery
        </h3>
        <span className="text-xs text-slate-500 font-medium">Scroll to explore milestones</span>
      </div>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2" />
        
        <div className="flex overflow-x-auto gap-6 pb-6 px-4 no-scrollbar">
          {MILESTONES.map((milestone, idx) => {
            const isCompleted = currentDays >= milestone.days;
            const isCurrent = !isCompleted && (idx === 0 || currentDays >= MILESTONES[idx-1].days);

            return (
              <div key={milestone.label} className="flex-shrink-0 w-64 relative">
                {/* Connector Dot */}
                <div className={cn(
                  "absolute top-1/2 left-0 w-4 h-4 rounded-full -translate-y-1/2 -translate-x-1/2 z-10 border-4 border-dark-bg transition-colors duration-500",
                  isCompleted ? "bg-emerald-500" : isCurrent ? "bg-emerald-400 animate-pulse" : "bg-slate-800"
                )} />

                <Card className={cn(
                  "p-5 mt-8 border-2 transition-all duration-500 group",
                  isCompleted 
                    ? "bg-emerald-500/5 border-emerald-500/20" 
                    : isCurrent 
                      ? "bg-white/5 border-emerald-500/40 ring-4 ring-emerald-500/5" 
                      : "bg-white/5 border-white/5 opacity-40 grayscale"
                )}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                      isCompleted ? "bg-emerald-500 text-black" : "bg-white/5 text-slate-400"
                    )}>
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <milestone.icon className="w-5 h-5" />}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {milestone.time}
                    </span>
                  </div>
                  
                  <h4 className={cn(
                    "font-bold mb-1 group-hover:text-emerald-400 transition-colors",
                    isCompleted ? "text-white" : "text-slate-400"
                  )}>
                    {milestone.label}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {milestone.description}
                  </p>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
