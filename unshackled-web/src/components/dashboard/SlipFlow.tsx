"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Heart, ArrowRight, Loader2, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitCheckIn } from "@/lib/api/habits";
import { useAnimation } from "@/components/animations/AnimationController";
import { toast } from "sonner";

interface SlipFlowProps {
  isOpen: boolean;
  onClose: () => void;
  userHabitId: string;
  habitName: string;
}

const TRIGGERS = [
  "Stress", "Boredom", "Social Pressure", "Work Stress", 
  "Celebration", "Loneliness", "Curiosity", "Anger"
];

export default function SlipFlow({ isOpen, onClose, userHabitId, habitName }: SlipFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [reflection, setReflection] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { triggerAnimation } = useAnimation();

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) ? prev.filter(t => t !== trigger) : [...prev, trigger]
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitCheckIn({
        userHabitId,
        notes: `Relapse Reflection: ${reflection}. Triggers: ${selectedTriggers.join(", ")}`,
        mood: "REGRETFUL" // Backend can map this
      });

      triggerAnimation({ type: "RELAPSE_RECOVERY" });
      toast.info("It happened. Now let's start again, stronger.");
      onClose();
      // Reset state for next time
      setTimeout(() => {
        setStep(1);
        setSelectedTriggers([]);
        setReflection("");
      }, 500);
    } catch (error: any) {
      toast.error(error.message || "Failed to log. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-bg border-white/10 sm:max-w-md p-0 overflow-hidden">
        <div className="relative h-2 w-full bg-white/5">
          <div 
            className="h-full bg-rose-500 transition-all duration-500" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6 text-center animate-in slide-in-from-right-4 duration-300">
              <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-rose-500" />
              </div>
              <div className="space-y-2">
                <DialogTitle className="text-2xl font-display font-black text-white">
                  It happened. You&apos;re not broken.
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  A slip is a lesson, not a failure. Take a breath. We&apos;re here to help you get back on track.
                </DialogDescription>
              </div>
              <Button 
                onClick={() => setStep(2)} 
                className="w-full bg-white text-black hover:bg-slate-200 font-bold h-12 rounded-xl"
              >
                Let&apos;s talk about it
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">What triggered it?</h3>
                <p className="text-sm text-slate-500">Identifying triggers helps prevent them next time.</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {TRIGGERS.map(t => {
                  const isSelected = selectedTriggers.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleTrigger(t)}
                      className={cn(
                        "py-2 px-4 rounded-xl border text-sm font-medium transition-all",
                        isSelected 
                          ? "bg-rose-500 border-rose-400 text-white" 
                          : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
                      )}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
              <Button 
                onClick={() => setStep(3)} 
                className="w-full bg-white text-black hover:bg-slate-200 font-bold h-12 rounded-xl"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Your comeback plan?</h3>
                <p className="text-sm text-slate-500">What will you do differently tomorrow?</p>
              </div>
              <Textarea
                placeholder="e.g., I'll call a friend when I feel work stress..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="bg-white/5 border-white/10 min-h-[120px] resize-none"
              />
              <Button 
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-rose-600 text-white hover:bg-rose-700 font-bold h-12 rounded-xl"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    <RefreshCcw className="w-4 h-4" />
                    Reset & Start Over
                  </div>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
