import React from "react";
import LandingHero from "@/components/landing/LandingHero";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingStats from "@/components/landing/LandingStats";
import LandingPricing from "@/components/landing/LandingPricing";

export const metadata = {
  title: "UNSHACKLED | Reclaim Your Freedom",
  description: "The most aggressive accountability platform for breaking destructive habits. Not a tracker, a revolution.",
};

export default function LandingPage() {
  return (
    <div className="space-y-0">
      <LandingHero />
      
      <div className="relative">
        {/* Transition Divider */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#020617] to-transparent z-10" />
        
        <LandingFeatures />
        
        <LandingStats />
        
        <LandingPricing />
        
        {/* Bottom CTA Section */}
        <section className="py-24 md:py-40 bg-[#020617] relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-10 relative z-10">
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-tight">
              YOUR CHAINS <br />
              <span className="text-brand-blue">END TODAY.</span>
            </h2>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
              Join 50,000+ others who have taken the first step toward sovereignty. No more excuses. No more slips. Just absolute freedom.
            </p>
            <div className="pt-6">
              <a href="/signup">
                <button className="h-16 px-12 bg-white text-black text-xl font-black rounded-2xl hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10">
                  START YOUR REVOLUTION
                </button>
              </a>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em] mt-6">
                Free to start. Impossible to quit.
              </p>
            </div>
          </div>
          
          {/* Subtle Background Elements */}
          <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-brand-blue/5 blur-[100px]" />
          <div className="absolute top-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-cyan-500/5 blur-[100px]" />
        </section>
      </div>
    </div>
  );
}
