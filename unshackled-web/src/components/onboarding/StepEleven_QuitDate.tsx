"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Calendar, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function StepEleven_QuitDate() {
  const router = useRouter();
  const { quitDate, setGlobalQuitDate } = useOnboardingStore();
  
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const isToday = quitDate === format(today, "yyyy-MM-dd");
  const isYesterday = quitDate === format(yesterday, "yyyy-MM-dd");

  const handleNext = () => {
    router.push("/onboarding/complete");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-brand-blue/20">
          <Calendar className="w-8 h-8 text-brand-blue" />
        </div>
        <h1 className="text-4xl font-display font-black tracking-tight mb-4">
          The Start Line.
        </h1>
        <p className="text-slate-400 text-lg">
          When does your new life start? Most people choose today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-8">
        <Card
          onClick={() => setGlobalQuitDate(format(today, "yyyy-MM-dd"))}
          className={cn(
            "p-6 cursor-pointer border-2 transition-all flex items-center justify-between",
            isToday 
              ? "bg-brand-blue border-brand-blue text-white shadow-xl shadow-brand-blue/20" 
              : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
          )}
        >
          <div className="flex flex-col">
            <span className="text-lg font-bold">Today</span>
            <span className={cn("text-xs opacity-60", isToday ? "text-white" : "text-slate-500")}>
              {format(today, "PPP")}
            </span>
          </div>
          {isToday && <CheckCircle2 className="w-6 h-6" />}
        </Card>

        <Card
          onClick={() => setGlobalQuitDate(format(yesterday, "yyyy-MM-dd"))}
          className={cn(
            "p-6 cursor-pointer border-2 transition-all flex items-center justify-between",
            isYesterday 
              ? "bg-brand-blue border-brand-blue text-white shadow-xl shadow-brand-blue/20" 
              : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
          )}
        >
          <div className="flex flex-col">
            <span className="text-lg font-bold">Yesterday</span>
            <span className={cn("text-xs opacity-60", isYesterday ? "text-white" : "text-slate-500")}>
              {format(yesterday, "PPP")}
            </span>
          </div>
          {isYesterday && <CheckCircle2 className="w-6 h-6" />}
        </Card>
      </div>

      <div className="w-full mb-12">
        <Label className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 block text-center">
          Or pick a specific date
        </Label>
        <input
          type="date"
          value={quitDate}
          max={format(today, "yyyy-MM-dd")}
          onChange={(e) => setGlobalQuitDate(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-6 text-white text-lg focus:border-brand-blue/50 outline-none transition-colors"
        />
      </div>

      <Button 
        size="lg" 
        onClick={handleNext}
        className="w-full sm:w-64 bg-white text-black hover:bg-slate-200 font-bold h-14 rounded-2xl group"
      >
        I&apos;m Ready
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={className}>{children}</span>
);
