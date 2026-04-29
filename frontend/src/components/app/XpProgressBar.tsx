"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";

interface XpProgressBarProps {
  level: number;
  levelName: string;
  xp: number;
  xpToNextLevel: number;
  className?: string;
}

function getLevelTierColor(level: number): string {
  if (level >= 15) return "from-brand-amber-light via-brand-amber to-brand-amber-dark";
  if (level >= 10) return "from-purple-300 via-purple-400 to-purple-600";
  if (level >= 5) return "from-brand-blue-light via-brand-blue to-brand-blue-dark";
  return "from-brand-green-light via-brand-green to-brand-green-dark";
}

export function XpProgressBar({
  level,
  levelName,
  xp,
  xpToNextLevel,
  className,
}: XpProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const currentLevelXp = xp;
  const totalNeeded = currentLevelXp + xpToNextLevel;
  const percentage = Math.min((currentLevelXp / totalNeeded) * 100, 100);

  const nextLevel = { level: level + 1, name: "Next Level" };
  const prevLevels = [
    { level: 1, name: "Spark", xpRequired: 0 },
    { level: 2, name: "Kindling", xpRequired: 100 },
    { level: 3, name: "Flame", xpRequired: 300 },
    { level: 4, name: "Torch", xpRequired: 600 },
    { level: 5, name: "Beacon", xpRequired: 1000 },
    { level: 6, name: "Wildfire", xpRequired: 2000 },
    { level: 7, name: "Reclaimer", xpRequired: 4000 },
    { level: 8, name: "Guardian", xpRequired: 7000 },
    { level: 9, name: "Sentinel", xpRequired: 11000 },
    { level: 10, name: "Liberator", xpRequired: 16000 },
    { level: 15, name: "Sovereign", xpRequired: 50000 },
    { level: 20, name: "Unshackled", xpRequired: 75000 },
  ];
  const currentLevelData = prevLevels.find((l) => l.level === level);
  const nextLevelData = prevLevels.find((l) => l.level > level);

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => setProgress(percentage), 300);
    return () => clearTimeout(timer);
  }, [inView, percentage]);

  return (
    <GlassCard padding="lg" className={cn(className)}>
      <div ref={ref} className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-full bg-brand-amber/15 border border-brand-amber/30 flex items-center justify-center"
              animate={{ boxShadow: ["0 0 20px rgba(245,158,11,0.15)", "0 0 40px rgba(245,158,11,0.05)", "0 0 20px rgba(245,158,11,0.15)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Zap className="w-6 h-6 text-brand-amber" />
            </motion.div>
            <div>
              <h3 className="text-heading-sm text-text-primary">Level {level}</h3>
              <p
                className={cn(
                  "text-body-md font-semibold bg-clip-text text-transparent bg-gradient-to-r",
                  getLevelTierColor(level)
                )}
              >
                {levelName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-text-muted">
            <span className="text-caption">Next</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-body-sm font-semibold text-text-secondary">
              {nextLevelData?.name ?? "???"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-caption">
            <span className="text-text-muted">{currentLevelXp} XP</span>
            <span className="text-text-subtle">{xpToNextLevel} XP to next level</span>
          </div>
          <div className="relative w-full h-3 bg-white/[0.04] rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-amber-dark via-brand-amber to-brand-amber-light"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              style={{ width: "50%" }}
            />
          </div>
          <div className="flex justify-between text-caption text-text-subtle">
            <span>{currentLevelData?.name ?? "Start"}</span>
            <span>{nextLevelData?.name ?? "End"}</span>
          </div>
        </div>

        <p className="text-body-sm text-text-muted text-center">
          Keep going — every clean day earns XP and rewires your brain.
        </p>
      </div>
    </GlassCard>
  );
}
