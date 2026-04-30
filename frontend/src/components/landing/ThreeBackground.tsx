"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function rng(s: number) { return (Math.random() - 0.5) * s; }
function rp(): [number, number, number] { return [rng(14), rng(9), -1 - Math.random() * 5]; }

/* ── WHISKEY TUMBLER (rocks glass) ── */
function WhiskeyGlass({ pos, spd }: { pos: [number,number,number]; spd: number }) {
  const ref = useRef<THREE.Group>(null);
  const dropsRef = useRef<THREE.Points>(null);
  const dropPos = useMemo(() => { const a = new Float32Array(20*3); for (let i=0;i<20;i++) a[i*3+1] = -Math.random()*0.6; return a; }, []);
  const tilt = useRef(0);

  useFrame((_s, delta) => {
    if (!ref.current) return;
    const t = _s.clock.elapsedTime;
    ref.current.position.x += delta * spd * 0.1;
    ref.current.position.y += Math.sin(t * spd + pos[0]) * delta * 0.25;
    tilt.current = Math.sin(t * spd * 1.2) * 0.15;
    ref.current.rotation.z = tilt.current;

    if (dropsRef.current) {
      const a = dropsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i=0;i<20;i++) {
        a[i*3+1] -= delta * 0.15;
        a[i*3] += (Math.random()-0.5) * delta * 0.03;
        if (a[i*3+1] < -0.6) a[i*3+1] = 0;
      }
      dropsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={ref} position={pos}>
      {/* Glass body — thick short tumbler */}
      <mesh>
        <cylinderGeometry args={[0.22, 0.2, 0.38, 32, 1, true]} />
        <meshStandardMaterial color="#CCCCBB" roughness={0.06} metalness={0.08} transparent opacity={0.3} />
      </mesh>
      {/* Thick glass base */}
      <mesh position={[0, -0.19, 0]}>
        <cylinderGeometry args={[0.21, 0.21, 0.06, 32]} />
        <meshStandardMaterial color="#CCCCBB" roughness={0.06} metalness={0.08} transparent opacity={0.35} />
      </mesh>
      {/* Glass rim */}
      <mesh position={[0, 0.19, 0]}>
        <torusGeometry args={[0.22, 0.012, 8, 24]} />
        <meshStandardMaterial color="#DDDDCC" roughness={0.08} metalness={0.1} transparent opacity={0.45} />
      </mesh>
      {/* Whiskey liquid */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.22, 16]} />
        <meshStandardMaterial color="#C48520" roughness={0.2} metalness={0.15} emissive="#331100" emissiveIntensity={0.3} transparent opacity={0.7} />
      </mesh>
      {/* Ice cubes */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[rng(0.12), -0.02 + i*0.04, rng(0.12)]} rotation={[Math.random(), Math.random(), Math.random()]}>
          <boxGeometry args={[0.06, 0.06, 0.06]} />
          <meshStandardMaterial color="#DDF8FF" roughness={0.05} metalness={0.1} transparent opacity={0.55} />
        </mesh>
      ))}
      {/* Condensation dots */}
      {[...Array(15)].map((_, i) => (
        <mesh key={`c${i}`} position={[Math.cos(i*0.7)*0.2, rng(0.3), Math.sin(i*0.7)*0.2]}>
          <sphereGeometry args={[0.008 + Math.random()*0.012, 4, 4]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} transparent opacity={0.25} />
        </mesh>
      ))}
      {/* Spilling drops */}
      <points ref={dropsRef} position={[0.2, 0.15, 0]}>
        <bufferGeometry><bufferAttribute attach="attributes-position" count={20} array={dropPos} itemSize={3} /></bufferGeometry>
        <pointsMaterial size={0.015} color="#D4A040" transparent opacity={0.5} depthWrite={false} />
      </points>
      {/* Warm glow from whiskey */}
      <pointLight position={[0, -0.06, 0]} intensity={0.35} color="#FF9922" distance={2.5} />
    </group>
  );
}

