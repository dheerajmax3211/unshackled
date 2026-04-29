"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* ── Burning Cigarette ── */
function Cigarette() {
  const groupRef = useRef<THREE.Group>(null);
  const smokeRef = useRef<THREE.Points>(null);
  const emberRef = useRef<THREE.Mesh>(null);

  const smokePositions = useMemo(() => {
    const arr = new Float32Array(60 * 3);
    for (let i = 0; i < 60; i++) arr[i * 3 + 1] = Math.random() * 2;
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z += delta * 0.2;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;

    if (emberRef.current) {
      const s = (emberRef.current.material as THREE.MeshStandardMaterial);
      s.emissiveIntensity = 2 + Math.sin(state.clock.elapsedTime * 8) * 0.8;
    }

    if (smokeRef.current) {
      const pos = smokeRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 60; i++) {
        pos[i * 3 + 1] += delta * 0.3;
        pos[i * 3] += (Math.random() - 0.5) * delta * 0.1;
        if (pos[i * 3 + 1] > 3) pos[i * 3 + 1] = 0;
      }
      smokeRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} position={[-2.2, 0.6, -1]}>
        <mesh rotation={[0.2, 0.4, 0.8]}>
          <cylinderGeometry args={[0.1, 0.1, 1.6, 16]} />
          <meshStandardMaterial color="#fafaf5" roughness={0.4} metalness={0.05} />
        </mesh>
        <mesh ref={emberRef} position={[0, 0.85, 0]} rotation={[0.2, 0.4, 0.8]}>
          <cylinderGeometry args={[0.09, 0.08, 0.15, 16]} />
          <meshStandardMaterial color="#ff4500" emissive="#ff3300" emissiveIntensity={2.5} roughness={0.2} />
        </mesh>
        <pointLight position={[0, 0.85, 0]} intensity={0.6} color="#ff4500" distance={2} />
        <points ref={smokeRef} position={[0, 0.95, 0]}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={60} array={smokePositions} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.04} color="#888" transparent opacity={0.4} depthWrite={false} blending={THREE.NormalBlending} />
        </points>
      </group>
    </Float>
  );
}

