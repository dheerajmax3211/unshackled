"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHabitStore } from "@/store/useHabitStore";
import { submitCheckIn } from "@/lib/api/habits";
import { toast } from "sonner";
import { useAnimation } from "@/components/animations/AnimationController";

interface CheckInButtonProps {
  userHabitId: string;
  habitName: string;
  currentStreak: number;
  onSuccess?: () => void;
  onSlip?: () => void;
}

export default function CheckInButton({ 
  userHabitId, 
  habitName,
  currentStreak,
  onSuccess,
  onSlip
}: CheckInButtonProps) {
  const [loading, setLoading] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const { triggerAnimation } = useAnimation();

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await submitCheckIn({
        userHabitId,
        notes: "Daily check-in from dashboard",
        mood: "STABLE"
      });
      
      setCheckedIn(true);
      triggerAnimation({ type: "STREAK_MILESTONE", days: currentStreak + 1 }); // Play celebration
      toast.success(`Amazing job! Another clean day for ${habitName}.`);
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to check in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkedIn) {
    return (
      <div className="w-full p-8 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-3xl flex flex-col items-center gap-2 animate-in zoom-in duration-500">
        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-black">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <p className="text-emerald-400 font-bold text-lg">Checked in for today!</p>
        <p className="text-slate-500 text-sm italic">See you tomorrow, warrior.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <Button
        onClick={handleCheckIn}
        disabled={loading}
        className={cn(
          "w-full h-24 rounded-3xl text-xl font-display font-black transition-all duration-300 relative overflow-hidden group",
          loading 
            ? "bg-slate-800" 
            : "bg-white text-black hover:bg-slate-200 hover:scale-[1.02] active:scale-95"
        )}
      >
        {loading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Counting your clean hours...</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 group-hover:scale-110 transition-transform" />
            <span>I&apos;m clean today</span>
          </div>
        )}
        
        {!loading && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-emerald-500 transform translate-x-12 group-hover:translate-x-0 transition-transform flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-black" />
          </div>
        )}
      </Button>

      <div className="flex justify-center">
        <button
          onClick={onSlip}
          disabled={loading}
          className="text-slate-500 hover:text-rose-400 text-sm font-bold flex items-center gap-2 transition-colors py-2 px-4 rounded-xl hover:bg-rose-500/5"
        >
          <AlertCircle className="w-4 h-4" />
          I slipped...
        </button>
      </div>
    </div>
  );
}
