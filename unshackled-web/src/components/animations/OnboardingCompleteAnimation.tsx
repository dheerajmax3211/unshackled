"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import ThreeCanvas from "./ThreeCanvas";

interface OnboardingCompleteAnimationProps {
  onComplete?: () => void;
}

const vertexShader = `
  uniform float uTime;
  attribute float aSize;
  attribute vec3 aVelocity;
  varying float vOpacity;

  void main() {
    // Basic explosion: position += velocity * time
    // We also add some gravity/drag slowing it down over time
    float t = clamp(uTime * 0.8, 0.0, 5.0);
    vec3 newPosition = position + aVelocity * t;
    
    // Fade out as they move away
    vOpacity = 1.0 - (t / 5.0);

    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying float vOpacity;

  void main() {
    // Circle shape for particles
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;

    // Golden nova color
    vec3 color = vec3(1.0, 0.84, 0.0); // Gold
    gl_FragColor = vec4(color, vOpacity);
  }
`;

/**
 * Onboarding Complete Animation:
 * A golden nova particle explosion celebrating the user's decision to quit.
 */
export default function OnboardingCompleteAnimation({ onComplete }: OnboardingCompleteAnimationProps) {
  const pointsRef = useRef<THREE.Points | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 500);
    const endTimer = setTimeout(() => onComplete?.(), 5000);
    return () => {
      clearTimeout(timer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  const handleAnimate = ({ scene, clock }: any) => {
    if (!pointsRef.current) {
      // Initialize Particles
      const count = 2000;
      const geometry = new THREE.BufferGeometry();
      
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);
      const sizes = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        // Start at center
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;

        // Random spherical velocity
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const speed = 2 + Math.random() * 5;

        velocities[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
        velocities[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta);
        velocities[i * 3 + 2] = speed * Math.cos(phi);

        sizes[i] = 1 + Math.random() * 3;
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("aVelocity", new THREE.BufferAttribute(velocities, 3));
      geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);
      pointsRef.current = points;
      materialRef.current = material;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <ThreeCanvas onAnimate={handleAnimate} />
      
      <AnimatePresence>
        {showText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 text-center px-6"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 drop-shadow-2xl">
              Unshackled.
            </h2>
            <p className="text-xl md:text-2xl text-gold-400 font-medium max-w-xl mx-auto drop-shadow-lg">
              You just made the most important decision of your life.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