/* ── Shattering Bottle ── */
function Bottle() {
  const groupRef = useRef<THREE.Group>(null);
  const liquidRef = useRef<THREE.Mesh>(null);
  const piecesRef = useRef<THREE.Group>(null);

  const pieces = useMemo(() => {
    return Array.from({ length: 12 }, () => ({
      pos: [(Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 0.5],
      rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      scale: 0.04 + Math.random() * 0.06,
    }));
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;

    if (liquidRef.current) {
      liquidRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }

    if (piecesRef.current) {
      piecesRef.current.children.forEach((child, i) => {
        child.position.y += delta * (0.5 + i * 0.05);
        child.rotation.x += delta * (1 + i * 0.2);
        child.rotation.z += delta * 0.5;
        if (child.position.y > 2) child.position.y = -2;
      });
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={groupRef} position={[1.6, -0.3, -0.5]}>
        {/* Bottle body */}
        <mesh rotation={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.18, 0.14, 1.2, 32, 1, true]} />
          <meshPhysicalMaterial
            color="#88ccaa" roughness={0.05} metalness={0} transparent opacity={0.45}
            clearcoat={1} clearcoatRoughness={0.05} envMapIntensity={1.5}
          />
        </mesh>
        {/* Bottle neck */}
        <mesh position={[0, 0.72, 0]} rotation={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.06, 0.1, 0.35, 16]} />
          <meshPhysicalMaterial
            color="#88ccaa" roughness={0.05} metalness={0} transparent opacity={0.45}
            clearcoat={1} clearcoatRoughness={0.05}
          />
        </mesh>
        {/* Liquid */}
        <mesh ref={liquidRef} position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.5, 16]} />
          <meshStandardMaterial color="#2d8a4e" roughness={0.3} metalness={0.1} transparent opacity={0.6} />
        </mesh>
        {/* Shattering glass pieces */}
        <group ref={piecesRef}>
          {pieces.map((p, i) => (
            <mesh key={i} position={p.pos as [number, number, number]} rotation={p.rot as [number, number, number]}>
              <boxGeometry args={[p.scale, p.scale * 1.3, p.scale * 0.5]} />
              <meshPhysicalMaterial color="#aaddcc" roughness={0.1} transparent opacity={0.3} />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
}

/* ── Pulsing Pill ── */
function Pills() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
    groupRef.current.rotation.y += 0.005;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.6}>
      <group ref={groupRef} position={[-1, -0.7, -1.8]}>
        {/* Red pill */}
        <mesh position={[-0.35, 0, 0]}>
          <capsuleGeometry args={[0.12, 0.3, 4, 8]} />
          <meshStandardMaterial color="#ff4d4d" roughness={0.2} metalness={0.3} emissive="#330000" emissiveIntensity={0.4} />
        </mesh>
        {/* Blue pill */}
        <mesh position={[0.35, 0.1, 0.05]}>
          <capsuleGeometry args={[0.12, 0.3, 4, 8]} />
          <meshStandardMaterial color="#4d79ff" roughness={0.2} metalness={0.3} emissive="#000033" emissiveIntensity={0.4} />
        </mesh>
        {/* White pill */}
        <mesh position={[0, 0.35, -0.1]} rotation={[Math.PI / 3, 0, 0]}>
          <capsuleGeometry args={[0.08, 0.18, 4, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.4} emissive="#111122" emissiveIntensity={0.15} />
        </mesh>
      </group>
    </Float>
  );
}

/* ── Cracking Phone ── */
function Phone() {
  const groupRef = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const crackLinesRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.3;
    groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.4;

    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      const flicker = Math.random() > 0.97 ? 0.3 : 0.9;
      mat.emissiveIntensity = 0.2 + flicker * 0.6;
    }

    if (crackLinesRef.current) {
      crackLinesRef.current.children.forEach((child, i) => {
        child.position.x += (Math.random() - 0.5) * delta * 0.02;
        child.position.y += (Math.random() - 0.5) * delta * 0.02;
      });
    }
  });

  const crackedGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.4, -0.7);
    shape.lineTo(0.4, -0.7);
    shape.lineTo(0.4, 0.7);
    shape.lineTo(-0.4, 0.7);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);

  return (
    <Float speed={1.3} rotationIntensity={0.2} floatIntensity={0.35}>
      <group ref={groupRef} position={[2.2, 0.3, -2]}>
        {/* Phone body */}
        <mesh rotation={[0.3, 0.5, 0.1]}>
          <boxGeometry args={[0.9, 1.5, 0.06]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.9} />
        </mesh>
        {/* Screen */}
        <mesh ref={screenRef} position={[0, 0, 0.04]} rotation={[0.3, 0.5, 0.1]}>
          <planeGeometry args={[0.78, 1.35]} />
          <meshStandardMaterial
            color="#0a0a1a" emissive="#2244aa" emissiveIntensity={0.5}
            roughness={0.05} metalness={0.7}
          />
        </mesh>
        {/* Crack lines */}
        <group ref={crackLinesRef} position={[0, 0, 0.05]} rotation={[0.3, 0.5, 0.1]}>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} position={[(Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.8, 0]} rotation={[0, 0, i * 0.7]}>
              <planeGeometry args={[0.01, 0.2 + Math.random() * 0.3]} />
              <meshBasicMaterial color="#88aaff" transparent opacity={0.5} />
            </mesh>
          ))}
        </group>
      </group>
    </Float>
  );
}

/* ── Atmospheric Particles ── */
function AtmosphereParticles() {
  const count = 200;
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 8;
      p[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return p;
  }, []);

  const ref = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.03;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += delta * 0.08;
      if (pos[i * 3 + 1] > 4) pos[i * 3 + 1] = -4;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#F59E0B" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

/* ── Scene ── */
function SceneContent() {
  const { camera } = useThree();

  useFrame((state) => {
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.3;
    camera.position.y = Math.cos(state.clock.elapsedTime * 0.08) * 0.2;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.35} color="#111133" />
      <directionalLight position={[5, 3, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-3, 1, -2]} intensity={0.5} color="#ff6633" />
      <pointLight position={[2, -1, -3]} intensity={0.4} color="#3366ff" />
      <pointLight position={[0, 2, 1]} intensity={0.3} color="#ffaa33" />
      <Cigarette />
      <Bottle />
      <Pills />
      <Phone />
      <AtmosphereParticles />
    </>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        style={{ background: "transparent" }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