/* ── BEER MUG with handle ── */
function BeerMug({ pos, spd }: { pos: [number,number,number]; spd: number }) {
  const ref = useRef<THREE.Group>(null);
  const foamRef = useRef<THREE.Mesh>(null);
  const spillRef = useRef<THREE.Points>(null);
  const spillPos = useMemo(() => { const a = new Float32Array(25*3); for (let i=0;i<25;i++) a[i*3+1] = -Math.random()*0.4; return a; }, []);

  useFrame((_s, delta) => {
    if (!ref.current) return;
    const t = _s.clock.elapsedTime;
    ref.current.position.x += delta * spd * 0.09;
    ref.current.position.y += Math.cos(t * spd + pos[0]) * delta * 0.2;
    ref.current.rotation.z = Math.sin(t * spd * 0.8) * 0.12;
    if (foamRef.current) foamRef.current.position.y = 0.29 + Math.sin(t * 3) * 0.01;
    if (spillRef.current) {
      const a = spillRef.current.geometry.attributes.position.array as Float32Array;
      for (let i=0;i<25;i++) { a[i*3+1] -= delta * 0.18; a[i*3] += (Math.random()-0.5)*delta*0.04; if (a[i*3+1] < -0.4) a[i*3+1] = 0; }
      spillRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={ref} position={pos}>
      {/* Mug body */}
      <mesh>
        <cylinderGeometry args={[0.16, 0.14, 0.55, 24, 1, true]} />
        <meshStandardMaterial color="#BBBBAA" roughness={0.1} metalness={0.12} transparent opacity={0.32} />
      </mesh>
      {/* Mug bottom */}
      <mesh position={[0, -0.28, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
        <meshStandardMaterial color="#BBBBAA" roughness={0.1} metalness={0.12} transparent opacity={0.35} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.18, 0, 0]}>
        <torusGeometry args={[0.1, 0.025, 8, 12, Math.PI * 1.2]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#BBBBAA" roughness={0.1} metalness={0.12} transparent opacity={0.35} />
      </mesh>
      {/* Beer liquid */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[0.132, 0.128, 0.35, 16]} />
        <meshStandardMaterial color="#E8A820" roughness={0.22} metalness={0.1} emissive="#221100" emissiveIntensity={0.2} transparent opacity={0.68} />
      </mesh>
      {/* Foam head */}
      <mesh ref={foamRef} position={[0, 0.29, 0]}>
        <cylinderGeometry args={[0.135, 0.135, 0.08, 16]} />
        <meshStandardMaterial color="#FFF8E8" roughness={0.6} transparent opacity={0.75} />
      </mesh>
      {/* Mug rim */}
      <mesh position={[0, 0.28, 0]}>
        <torusGeometry args={[0.16, 0.014, 6, 20]} />
        <meshStandardMaterial color="#CCCCBB" roughness={0.1} metalness={0.1} transparent opacity={0.45} />
      </mesh>
      {/* Condensation */}
      {[...Array(12)].map((_, i) => (
        <mesh key={`c${i}`} position={[Math.cos(i)*0.15, rng(0.4), Math.sin(i)*0.15]}>
          <sphereGeometry args={[0.01, 4, 4]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} transparent opacity={0.2} />
        </mesh>
      ))}
      {/* Spilling beer drops */}
      <points ref={spillRef} position={[0.17, 0.25, 0]}>
        <bufferGeometry><bufferAttribute attach="attributes-position" count={25} array={spillPos} itemSize={3} /></bufferGeometry>
        <pointsMaterial size={0.018} color="#E8A020" transparent opacity={0.45} depthWrite={false} />
      </points>
    </group>
  );
}

/* ── TISSUE BOX + USED TISSUES ── */
function TissueBox({ pos, spd }: { pos: [number,number,number]; spd: number }) {
  const ref = useRef<THREE.Group>(null);
  const usedRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((_s, delta) => {
    if (!ref.current) return;
    const t = _s.clock.elapsedTime;
    ref.current.position.x += delta * spd * 0.06;
    ref.current.position.y += Math.sin(t * spd + pos[0]) * delta * 0.15;
    ref.current.rotation.z = Math.sin(t * 0.5) * 0.1;
    usedRefs.current.forEach((m, i) => {
      if (!m) return;
      m.position.y += Math.sin(t * 2 + i) * delta * 0.1;
      m.rotation.x += delta * 0.2;
    });
  });

  return (
    <group ref={ref} position={pos}>
      {/* Box body */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.28, 0.22, 0.2]} />
        <meshStandardMaterial color="#FFEEDD" roughness={0.6} />
      </mesh>
      {/* Box pattern lines */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.16 + i*0.03, 0.102]}>
          <planeGeometry args={[0.22, 0.008]} />
          <meshBasicMaterial color="#DDCCBB" transparent opacity={0.3} />
        </mesh>
      ))}
      {/* Oval opening */}
      <mesh position={[0, 0.22, 0]} rotation={[0, 0, 0]}>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial color="#DDCCBB" transparent opacity={0.5} />
      </mesh>
      {/* Tissue pulled out — wavy plane */}
      <mesh position={[0, 0.25, 0]} rotation={[0.3, 0, 0]}>
        <planeGeometry args={[0.08, 0.14, 4, 6]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.7} side={THREE.DoubleSide} />
      </mesh>
      {/* Scrunched up used tissues */}
      {[...Array(4)].map((_, i) => (
        <mesh
          key={`u${i}`}
          ref={(el) => { usedRefs.current[i] = el; }}
          position={[rng(0.4), -0.15 - i*0.15, rng(0.3)]}
          rotation={[Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI]}
        >
          <sphereGeometry args={[0.04 + Math.random()*0.04, 8, 6]} />
          <meshStandardMaterial color="#FFF8F0" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/* ── INTIMATE SILHOUETTE (adult content representation) ── */
function Silhouette({ pos, spd }: { pos: [number,number,number]; spd: number }) {
  const ref = useRef<THREE.Group>(null);
  const skinMat = <meshStandardMaterial color="#2A150A" roughness={0.85} />;

  useFrame((_s, delta) => {
    if (!ref.current) return;
    const t = _s.clock.elapsedTime;
    ref.current.position.x += delta * spd * 0.05;
    ref.current.position.y += Math.sin(t * 0.4 + pos[0]) * delta * 0.18;
  });

  return (
    <group ref={ref} position={pos}>
      {/* Head */}
      <mesh position={[0, 1.0, 0]}><sphereGeometry args={[0.08, 10, 10]} />{skinMat}</mesh>
      {/* Hair */}
      <mesh position={[0, 1.06, -0.02]}><sphereGeometry args={[0.09, 8, 6, 0, Math.PI*2, 0, Math.PI/2.2]} /><meshStandardMaterial color="#0A0000" roughness={0.95} /></mesh>
      {/* Neck */}
      <mesh position={[0, 0.87, 0]}><cylinderGeometry args={[0.025, 0.03, 0.07, 6]} />{skinMat}</mesh>
      {/* Shoulders */}
      <mesh position={[0, 0.74, 0]}><sphereGeometry args={[0.13, 10, 6, 0, Math.PI*2, 0, Math.PI/1.8]} />{skinMat}</mesh>
      {/* Bust */}
      <mesh position={[-0.05, 0.62, 0.07]}><sphereGeometry args={[0.065, 7, 7]} />{skinMat}</mesh>
      <mesh position={[0.05, 0.62, 0.07]}><sphereGeometry args={[0.065, 7, 7]} />{skinMat}</mesh>
      {/* Waist */}
      <mesh position={[0, 0.42, 0]}><cylinderGeometry args={[0.05, 0.08, 0.3, 8]} />{skinMat}</mesh>
      {/* Hips */}
      <mesh position={[0, 0.18, 0]}><sphereGeometry args={[0.1, 8, 6, 0, Math.PI*2, Math.PI/5, Math.PI/2.2]} />{skinMat}</mesh>
      {/* Thighs */}
      <mesh position={[-0.03, -0.08, 0]}><cylinderGeometry args={[0.04, 0.045, 0.45, 6]} />{skinMat}</mesh>
      <mesh position={[0.03, -0.08, 0]}><cylinderGeometry args={[0.04, 0.045, 0.45, 6]} />{skinMat}</mesh>
      {/* Warm intimate glow */}
      <pointLight position={[0, 0.55, 0.6]} intensity={0.4} color="#FF3366" distance={2.5} />
      <pointLight position={[0, 0.55, -0.3]} intensity={0.15} color="#FF6688" distance={1.5} />
    </group>
  );
}

/* ── CIGARETTE ── */
function Cigarette({ pos, spd }: { pos: [number,number,number]; spd: number }) {
  const ref = useRef<THREE.Group>(null);
  const eRef = useRef<THREE.Mesh>(null);
  const smokeRef = useRef<THREE.Points>(null);
  const smokePos = useMemo(() => { const a = new Float32Array(50*3); for (let i=0;i<50;i++) { a[i*3]=rng(0.04); a[i*3+1]=Math.random()*1.6; a[i*3+2]=rng(0.04); } return a; }, []);

  useFrame((_s, delta) => {
    if (!ref.current) return;
    ref.current.position.x += delta * spd * 0.14;
    ref.current.position.y += Math.sin(ref.current.position.x * 0.3) * delta * 0.3;
    ref.current.rotation.z += delta * 0.25;
    if (eRef.current) (eRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 3 + Math.random() * 1.5;
    if (smokeRef.current) {
      const a = smokeRef.current.geometry.attributes.position.array as Float32Array;
      for (let i=0;i<50;i++) { a[i*3+1] += delta*(0.4+Math.random()*0.35); a[i*3] += (Math.random()-0.5)*delta*0.07; if (a[i*3+1] > 1.6) { a[i*3+1]=0; a[i*3]=rng(0.04); } }
      smokeRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={ref} position={pos}>
      <mesh position={[0, 0.48, 0]}><cylinderGeometry args={[0.032, 0.032, 0.28, 14]} /><meshStandardMaterial color="#C4A060" roughness={0.65} /></mesh>
      <mesh position={[0, -0.06, 0]}><cylinderGeometry args={[0.032, 0.032, 0.55, 14]} /><meshStandardMaterial color="#FAFAF6" roughness={0.45} /></mesh>
      <mesh ref={eRef} position={[0, -0.38, 0]}><sphereGeometry args={[0.025, 10, 10]} /><meshStandardMaterial color="#FF4400" emissive="#FF3300" emissiveIntensity={3.5} roughness={0.1} /></mesh>
      <points ref={smokeRef} position={[0, -0.4, 0.02]}><bufferGeometry><bufferAttribute attach="attributes-position" count={50} array={smokePos} itemSize={3} /></bufferGeometry><pointsMaterial size={0.016} color="#999" transparent opacity={0.2} depthWrite={false} blending={THREE.NormalBlending} /></points>
      <pointLight position={[0, -0.38, 0]} intensity={0.3} color="#FF5500" distance={2} />
    </group>
  );
}

/* ── CANNABIS LEAF ── */
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
  const lit = Math.random() > 0.35;
  return (
    <group ref={ref} position={pos}>
      <mesh scale={[0.35, 0.35, 0.35]}>
        <LeafGeom />
        <meshStandardMaterial
          color={lit ? "#C16620" : "#2E7D32"}
          roughness={lit ? 0.5 : 0.4}
          side={THREE.DoubleSide}
          emissive={lit ? "#331100" : "#0A1A0A"}
          emissiveIntensity={lit ? 0.6 : 0.2}
        />
      </mesh>
      {lit && <pointLight position={[0, -0.05, 0.05]} intensity={0.15} color="#FF6600" distance={1.5} />}
    </group>
  );
}

/* ── TECH DEVICE WITH SCREEN GLOW ── */
function Device({ pos, spd, type }: { pos: [number,number,number]; spd: number; type: "phone"|"tablet"|"laptop" }) {
  const ref = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const dims = type === "phone" ? [0.38, 0.7] : type === "tablet" ? [0.65, 0.5] : [0.8, 0.5];
  const cracks = useMemo(() => Array.from({length:5}, () => ({x:rng(dims[0]*0.7), y:rng(dims[1]*0.5), len:0.08+Math.random()*0.25, ang:Math.random()*Math.PI})), []);

  useFrame((_s, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * spd * 0.3;
    ref.current.rotation.x = Math.sin(_s.clock.elapsedTime * spd * 0.5) * 0.25;
    ref.current.position.x += delta * spd * 0.08;
    ref.current.position.y += Math.cos(ref.current.position.x * 0.3) * delta * 0.18;

    if (screenRef.current && lightRef.current) {
      // Get screen's world-space normal to determine how much it faces camera
      const normal = new THREE.Vector3(0, 0, 1);
      screenRef.current.getWorldDirection(normal);
      // Light intensity varies based on screen visibility
      const dot = Math.abs(normal.dot(new THREE.Vector3(0, 0, -1)));
      lightRef.current.intensity = 0.15 + dot * 0.4 + Math.random() * 0.05;
      (screenRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.25 + dot * 0.5;
    }
  });

  return (
    <group ref={ref} position={pos}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[dims[0]+0.06, dims[1]+0.06, 0.03]} />
        <meshStandardMaterial color="#1A1A1A" roughness={0.15} metalness={0.9} />
      </mesh>
      {/* Screen */}
      <mesh ref={screenRef} position={[0, 0, 0.017]}>
        <planeGeometry args={[dims[0], dims[1]]} />
        <meshStandardMaterial color="#0A0A1A" roughness={0.05} metalness={0.5} emissive="#3355CC" emissiveIntensity={0.35} />
      </mesh>
      {/* Cracks */}
      {cracks.map((c, i) => (
        <mesh key={i} position={[c.x, c.y, 0.018]} rotation={[0,0,c.ang]}>
          <planeGeometry args={[0.005, c.len]} />
          <meshBasicMaterial color="#88AAFF" transparent opacity={0.35} />
        </mesh>
      ))}
      {/* Screen glow light — illuminates nearby objects */}
      <pointLight ref={lightRef} position={[0, 0, 0.2]} intensity={0.25} color="#4466CC" distance={2.5} />
    </group>
  );
}

/* ── PILL ── */
function Pill({ pos, color, spd }: { pos: [number,number,number]; color: string; spd: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_s, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * spd * 0.6;
    ref.current.rotation.z += delta * spd * 0.7;
    ref.current.position.x += delta * spd * 0.1;
    ref.current.position.y += Math.sin(ref.current.position.x * 0.6) * delta * 0.35;
  });
  return (
    <mesh ref={ref} position={pos} rotation={[Math.random()*Math.PI*2, Math.random()*Math.PI*2, Math.random()*Math.PI]}>
      <capsuleGeometry args={[0.035+Math.random()*0.05, 0.15+Math.random()*0.2, 4, 8]} />
      <meshStandardMaterial color={color} roughness={0.22} metalness={0.3} />
    </mesh>
  );
}

/* ── AMBIENT DUST ── */
function Dust() {
  const c = 400;
  const pos = useMemo(() => { const p = new Float32Array(c*3); for (let i=0;i<c;i++) { p[i*3]=rng(18); p[i*3+1]=rng(12); p[i*3+2]=rng(8); } return p; }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame((_,d) => {
    if (!ref.current) return;
    ref.current.rotation.y += d * 0.02;
    const a = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i=0;i<c;i++) { a[i*3+1] += d*0.04; if (a[i*3+1] > 6) a[i*3+1] = -6; }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" count={c} array={pos} itemSize={3} /></bufferGeometry><pointsMaterial size={0.012} color="#DDBB66" transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} /></points>;
}

/* ── SCENE ── */
const pillColors = ["#FF3355","#3355FF","#F8F8FF","#FFBB00","#22CC55","#FF6622","#CC44DD","#44DDCC"];
const deviceTypes: ("phone"|"tablet"|"laptop")[] = ["phone","phone","phone","phone","tablet","tablet","tablet","laptop","laptop","laptop"];

function SceneContent() {
  return (
    <>
      <directionalLight position={[5, 4, 3]} intensity={0.9} color="#FFF5E8" />
      <directionalLight position={[-4, 1, -2]} intensity={0.4} color="#CCDDFF" />
      <directionalLight position={[0, -1, -4]} intensity={0.3} color="#FFCCAA" />
      <ambientLight intensity={0.55} color="#334466" />

      {/* 10 cigarettes with ember glow */}
      {[...Array(10)].map((_, i) => <Cigarette key={`c${i}`} pos={rp()} spd={0.3+Math.random()*0.8} />)}
      {/* 5 whiskey glasses */}
      {[...Array(5)].map((_, i) => <WhiskeyGlass key={`w${i}`} pos={rp()} spd={0.2+Math.random()*0.5} />)}
      {/* 5 beer mugs */}
      {[...Array(5)].map((_, i) => <BeerMug key={`b${i}`} pos={rp()} spd={0.2+Math.random()*0.5} />)}
      {/* 35 pills */}
      {[...Array(35)].map((_, i) => <Pill key={`p${i}`} pos={rp()} color={pillColors[i%pillColors.length]} spd={0.3+Math.random()*1} />)}
      {/* 18 cannabis leaves (some lit, some not) */}
      {[...Array(18)].map((_, i) => <CannabisLeaf key={`l${i}`} pos={rp()} spd={0.2+Math.random()*0.5} />)}
      {/* 10 tech devices with screen glow */}
      {[...Array(10)].map((_, i) => <Device key={`d${i}`} pos={rp()} spd={0.2+Math.random()*0.5} type={deviceTypes[i]} />)}
      {/* 6 silhouettes */}
      {[...Array(6)].map((_, i) => <Silhouette key={`s${i}`} pos={rp()} spd={0.15+Math.random()*0.3} />)}
      {/* 5 tissue boxes */}
      {[...Array(5)].map((_, i) => <TissueBox key={`t${i}`} pos={rp()} spd={0.15+Math.random()*0.3} />)}
      {/* 400 dust */}
      <Dust />
    </>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.15 }} style={{ background: "transparent" }}>
        <SceneContent />
      </Canvas>
    </div>
  );
}
