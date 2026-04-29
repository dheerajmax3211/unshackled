"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motionVariants } from "@/lib/design-tokens";
import { GlassCard } from "@/components/shared/GlassCard";

interface HealthMilestone {
  dayOffset: number;
  title: string;
  description: string;
}

interface HealthTimelineProps {
  milestones: HealthMilestone[];
  currentDay: number;
  className?: string;
}

export function HealthTimeline({
  milestones,
  currentDay,
  className,
}: HealthTimelineProps) {
  const completedMilestones = milestones.filter((m) => m.dayOffset <= currentDay);
  const nextMilestone = milestones.find((m) => m.dayOffset > currentDay);

  return (
    <GlassCard padding="lg" className={cn(className)}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-green/15 border border-brand-green/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-brand-green-light" />
          </div>
          <div>
            <h3 className="text-heading-sm text-text-primary">Health Timeline</h3>
            <p className="text-caption text-text-muted">Day {currentDay} &mdash; {nextMilestone?.title ?? "Fully recovered"}</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-white/[0.06]" />

          <motion.div
            variants={motionVariants.staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="flex flex-col gap-1"
          >
            {milestones.map((milestone, index) => {
              const isCompleted = milestone.dayOffset <= currentDay;
              const isFuture = milestone.dayOffset > currentDay;

              return (
                <motion.div
                  key={milestone.dayOffset}
                  variants={motionVariants.fadeInUp}
                  className="relative flex gap-4 pl-2 py-3"
                >
                  <div
                    className={cn(
                      "relative z-10 w-9 h-9 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all duration-300",
                      isCompleted
                        ? "bg-brand-green/20 border-brand-green/40"
                        : isFuture
                        ? "bg-surface-mid/30 border-surface-light/20"
                        : "bg-brand-green/15 border-brand-green/50"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-brand-green" />
                    ) : (
                      <Clock className="w-4 h-4 text-text-subtle" />
                    )}
                  </div>

                  <div className={cn("flex flex-col", isFuture && "opacity-40")}>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-caption font-semibold px-2 py-0.5 rounded-full",
                          isCompleted
                            ? "bg-brand-green/15 text-brand-green-light"
                            : isFuture
                            ? "bg-white/[0.04] text-text-subtle"
                            : "bg-brand-green/10 text-brand-green-light"
                        )}
                      >
                        Day {milestone.dayOffset}
                      </span>
                      {milestone.dayOffset === currentDay && (
                        <motion.span
                          className="text-caption px-2 py-0.5 rounded-full bg-brand-amber/15 text-brand-amber-light"
                          animate={{ opacity: [1, 0.6, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Now
                        </motion.span>
                      )}
                    </div>
                    <h4
                      className={cn(
                        "text-body-md font-semibold mt-1",
                        isCompleted
                          ? "text-text-primary"
                          : isFuture
                          ? "text-text-muted"
                          : "text-text-primary"
                      )}
                    >
                      {milestone.title}
                    </h4>
                    <p className="text-body-sm text-text-muted mt-0.5">
                      {milestone.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </GlassCard>
  );
}
