"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ── Random scatter helper ── */
function rng(scale: number) { return (Math.random() - 0.5) * scale; }
function rngPos() { return [rng(14), rng(9), -1 - Math.random() * 5] as [number, number, number]; }
function rngRot() { return [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI] as [number, number, number]; }

/* ── Realistic Cigarette ── */
function Cigarette({ pos, spd }: { pos: [number,number,number]; spd: number }) {
  const ref = useRef<THREE.Group>(null);
  const eRef = useRef<THREE.Mesh>(null);
  const smokeRef = useRef<THREE.Points>(null);
  const smokePos = useMemo(() => {
    const a = new Float32Array(50 * 3);
    for (let i = 0; i < 50; i++) { a[i*3] = rng(0.04); a[i*3+1] = Math.random()*1.6; a[i*3+2] = rng(0.04); }
    return a;
  }, []);

  useFrame((_s, delta) => {
    if (!ref.current) return;
    ref.current.position.x += delta * spd * 0.15;
    ref.current.position.y += Math.sin(ref.current.position.x * 0.3) * delta * 0.3;
    ref.current.rotation.z += delta * 0.25;
    if (eRef.current) (eRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 3 + Math.random() * 1.5;
    if (smokeRef.current) {
      const a = smokeRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 50; i++) {
        a[i*3+1] += delta * (0.4 + Math.random()*0.35);
        a[i*3] += (Math.random()-0.5) * delta * 0.07;
        if (a[i*3+1] > 1.6) { a[i*3+1] = 0; a[i*3] = rng(0.04); }
      }
      smokeRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={ref} position={pos}>
      <mesh position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 0.28, 14]} />
        <meshStandardMaterial color="#C4A060" roughness={0.65} />
      </mesh>
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 0.55, 14]} />
        <meshStandardMaterial color="#FAFAF6" roughness={0.45} />
      </mesh>
      <mesh ref={eRef} position={[0, -0.38, 0]}>
        <sphereGeometry args={[0.025, 10, 10]} />
        <meshStandardMaterial color="#FF4400" emissive="#FF3300" emissiveIntensity={3.5} roughness={0.1} />
      </mesh>
      <points ref={smokeRef} position={[0, -0.4, 0.02]}>
        <bufferGeometry><bufferAttribute attach="attributes-position" count={50} array={smokePos} itemSize={3} /></bufferGeometry>
        <pointsMaterial size={0.016} color="#999" transparent opacity={0.2} depthWrite={false} blending={THREE.NormalBlending} />
      </points>
    </group>
  );
}

/* ── Beer Glass ── */
function BeerGlass({ pos, spd }: { pos: [number,number,number]; spd: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_s, delta) => {
    if (!ref.current) return;
    ref.current.position.x += delta * spd * 0.12;
    ref.current.position.y += Math.sin(ref.current.position.x * 0.5) * delta * 0.3;
  });
  return (
    <group ref={ref} position={pos}>
      <mesh rotation={[0.15, 0.25, -0.1]}>
        <cylinderGeometry args={[0.13, 0.09, 0.65, 20, 1, true]} />
        <meshStandardMaterial color="#CCDDCC" roughness={0.08} metalness={0.05} transparent opacity={0.35} />
      </mesh>
      <mesh position={[0, -0.05, 0]} rotation={[0.15, 0.25, -0.1]}>
        <cylinderGeometry args={[0.1, 0.09, 0.4, 14]} />
        <meshStandardMaterial color="#E8A020" roughness={0.25} metalness={0.1} transparent opacity={0.65} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.13, 14, 6, 0, Math.PI*2, 0, Math.PI/3]} />
        <meshStandardMaterial color="#FFF8E8" roughness={0.6} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 0.24, 0]} rotation={[0.15, 0.25, -0.1]}>
        <torusGeometry args={[0.13, 0.012, 6, 18]} />
        <meshStandardMaterial color="#DDDDCC" roughness={0.1} metalness={0.1} transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

