"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Stats", href: "#stats" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled 
          ? "bg-[#020617]/80 backdrop-blur-xl border-white/10 py-3" 
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-brand-blue group-hover:scale-110 transition-transform">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter">UNSHACKLED</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-4 ml-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-white/5">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white font-bold px-6">
                Start Free
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#020617] border-b border-white/10 p-6 space-y-6 animate-in slide-in-from-top-4">
          <div className="flex flex-col gap-4">
            {navLinks.map(link => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-bold text-slate-400"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full border-white/10 text-white">Login</Button>
            </Link>
            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-brand-blue text-white">Start Free</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
