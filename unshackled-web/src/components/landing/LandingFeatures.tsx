import React from "react";
import { Card } from "@/components/ui/card";
import { Shield, Users, BarChart3, Zap, Camera, Bell } from "lucide-react";

const FEATURES = [
  {
    title: "Proof-of-Life Challenges",
    description: "Your friends can challenge you at any time. You have 10 minutes to upload a live photo. If you fail, your streak is destroyed.",
    icon: Camera,
    color: "text-rose-500",
    bg: "bg-rose-500/10"
  },
  {
    title: "The Sovereign Plan",
    description: "Go beyond basic tracking. Unlimited habits, advanced neuro-analytics, and priority accountability networks.",
    icon: Shield,
    color: "text-brand-blue",
    bg: "bg-brand-blue/10"
  },
  {
    title: "Neuro-Analytics",
    description: "Deep insights into your triggers, dopamine recovery, and health milestones. See your brain rewiring in real-time.",
    icon: BarChart3,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    title: "Aggressive Reminders",
    description: "Not just simple notifications. Persistent, high-impact alerts that keep your mission at the forefront of your mind.",
    icon: Bell,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    title: "Squad Accountability",
    description: "Build a circle of trusted warriors. Share your journal entries, compete on leaderboards, and support each other's freedom.",
    icon: Users,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10"
  },
  {
    title: "Instant Verification",
    description: "Our EXIF-based verification system ensures all proof is authentic and captured in the moment. No fake streaks.",
    icon: Zap,
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  }
];

export default function LandingFeatures() {
  return (
    <section id="features" className="py-24 md:py-32 max-w-7xl mx-auto px-6 space-y-20">
      <div className="text-center space-y-6">
        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
          BUILT FOR THE <span className="text-brand-blue underline decoration-brand-blue/30 underline-offset-8">UNCOMPROMISING.</span>
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Unshackled isn&apos;t a friendly reminder app. It&apos;s a digital fortress designed to protect your freedom at all costs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {FEATURES.map((feature, i) => (
          <Card key={i} className="p-8 bg-white/[0.03] border-white/10 hover:border-brand-blue/30 transition-all duration-300 group">
            <div className={`p-4 rounded-2xl ${feature.bg} w-fit mb-6 group-hover:scale-110 transition-transform`}>
              <feature.icon className={`w-8 h-8 ${feature.color}`} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
