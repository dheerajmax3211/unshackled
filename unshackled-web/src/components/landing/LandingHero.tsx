"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Shield, Zap } from "lucide-react";
import ThreeCanvas from "@/components/animations/ThreeCanvas"; // We'll use a subtle variant here
import { motion } from "framer-motion"; // Assuming framer-motion is installed as per F-1

import * as THREE from "three";

export default function LandingHero() {
  const handleAnimate = ({ scene, clock }: { scene: THREE.Scene; clock: THREE.Clock }) => {
    // Initialize stars if not present
    if (scene.children.length === 0) {
      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      for (let i = 0; i < 5000; i++) {
        vertices.push(
          THREE.MathUtils.randFloatSpread(20),
          THREE.MathUtils.randFloatSpread(20),
          THREE.MathUtils.randFloatSpread(20)
        );
      }
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
      const material = new THREE.PointsMaterial({ color: 0x3b82f6, size: 0.02 });
      const points = new THREE.Points(geometry, material);
      scene.add(points);
    }

    // Subtle rotation
    const t = clock.getElapsedTime() * 0.05;
    scene.rotation.y = t;
    scene.rotation.x = t * 0.5;
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <ThreeCanvas onAnimate={handleAnimate} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-xs font-bold uppercase tracking-[0.2em] animate-in fade-in slide-in-from-top-4 duration-1000">
          <Sparkles className="w-4 h-4" />
          The Revolution has Started
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">
          UNSHACKLE YOUR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-brand-blue bg-[length:200%_auto] animate-gradient-flow">
            TRUE POTENTIAL.
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
          The most aggressive accountability platform ever built. <br className="hidden md:block" />
          Stop &quot;tracking&quot; your habits. Start <span className="text-white font-bold">destroying</span> your chains.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4">
          <Link href="/signup">
            <Button className="h-16 px-10 bg-brand-blue hover:bg-brand-blue/90 text-white text-xl font-black rounded-2xl shadow-2xl shadow-brand-blue/20 transition-all hover:scale-105 active:scale-95 group">
              Join the 5% Now
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="ghost" className="h-16 px-8 text-white text-lg font-bold hover:bg-white/5 rounded-2xl">
              <Play className="w-5 h-5 mr-3 fill-current" />
              Watch the Mission
            </Button>
          </Link>
        </div>

        {/* Trust/Social Proof */}
        <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl font-black text-white">₹1.2Cr+</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Money Saved</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl font-black text-white">450K+</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Clean Days</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl font-black text-white">12.5K</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Warriors</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl font-black text-white">98%</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Success Rate</p>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#020617] to-transparent z-10" />
    </section>
  );
}
