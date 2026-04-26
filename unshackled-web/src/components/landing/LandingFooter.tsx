import React from "react";
import Link from "next/link";
import { Shield, Globe } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/5 py-12 md:py-20 bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-brand-blue">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black text-white tracking-tight">UNSHACKLED</span>
          </Link>
          <p className="text-sm text-slate-500 leading-relaxed">
            The world&apos;s most aggressive accountability platform for breaking destructive habits. Not a tracker, a revolution.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-600 hover:text-white transition-colors"><Globe className="w-5 h-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Product</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><Link href="#features" className="hover:text-brand-blue transition-colors">Features</Link></li>
            <li><Link href="#pricing" className="hover:text-brand-blue transition-colors">Sovereign Plan</Link></li>
            <li><Link href="/analytics" className="hover:text-brand-blue transition-colors">Analytics</Link></li>
            <li><Link href="/journal" className="hover:text-brand-blue transition-colors">Journaling</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-slate-500">
            <li><Link href="#" className="hover:text-brand-blue transition-colors">About Us</Link></li>
            <li><Link href="#" className="hover:text-brand-blue transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-brand-blue transition-colors">Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-brand-blue transition-colors">Support</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">The Mission</h4>
          <p className="text-sm text-slate-500 italic mb-4">
            &quot;Freedom is not given; it is taken through discipline and community.&quot;
          </p>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] mb-1">Users Reclaiming Freedom</p>
            <p className="text-xl font-black text-white">52,481</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
        <p>© 2024 UNSHACKLED APP. ALL RIGHTS RESERVED.</p>
        <p>BUILT FOR THOSE WHO WANT TO BE SOVEREIGN.</p>
      </div>
    </footer>
  );
}
