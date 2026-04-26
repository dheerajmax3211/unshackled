"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import ThreeCanvas from "./ThreeCanvas";

interface RelapseRecoveryAnimationProps {
  onComplete?: () => void;
}

/**
 * Relapse Recovery Animation:
 * A slow, meditative transition from darkness to a warm, breathing amber glow.
 * Designed to provide emotional support and reassurance after a slip.
 */
export default function RelapseRecoveryAnimation({ onComplete }: RelapseRecoveryAnimationProps) {
  const lightRef = useRef<THREE.PointLight | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => onComplete?.(), 7000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleAnimate = ({ scene, clock }: any) => {
    if (!sphereRef.current) {
      const geometry = new THREE.SphereGeometry(2, 64, 64);
      const material = new THREE.MeshStandardMaterial({
        color: "#fbbf24", // Amber
        emissive: "#fbbf24",
        emissiveIntensity: 0,
        transparent: true,
        opacity: 0.3,
      });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      sphereRef.current = sphere;

      const light = new THREE.PointLight("#fbbf24", 0, 20);
      scene.add(light);
      lightRef.current = light;
    }

    const t = clock.getElapsedTime();
    const progress = Math.min(t / 5, 1); // Slow fade over 5 seconds

    if (sphereRef.current && lightRef.current) {
      // Fade in intensity
      const intensity = progress * 2 + Math.sin(t * 0.5) * 0.2; // Breathing effect
      (sphereRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
      lightRef.current.intensity = intensity * 10;
      
      // Pulse scale
      const scale = 1 + Math.sin(t * 0.3) * 0.05;
      sphereRef.current.scale.set(scale, scale, scale);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]">
      <ThreeCanvas onAnimate={handleAnimate} />
      
      <div className="relative z-10 text-center max-w-2xl px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
          className="space-y-8"
        >
          <h2 className="text-3xl md:text-5xl font-display font-medium text-amber-100 leading-tight">
            Slipping is not failing.
          </h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1.5 }}
            className="text-xl md:text-2xl text-amber-200/60 font-serif italic"
          >
            "Every quit attempt teaches your brain something new about its freedom."
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5, duration: 1 }}
            className="pt-8"
          >
            <div className="h-px w-24 bg-amber-500/30 mx-auto mb-8" />
            <span className="text-amber-500/40 uppercase tracking-[0.4em] text-xs font-bold">
              Breath In. Reset. Continue.
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
