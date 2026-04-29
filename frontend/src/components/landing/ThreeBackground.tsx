"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// --- Physics Constants ---
const BOUNDS = { x: 12, y: 8, z: 4 };

// --- Helpers ---
function rng(scale: number) { return (Math.random() - 0.5) * scale; }
function rngPos() { return [rng(BOUNDS.x * 2), rng(BOUNDS.y * 2), rng(BOUNDS.z * 2) - 2] as [number, number, number]; }
function rngVel(speed: number) { return [rng(speed), rng(speed), rng(speed)] as [number, number, number]; }
function rngRot() { return [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2] as [number, number, number]; }

// --- Physics Hook ---
function useSlowBouncePhysics(
  ref: React.RefObject<THREE.Group | THREE.Mesh>,
  speed: number,
  rotSpeed: number
) {
  const vel = useRef(new THREE.Vector3(...rngVel(speed)));
  const rotVel = useRef(new THREE.Vector3(...rngVel(rotSpeed)));

  useFrame((_, delta) => {
    if (!ref.current) return;
    
    // Slow float movement
    ref.current.position.addScaledVector(vel.current, delta);
    ref.current.rotation.x += rotVel.current.x * delta;
    ref.current.rotation.y += rotVel.current.y * delta;
    ref.current.rotation.z += rotVel.current.z * delta;

    // Invisible Bouncing Box
    if (Math.abs(ref.current.position.x) > BOUNDS.x) vel.current.x *= -1;
    if (Math.abs(ref.current.position.y) > BOUNDS.y) vel.current.y *= -1;
    if (ref.current.position.z > BOUNDS.z || ref.current.position.z < -BOUNDS.z - 4) vel.current.z *= -1;
  });
}

// --- 1. Realistic Cigarette ---
function Cigarette({ pos }: { pos: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useSlowBouncePhysics(ref, 0.4, 0.2);
  
  const isLit = Math.random() > 0.5;
  const smokeRef = useRef<THREE.Points>(null);
  const smokePos = useMemo(() => {
    const a = new Float32Array(80 * 3);
    for (let i = 0; i < 80; i++) { a[i*3] = rng(0.04); a[i*3+1] = Math.random()*2; a[i*3+2] = rng(0.04); }
    return a;
  }, []);

  useFrame((_, delta) => {
    if (isLit && smokeRef.current) {
      const a = smokeRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 80; i++) {
        a[i*3+1] += delta * (0.2 + Math.random()*0.1);
        a[i*3] += (Math.random()-0.5) * delta * 0.05;
        if (a[i*3+1] > 2) { a[i*3+1] = 0; a[i*3] = rng(0.04); }
      }
      smokeRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={ref} position={pos} rotation={rngRot()}>
      {/* Filter */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.25, 16]} />
        <meshPhysicalMaterial color="#d4a373" roughness={0.8} clearcoat={0.1} />
      </mesh>
      {/* Paper */}
      <mesh position={[0, -0.125, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.9, 16]} />
        <meshPhysicalMaterial color="#fefefe" roughness={0.9} />
      </mesh>
      {/* Lit Ember & Smoke */}
      {isLit && (
        <>
          <mesh position={[0, -0.58, 0]}>
            <sphereGeometry args={[0.036, 12, 12]} />
            <meshStandardMaterial color="#ff2a00" emissive="#ff3300" emissiveIntensity={4} roughness={0.2} />
          </mesh>
          <pointLight position={[0, -0.6, 0]} intensity={1.5} color="#ff4400" distance={1.5} />
          <points ref={smokeRef} position={[0, -0.6, 0]} rotation={[Math.PI, 0, 0]}>
            <bufferGeometry><bufferAttribute attach="attributes-position" count={80} array={smokePos} itemSize={3} /></bufferGeometry>
            <pointsMaterial size={0.02} color="#cccccc" transparent opacity={0.15} depthWrite={false} blending={THREE.AdditiveBlending} />
          </points>
        </>
      )}
    </group>
  );
}

// --- 2. Realistic Whiskey Glass ---
function WhiskeyGlass({ pos }: { pos: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useSlowBouncePhysics(ref, 0.3, 0.15);

  return (
    <group ref={ref} position={pos} rotation={rngRot()}>
      {/* Glass */}
      <mesh>
        <cylinderGeometry args={[0.22, 0.18, 0.45, 32, 1, true]} />
        <meshPhysicalMaterial color="#ffffff" transmission={1} opacity={1} roughness={0.05} ior={1.5} thickness={0.02} side={THREE.DoubleSide} />
      </mesh>
      {/* Glass Base */}
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.05, 32]} />
        <meshPhysicalMaterial color="#ffffff" transmission={1} opacity={1} roughness={0.1} ior={1.5} thickness={0.1} />
      </mesh>
      {/* Liquid (Amber) */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.19, 0.175, 0.25, 32]} />
        <meshPhysicalMaterial color="#b35900" transmission={0.8} opacity={0.9} roughness={0.1} ior={1.33} thickness={0.1} />
      </mesh>
      {/* Ice Cube */}
      <mesh position={[0.05, -0.05, 0.05]} rotation={[0.4, 0.2, 0.1]}>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshPhysicalMaterial color="#e6f2ff" transmission={0.9} opacity={1} roughness={0.05} ior={1.31} thickness={0.05} />
      </mesh>
    </group>
  );
}

