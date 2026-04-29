"use client";

import { motion } from "framer-motion";
import { Crown, Lock, Sparkles, ArrowRight, Shield, Zap, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "@/components/shared/GlassCard";

interface PremiumGateProps {
  feature?: string;
  reason?: string;
  className?: string;
}

const features = [
  { icon: Shield, text: "Unlimited habit tracking" },
  { icon: Zap, text: "Advanced dopamine analytics" },
  { icon: Star, text: "AI personalized trigger predictions" },
  { icon: TrendingUp, text: "Full health timeline access" },
  { icon: Crown, text: "Sovereign badge and profile flair" },
  { icon: Sparkles, text: "Priority support and early features" },
];

export function PremiumGate({
  feature = "this feature",
  reason = "You've hit the free tier limit.",
  className,
}: PremiumGateProps) {
  return (
    <GlassCard padding="lg" className={cn("relative overflow-hidden", className)}>
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-amber/8 rounded-full blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-amber-500/5 rounded-full blur-2xl" />

      <div className="relative flex flex-col items-center gap-6 text-center">
        <motion.div
          animate={{
            boxShadow: [
              "0 0 30px rgba(245,158,11,0.2)",
              "0 0 60px rgba(245,158,11,0.1)",
              "0 0 30px rgba(245,158,11,0.2)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-amber/20 to-brand-amber/5 border-2 border-brand-amber/40 flex items-center justify-center"
        >
          <Lock className="w-7 h-7 text-brand-amber" />
        </motion.div>

        <div className="flex flex-col gap-2">
          <h3 className="text-heading-lg font-bold text-text-primary">
            Premium Feature
          </h3>
          <p className="text-body-sm text-text-muted max-w-xs">
            {reason} Upgrade to unlock {feature} and more.
          </p>
        </div>

        <div className="w-full border-t border-white/[0.04] pt-2" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {features.map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * index, duration: 0.3 }}
              className="flex items-center gap-2.5 text-left"
            >
              <item.icon className="w-4 h-4 text-brand-amber-light flex-shrink-0" />
              <span className="text-body-sm text-text-secondary">{item.text}</span>
            </motion.div>
          ))}
        </div>

        <div className="w-full border-t border-white/[0.04] pt-2" />

        <div className="flex flex-col items-center gap-1">
          <span className="text-heading-md font-bold text-gradient-amber">
            Sovereign
          </span>
          <span className="text-body-sm text-text-muted">₹499/month</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-glass-sm bg-gradient-to-r from-brand-amber-dark via-brand-amber to-brand-amber-light text-surface-darkest font-bold text-body-md transition-all hover:brightness-110"
        >
          <Crown className="w-5 h-5" />
          Upgrade to Sovereign
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        <p className="text-caption text-text-subtle">
          Cancel anytime. Your data stays yours forever.
        </p>
      </div>
    </GlassCard>
  );
}
