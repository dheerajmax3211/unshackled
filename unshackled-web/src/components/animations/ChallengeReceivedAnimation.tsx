"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import ThreeCanvas from "./ThreeCanvas";

interface ChallengeReceivedAnimationProps {
  senderName: string;
  onComplete?: () => void;
}

/**
 * Challenge Received Animation:
 * A pulsing blue orb with expanding "radar" rings.
 * Signals that a friend is requesting accountability proof.
 */
export default function ChallengeReceivedAnimation({ senderName, onComplete }: ChallengeReceivedAnimationProps) {
  const orbRef = useRef<THREE.Mesh | null>(null);
  const ringsRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => onComplete?.(), 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const handleAnimate = ({ scene, clock }: any) => {
    if (!orbRef.current) {
      // Create Core Orb
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: "#0070f3",
        emissive: "#0070f3",
        emissiveIntensity: 1,
        metalness: 0.8,
        roughness: 0.2,
      });
      const orb = new THREE.Mesh(geometry, material);
      scene.add(orb);
      orbRef.current = orb;

      // Create Radar Rings
      for (let i = 0; i < 3; i++) {
        const ringGeo = new THREE.RingGeometry(1.1, 1.15, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: "#0070f3",
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        scene.add(ring);
        ringsRef.current.push(ring);
      }

      // Lighting
      const light = new THREE.PointLight("#0070f3", 15, 10);
      light.position.set(2, 2, 2);
      scene.add(light);
    }

    const t = clock.getElapsedTime();
    
    // Pulse Orb
    if (orbRef.current) {
      const scale = 1 + Math.sin(t * 4) * 0.1;
      orbRef.current.scale.set(scale, scale, scale);
    }

    // Animate Rings
    ringsRef.current.forEach((ring, i) => {
      const ringT = (t + i * 0.5) % 1.5;
      const scale = 1 + ringT * 3;
      ring.scale.set(scale, scale, scale);
      (ring.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - ringT / 1.5);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/40 backdrop-blur-md">
      <ThreeCanvas onAnimate={handleAnimate} />
      
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 bg-blue-600/20 border border-blue-500/50 rounded-full flex items-center justify-center mb-8 mx-auto"
        >
          <div className="w-12 h-12 bg-blue-500 rounded-full animate-ping" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-display font-bold text-white mb-2"
        >
          {senderName} wants proof.
        </motion.h2>
        <p className="text-blue-200 text-lg tracking-widest uppercase font-medium">
          Accountability Check Triggered
        </p>
      </div>
    </div>
  );
}
