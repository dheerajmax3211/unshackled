"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function GeometricShapes() {
  const groupRef = useRef<THREE.Group>(null);

  const shapes = useMemo(() => {
    const items = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const type = i % 3;
      const radius = 2.5 + Math.random() * 1.5;
      const angle = (i / count) * Math.PI * 2;
      const y = (Math.random() - 0.5) * 4;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const scale = 0.2 + Math.random() * 0.5;
      const rotationSpeed = 0.1 + Math.random() * 0.3;
      const emissiveIntensity = 0.3 + Math.random() * 0.5;
      items.push({ type, position: [x, y, z] as [number, number, number], scale, rotationSpeed, emissiveIntensity });
    }
    return items;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
    groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.05;
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
          <ShapeMesh
            position={shape.position}
            type={shape.type}
            scale={shape.scale}
            emissiveIntensity={shape.emissiveIntensity}
          />
        </Float>
      ))}
    </group>
  );
}

function ShapeMesh({
  position,
  type,
  scale,
  emissiveIntensity,
}: {
  position: [number, number, number];
  type: number;
  scale: number;
  emissiveIntensity: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    if (type === 0) return new THREE.IcosahedronGeometry(1, 1);
    if (type === 1) return new THREE.TorusKnotGeometry(0.6, 0.15, 64, 8, 2, 3);
    return new THREE.OctahedronGeometry(0.7, 1);
  }, [type]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.003;
    meshRef.current.rotation.y += 0.005;
  });

  const material = useMemo(() => {
    const baseColor = new THREE.Color("#F59E0B").multiplyScalar(0.6 + emissiveIntensity * 0.4);
    return new THREE.MeshPhysicalMaterial({
      color: baseColor,
      emissive: new THREE.Color("#F59E0B"),
      emissiveIntensity,
      metalness: 0.1,
      roughness: 0.4,
      transparent: true,
      opacity: 0.5,
      wireframe: Math.random() > 0.5,
    });
  }, [emissiveIntensity]);

  return (
    <mesh ref={meshRef} position={position} scale={scale} geometry={geometry} material={material} />
  );
}

function Particles() {
  const count = 300;
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#FCD34D"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.2} color="#F59E0B" />
        <pointLight position={[2, 2, 2]} intensity={0.4} color="#F59E0B" />
        <pointLight position={[-2, -1, -1]} intensity={0.2} color="#FCD34D" />
        <GeometricShapes />
        <Particles />
      </Canvas>
    </div>
  );
}
