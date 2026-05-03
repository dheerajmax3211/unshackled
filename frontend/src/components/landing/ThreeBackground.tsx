"use client";

import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ═══════════════════════════════════════
   VOID PARTICLES — 10,000 micro-particles
   Mouse-reactive with ambient pulse
   ═══════════════════════════════════════ */
function VoidParticles({ mouse, isMobile }: { mouse: React.MutableRefObject<[number, number]>; isMobile: boolean }) {
  const count = isMobile ? 4000 : 10000;
  const ref = useRef<THREE.Points>(null);

  const { positions, basePositions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Sphere distribution with depth
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 12;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = -2 - Math.random() * 18;

      pos[i3] = x;
      pos[i3 + 1] = y;
      pos[i3 + 2] = z;
      base[i3] = x;
      base[i3 + 1] = y;
      base[i3 + 2] = z;

      // Near-black base with occasional shimmer (~5% particles get color)
      const shimmer = Math.random();
      if (shimmer > 0.97) {
        // Amber shimmer
        col[i3] = 0.96; col[i3 + 1] = 0.62; col[i3 + 2] = 0.04;
      } else if (shimmer > 0.94) {
        // Blue shimmer
        col[i3] = 0.23; col[i3 + 1] = 0.51; col[i3 + 2] = 0.96;
      } else {
        // Bright stardust to cut through dark backgrounds with AdditiveBlending
        const intensity = 0.4 + Math.random() * 0.4;
        col[i3] = intensity * 0.8; 
        col[i3 + 1] = intensity * 0.9; 
        col[i3 + 2] = intensity;
      }
    }
    return { positions: pos, basePositions: base, colors: col };
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    const [mx, my] = mouse.current;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Ambient drift
      arr[i3] = basePositions[i3] + Math.sin(t * 0.1 + i * 0.01) * 0.15;
      arr[i3 + 1] = basePositions[i3 + 1] + Math.cos(t * 0.08 + i * 0.013) * 0.12;
      arr[i3 + 2] = basePositions[i3 + 2] + Math.sin(t * 0.06 + i * 0.017) * 0.08;

      // Mouse magnetic repulsion (project mouse to world space approx)
      const dx = arr[i3] - mx * 8;
      const dy = arr[i3 + 1] - my * 5;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 2.5) {
        const force = (2.5 - dist) / 2.5 * 0.4;
        arr[i3] += (dx / dist) * force;
        arr[i3 + 1] += (dy / dist) * force;
      }
    }

    ref.current.geometry.attributes.position.needsUpdate = true;

    // Subtle ambient rhythm pulse on material
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.75 + Math.sin(t * 0.5) * 0.15;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/* ═══════════════════════════════════════
   ABSTRACT SIGILS — wireframe geometric forms
   Represent vices abstractly, not literally
   ═══════════════════════════════════════ */
interface SigilProps {
  position: [number, number, number];
  geometry: "icosahedron" | "torus" | "torusKnot" | "octahedron" | "dodecahedron";
  rotationSpeed: [number, number, number];
  scale: number;
}

function Sigil({ position, geometry, rotationSpeed, scale }: SigilProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x += rotationSpeed[0] * 0.003;
    ref.current.rotation.y += rotationSpeed[1] * 0.003;
    ref.current.rotation.z += rotationSpeed[2] * 0.003;

    // Breathing opacity
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.25 + Math.sin(t * 0.3 + position[0]) * 0.1;
  });

  const geomElement = useMemo(() => {
    switch (geometry) {
      case "icosahedron": return <icosahedronGeometry args={[1, 1]} />;
      case "torus": return <torusGeometry args={[1, 0.3, 8, 16]} />;
      case "torusKnot": return <torusKnotGeometry args={[0.8, 0.25, 64, 8]} />;
      case "octahedron": return <octahedronGeometry args={[1, 0]} />;
      case "dodecahedron": return <dodecahedronGeometry args={[1, 0]} />;
    }
  }, [geometry]);

  return (
    <mesh ref={ref} position={position} scale={scale}>
      {geomElement}
      <meshBasicMaterial
        wireframe
        color="#ffffff"
        transparent
        opacity={0.25}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

const sigils: SigilProps[] = [
  { position: [-8, 4, -16], geometry: "icosahedron", rotationSpeed: [0.4, 0.6, 0.2], scale: 1.2 },
  { position: [7, -3, -20], geometry: "torus", rotationSpeed: [0.3, -0.5, 0.4], scale: 1.5 },
  { position: [-4, -5, -14], geometry: "torusKnot", rotationSpeed: [-0.2, 0.4, 0.3], scale: 0.8 },
  { position: [9, 5, -18], geometry: "octahedron", rotationSpeed: [0.5, 0.3, -0.4], scale: 1.0 },
  { position: [0, 6, -22], geometry: "dodecahedron", rotationSpeed: [-0.3, 0.5, 0.2], scale: 1.3 },
  { position: [-10, -2, -17], geometry: "icosahedron", rotationSpeed: [0.2, -0.3, 0.5], scale: 0.9 },
  { position: [6, -6, -15], geometry: "torus", rotationSpeed: [-0.4, 0.2, -0.3], scale: 1.1 },
];

/* GodRays removed — caused visible hard-edged rectangle behind hero text */

/* ═══════════════════════════════════════
   SCENE CONTAINER — with mouse parallax
   ═══════════════════════════════════════ */
function SceneContent({ mouse, isMobile }: { mouse: React.MutableRefObject<[number, number]>; isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const targetX = useRef(0);
  const targetY = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;
    const [mx, my] = mouse.current;
    // Mouse parallax: ±2% with 0.08 damping
    targetX.current += (mx * 0.24 - targetX.current) * 0.08;
    targetY.current += (my * 0.16 - targetY.current) * 0.08;
    groupRef.current.position.x = targetX.current;
    groupRef.current.position.y = targetY.current;
  });

  return (
    <group ref={groupRef}>
      <VoidParticles mouse={mouse} isMobile={isMobile} />
      {sigils.map((s, i) => (
        <Sigil key={i} {...s} />
      ))}

      {/* Subtle rim lights — no GodRays */}
      <pointLight position={[0, -8, 2]} intensity={0.3} color="#F59E0B" distance={20} />
      <pointLight position={[-4, -6, 0]} intensity={0.15} color="#3B82F6" distance={15} />
      <ambientLight intensity={0.01} color="#0A0A1A" />
    </group>
  );
}

/* ═══════════════════════════════════════
   EXPORTED COMPONENT
   Dynamic import with ssr: false handled by consumer
   ═══════════════════════════════════════ */
export default function ThreeBackground() {
  const mouse = useRef<[number, number]>([0, 0]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    // Normalize to [-1, 1]
    mouse.current = [
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1,
    ];
  }, []);

  return (
    <div
      className="fixed inset-0 z-0"
      onPointerMove={handlePointerMove}
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          toneMapping: THREE.NoToneMapping,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <fog attach="fog" args={["#000005", 5, 25]} />
        <SceneContent mouse={mouse} isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
