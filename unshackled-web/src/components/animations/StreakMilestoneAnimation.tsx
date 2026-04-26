"use client";

import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import ThreeCanvas from "./ThreeCanvas";

interface StreakMilestoneAnimationProps {
  days: number;
  onComplete?: () => void;
}

/**
 * Streak Milestone Animation:
 * An aurora-like ribbon effect that flows through the screen,
 * with colors evolving based on the length of the streak.
 */
export default function StreakMilestoneAnimation({ days, onComplete }: StreakMilestoneAnimationProps) {
  const tubeRef = useRef<THREE.Mesh | null>(null);
  
  const colors = useMemo(() => {
    if (days >= 90) return { primary: "#10b981", secondary: "#059669" }; // Emerald
    if (days >= 30) return { primary: "#f59e0b", secondary: "#d97706" }; // Gold
    if (days >= 7) return { primary: "#fbbf24", secondary: "#f59e0b" };  // Amber
    return { primary: "#f43f5e", secondary: "#e11d48" };               // Rose (Day 1+)
  }, [days]);

  useEffect(() => {
    const timer = setTimeout(() => onComplete?.(), 5500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleAnimate = ({ scene, clock }: any) => {
    if (!tubeRef.current) {
      // Create a random-ish curve
      const points = [];
      for (let i = 0; i < 10; i++) {
        points.push(new THREE.Vector3((i - 5) * 2, Math.sin(i) * 2, Math.cos(i) * 2));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(curve, 100, 0.2, 8, false);
      
      const material = new THREE.MeshStandardMaterial({
        color: colors.primary,
        emissive: colors.primary,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.8,
        wireframe: true,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      
      // Add lighting for the "aurora" glow
      const light = new THREE.PointLight(colors.primary, 10, 20);
      scene.add(light);
      
      tubeRef.current = mesh;
    }

    if (tubeRef.current) {
      const t = clock.getElapsedTime();
      tubeRef.current.rotation.z = t * 0.2;
      tubeRef.current.rotation.y = t * 0.1;
      
      // Animate vertices slightly for "flow"
      const positions = tubeRef.current.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);
        positions.setY(i, y + Math.sin(t + x) * 0.005);
      }
      positions.needsUpdate = true;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark-bg/80 backdrop-blur-xl">
      <ThreeCanvas onAnimate={handleAnimate} />
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-10 text-center"
      >
        <div className="text-sm font-bold uppercase tracking-[0.3em] text-white/50 mb-4">
          Milestone Achieved
        </div>
        <h2 className="text-8xl md:text-[12rem] font-display font-black text-white leading-none tracking-tighter">
          {days}
        </h2>
        <div 
          className="text-2xl md:text-4xl font-display font-bold mt-4"
          style={{ color: colors.primary }}
        >
          Days Clean
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 text-white/40 text-sm font-medium tracking-widest uppercase"
      >
        Your brain is rewiring. Keep going.
      </motion.div>
    </div>
  );
}