// --- 3. Realistic Mobile Phone (Screens) ---
function Phone({ pos }: { pos: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useSlowBouncePhysics(ref, 0.25, 0.2);
  
  // Random addictive app glow (Blue for social, Pink for dating/porn)
  const isSocial = Math.random() > 0.5;
  const glowColor = isSocial ? "#3b82f6" : "#ec4899";

  return (
    <group ref={ref} position={pos} rotation={rngRot()}>
      {/* Chassis */}
      <mesh>
        <boxGeometry args={[0.4, 0.8, 0.04]} />
        <meshPhysicalMaterial color="#1f2937" roughness={0.4} metalness={0.8} clearcoat={0.3} />
      </mesh>
      {/* Screen Glow */}
      <mesh position={[0, 0, 0.021]}>
        <planeGeometry args={[0.36, 0.76]} />
        <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={1.5} roughness={0.2} />
      </mesh>
      <pointLight position={[0, 0, 0.1]} intensity={0.5} color={glowColor} distance={2} />
    </group>
  );
}

// --- 4. Realistic Pills ---
function Pill({ pos, color }: { pos: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useSlowBouncePhysics(ref, 0.5, 0.4);

  return (
    <mesh ref={ref} position={pos} rotation={rngRot()}>
      <capsuleGeometry args={[0.04, 0.12, 16, 16]} />
      <meshPhysicalMaterial color={color} roughness={0.15} clearcoat={1} clearcoatRoughness={0.1} />
    </mesh>
  );
}

// --- 5. Cannabis Leaf ---
function LeafGeom() {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    function leaflet(angle: number, len: number) {
      const cos = Math.cos(angle), sin = Math.sin(angle), w = len * 0.25;
      s.moveTo(cos*len*0.05, sin*len*0.05);
      s.bezierCurveTo(cos*len*0.3 - sin*w, sin*len*0.3 + cos*w, cos*len*0.7 - sin*w*0.5, sin*len*0.7 + cos*w*0.5, cos*len - sin*w*0.15, sin*len + cos*w*0.15);
      s.bezierCurveTo(cos*len*0.85, sin*len*0.85, cos*len*0.85, sin*len*0.85, cos*len, sin*len);
      s.bezierCurveTo(cos*len*0.7 + sin*w*0.5, sin*len*0.7 - cos*w*0.5, cos*len*0.3 + sin*w, sin*len*0.3 - cos*w, cos*len*0.05, sin*len*0.05);
    }
    leaflet(Math.PI/2, 0.9); leaflet(Math.PI/6, 0.75); leaflet(-Math.PI/6, 0.75);
    leaflet(-Math.PI/2, 0.55); leaflet(Math.PI*5/6, 0.55); leaflet(-Math.PI*5/6, 0.55);
    leaflet(Math.PI/2+0.35, 0.5);
    return new THREE.ShapeGeometry(s);
  }, []);
  return <primitive object={shape} attach="geometry" />;
}

function CannabisLeaf({ pos }: { pos: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useSlowBouncePhysics(ref, 0.35, 0.25);

  return (
    <group ref={ref} position={pos} rotation={rngRot()}>
      <mesh scale={[0.3, 0.3, 0.3]}>
        <LeafGeom />
        <meshPhysicalMaterial color="#1a4d2e" roughness={0.6} clearcoat={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// --- 6. Realistic Velvety Silhouette ---
function Silhouette({ pos }: { pos: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useSlowBouncePhysics(ref, 0.2, 0.1);

  // Use a highly light-absorbing, velvety material to create an elegant, non-explicit silhouette.
  const velvetMat = <meshPhysicalMaterial color="#050508" roughness={0.9} clearcoat={0} transmission={0} sheen={1} sheenColor="#2a2a35" />;

  return (
    <group ref={ref} position={pos} rotation={rngRot()}>
      {/* Abstracted curves representing a body silhouette */}
      <mesh position={[0, 0.6, 0]}><sphereGeometry args={[0.15, 32, 32]} />{velvetMat}</mesh>
      <mesh position={[0, 0.2, 0]}><capsuleGeometry args={[0.18, 0.4, 32, 32]} />{velvetMat}</mesh>
      <mesh position={[0, -0.4, 0]}><capsuleGeometry args={[0.22, 0.5, 32, 32]} />{velvetMat}</mesh>
    </group>
  );
}

// --- Scene Composition ---
const pillColors = ["#ef4444", "#3b82f6", "#f8fafc", "#f59e0b", "#10b981", "#8b5cf6"];

function SceneContent() {
  return (
    <>
      {/* Realistic Moody Lighting */}
      <ambientLight intensity={0.2} color="#1e293b" />
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#f8fafc" castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#94a3b8" />
      <pointLight position={[0, 0, 0]} intensity={0.8} color="#cbd5e1" distance={20} />

      {/* Render slowly floating objects */}
      {[...Array(12)].map((_, i) => <Cigarette key={`c${i}`} pos={rngPos()} />)}
      {[...Array(8)].map((_, i) => <WhiskeyGlass key={`w${i}`} pos={rngPos()} />)}
      {[...Array(6)].map((_, i) => <Phone key={`p${i}`} pos={rngPos()} />)}
      {[...Array(24)].map((_, i) => <Pill key={`m${i}`} pos={rngPos()} color={pillColors[i % pillColors.length]} />)}
      {[...Array(10)].map((_, i) => <CannabisLeaf key={`l${i}`} pos={rngPos()} />)}
      {[...Array(5)].map((_, i) => <Silhouette key={`s${i}`} pos={rngPos()} />)}
    </>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
        style={{ background: "transparent" }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
