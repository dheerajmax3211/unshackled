import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-dark-bg/80 backdrop-blur-md">
        <div className="max-width-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className={cn(buttonVariants({ variant: "default" }), "bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full px-6 h-9")}
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 pt-32">
        <section className="px-6 py-20 max-w-5xl mx-auto text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-blue/20 rounded-full blur-[120px] -z-10" />
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-blue text-xs font-bold tracking-widest uppercase mb-8">
            <Sparkles className="w-3 h-3" />
            The #1 Habit Transformation Engine
          </div>
          
          <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-[0.9] mb-8">
            BREAK THE CHAINS.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-indigo-400">
              RECLAIM YOUR LIFE.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
            The world&apos;s most advanced accountability system for quitting smoking, drinking, and digital addictions. 
            Backed by science, enforced by friends.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/signup" 
              className={cn(buttonVariants({ variant: "default", size: "lg" }), "bg-white text-black hover:bg-slate-200 rounded-full px-8 h-14 text-lg font-bold")}
            >
              Begin Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/login" 
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-white/10 hover:bg-white/5 rounded-full px-8 h-14 text-lg font-bold text-white")}
            >
              Explore Dashboard
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="px-6 py-32 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-blue/50 transition-all group">
              <div className="w-12 h-12 bg-brand-blue/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-brand-blue" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Bulletproof Accountability</h3>
              <p className="text-slate-400 leading-relaxed">
                Friends can trigger random photo/video/GPS checks. If you can&apos;t prove it, you lose your streak.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all group">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Dopamine Rewiring</h3>
              <p className="text-slate-400 leading-relaxed">
                AI-driven suggestions to replace your addiction with healthy, high-dopamine activities at your most challenging moments.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Financial Liberation</h3>
              <p className="text-slate-400 leading-relaxed">
                Real-time tracking of money saved, automatically converted into tangible rewards you can buy in your currency.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 px-6 bg-black/20">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8">
          <Logo size="sm" />
          <div className="flex gap-8 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/support" className="hover:text-white">Support</Link>
          </div>
          <p className="text-sm text-slate-600">
            &copy; 2026 Unshackled. For the brave ones.
          </p>
        </div>
      </footer>
    </div>
  );
}