/* ── Pill ── */
function Pill({ pos, color, spd }: { pos: [number,number,number]; color: string; spd: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_s, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * spd * 0.6;
    ref.current.rotation.z += delta * spd * 0.7;
    ref.current.position.x += delta * spd * 0.1;
    ref.current.position.y += Math.sin(ref.current.position.x * 0.6 + ref.current.position.z) * delta * 0.35;
  });
  return (
    <mesh ref={ref} position={pos} rotation={rngRot()}>
      <capsuleGeometry args={[0.035 + Math.random()*0.05, 0.15 + Math.random()*0.2, 4, 8]} />
      <meshStandardMaterial color={color} roughness={0.22} metalness={0.3} />
    </mesh>
  );
}

/* ── Cannabis Leaf ── */
function LeafGeom() {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    function leaflet(angle: number, len: number) {
      const cos = Math.cos(angle), sin = Math.sin(angle), w = len * 0.28;
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

function CannabisLeaf({ pos, spd }: { pos: [number,number,number]; spd: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_s, delta) => {
    if (!ref.current) return;
    ref.current.rotation.z += delta * spd * 0.4;
    ref.current.position.x += delta * spd * 0.08;
    ref.current.position.y += Math.sin(ref.current.position.x * 0.4) * delta * 0.25;
  });
  return (
    <group ref={ref} position={pos}>
      <mesh scale={[0.35, 0.35, 0.35]}>
        <LeafGeom />
        <meshStandardMaterial color={Math.random() > 0.5 ? "#1B5E20" : "#2E7D32"} roughness={0.4} side={THREE.DoubleSide} emissive="#0A1A0A" emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
}

/* ── Silhouette ── */
function Silhouette({ pos, spd }: { pos: [number,number,number]; spd: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_s, delta) => {
    if (!ref.current) return;
    ref.current.position.x += delta * spd * 0.06;
    ref.current.position.y += Math.sin(ref.current.position.x * 0.25) * delta * 0.2;
  });
  const mat = <meshStandardMaterial color="#1A0A0A" roughness={0.9} />;
  return (
    <group ref={ref} position={pos}>
      <mesh position={[0, 0.95, 0]}><sphereGeometry args={[0.09, 10, 10]} />{mat}</mesh>
      <mesh position={[0, 0.81, 0]}><cylinderGeometry args={[0.03, 0.035, 0.08, 6]} />{mat}</mesh>
      <mesh position={[0, 0.68, 0]}><sphereGeometry args={[0.14, 10, 8, 0, Math.PI*2, 0, Math.PI/1.6]} />{mat}</mesh>
      <mesh position={[-0.06, 0.56, 0.06]}><sphereGeometry args={[0.07, 6, 6]} />{mat}</mesh>
      <mesh position={[0.06, 0.56, 0.06]}><sphereGeometry args={[0.07, 6, 6]} />{mat}</mesh>
      <mesh position={[0, 0.38, 0]}><cylinderGeometry args={[0.06, 0.09, 0.35, 8]} />{mat}</mesh>
      <mesh position={[0, 0.12, 0]}><sphereGeometry args={[0.11, 8, 6, 0, Math.PI*2, Math.PI/4, Math.PI/2.5]} />{mat}</mesh>
      <mesh position={[-0.04, -0.2, 0]}><cylinderGeometry args={[0.04, 0.05, 0.5, 6]} />{mat}</mesh>
      <mesh position={[0.04, -0.2, 0]}><cylinderGeometry args={[0.04, 0.05, 0.5, 6]} />{mat}</mesh>
      <mesh position={[0, 1.02, 0]}><sphereGeometry args={[0.1, 8, 6, 0, Math.PI*2, 0, Math.PI/2]} /><meshStandardMaterial color="#0A0000" roughness={0.95} /></mesh>
      <pointLight position={[0, 0.6, 0.5]} intensity={0.35} color="#FF4466" distance={2} />
    </group>
  );
}

/* ── Broken Screen ── */
function BrokenScreen({ pos, spd }: { pos: [number,number,number]; spd: number }) {
  const ref = useRef<THREE.Group>(null);
  const w = 0.35 + Math.random() * 0.6, h = 0.5 + Math.random() * 0.8;
  const cracks = useMemo(() => Array.from({length:5}, () => ({x:rng(w*0.7), y:rng(h*0.5), len:0.08+Math.random()*0.3, ang:Math.random()*Math.PI})), []);
  useFrame((_s, delta) => {
    if (!ref.current) return;
    ref.current.position.x += delta * spd * 0.1;
    ref.current.position.y += Math.cos(ref.current.position.x * 0.3) * delta * 0.2;
  });
  return (
    <group ref={ref} position={pos} rotation={[rng(0.3), rng(0.5), rng(0.1)]}>
      <mesh><boxGeometry args={[w, h, 0.03]} /><meshStandardMaterial color="#1A1A1A" roughness={0.15} metalness={0.9} /></mesh>
      <mesh position={[0,0,0.017]}><planeGeometry args={[w-0.06, h-0.06]} /><meshStandardMaterial color="#0A0A1A" roughness={0.05} metalness={0.5} emissive="#112244" emissiveIntensity={0.35} /></mesh>
      {cracks.map((c, i) => <mesh key={i} position={[c.x, c.y, 0.018]} rotation={[0,0,c.ang]}><planeGeometry args={[0.005, c.len]} /><meshBasicMaterial color="#6688CC" transparent opacity={0.35} /></mesh>)}
    </group>
  );
}

/* ── Ambient dust ── */
function AmbientDust() {
  const c = 350;
  const pos = useMemo(() => { const p = new Float32Array(c*3); for (let i=0;i<c;i++) { p[i*3]=rng(16); p[i*3+1]=rng(11); p[i*3+2]=rng(8); } return p; }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame((_,d) => {
    if (!ref.current) return;
    ref.current.rotation.y += d * 0.02;
    const a = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i=0;i<c;i++) { a[i*3+1] += d*0.04; if (a[i*3+1] > 5.5) a[i*3+1] = -5.5; }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" count={c} array={pos} itemSize={3} /></bufferGeometry>
      <pointsMaterial size={0.014} color="#DDBB66" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

/* ── Scene ── */
const pillColors = ["#FF3355","#3355FF","#F8F8FF","#FFBB00","#22CC55","#FF6622","#CC44DD","#44DDCC"];

function SceneContent() {
  return (
    <>
      <directionalLight position={[5, 4, 3]} intensity={1.0} color="#FFF5E8" />
      <directionalLight position={[-4, 1, -2]} intensity={0.45} color="#CCDDFF" />
      <directionalLight position={[0, -1, -4]} intensity={0.35} color="#FFCCAA" />
      <ambientLight intensity={0.5} color="#334466" />

      {/* 8 cigarettes */}
      {[...Array(8)].map((_, i) => <Cigarette key={`c${i}`} pos={rngPos()} spd={0.3+Math.random()*0.8} />)}
      {/* 6 beer glasses */}
      {[...Array(6)].map((_, i) => <BeerGlass key={`b${i}`} pos={rngPos()} spd={0.2+Math.random()*0.6} />)}
      {/* 30 pills */}
      {[...Array(30)].map((_, i) => <Pill key={`p${i}`} pos={rngPos()} color={pillColors[i%pillColors.length]} spd={0.3+Math.random()*1} />)}
      {/* 8 cannabis leaves */}
      {[...Array(8)].map((_, i) => <CannabisLeaf key={`l${i}`} pos={rngPos()} spd={0.2+Math.random()*0.5} />)}
      {/* 4 silhouettes */}
      {[...Array(4)].map((_, i) => <Silhouette key={`s${i}`} pos={rngPos()} spd={0.15+Math.random()*0.3} />)}
      {/* 8 broken screens */}
      {[...Array(8)].map((_, i) => <BrokenScreen key={`t${i}`} pos={rngPos()} spd={0.2+Math.random()*0.5} />)}
      {/* 350 dust particles */}
      <AmbientDust />
    </>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }} style={{ background: "transparent" }}>
        <SceneContent />
      </Canvas>
    </div>
  );
}
