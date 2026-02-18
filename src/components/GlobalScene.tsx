import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

/* ── Minimal floating particle field ── */
const Particles = ({ count = 80, spread = 30 }: { count?: number; spread?: number }) => {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 3; // tall spread for full page
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread * 0.5;
    }
    return pos;
  }, [count, spread]);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#a08878" transparent opacity={0.35} sizeAttenuation />
    </points>
  );
};

/* ── Thin wireframe ring ── */
const Ring = ({
  position,
  scale = 1,
  rotSpeed = 0.04,
}: {
  position: [number, number, number];
  scale?: number;
  rotSpeed?: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * rotSpeed;
    ref.current.rotation.z = state.clock.elapsedTime * rotSpeed * 0.6;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <torusGeometry args={[1, 0.008, 32, 128]} />
      <meshBasicMaterial color="#8a7a6a" transparent opacity={0.2} />
    </mesh>
  );
};

/* ── Subtle floating sphere ── */
const GhostSphere = ({
  position,
  scale = 0.3,
  speed = 0.5,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.2;
    ref.current.rotation.y = state.clock.elapsedTime * 0.1;
  });
  return (
    <Float speed={speed} rotationIntensity={0.1} floatIntensity={0.3}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 3]} />
        <meshBasicMaterial color="#9a8a7a" transparent opacity={0.08} wireframe />
      </mesh>
    </Float>
  );
};

/* ── Thin line that drifts ── */
const DriftLine = ({
  start,
  end,
  speed = 0.03,
}: {
  start: [number, number, number];
  end: [number, number, number];
  speed?: number;
}) => {
  const ref = useRef<THREE.Line>(null);
  const geometry = useMemo(() => {
    const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [start, end]);
  const material = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#a09080", transparent: true, opacity: 0.1 }),
    []
  );

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * speed) * 0.3;
  });

  return <primitive ref={ref} object={new THREE.Line(geometry, material)} />;
};

/* ── Scene that scrolls with the page ── */
const ScrollScene = ({ isMobile }: { isMobile: boolean }) => {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  useFrame(() => {
    if (!group.current) return;
    // Gentle parallax tied to page scroll
    const scrollY = window.scrollY || 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
    group.current.position.y = progress * 8; // drift upward as user scrolls
    group.current.rotation.y = progress * 0.3; // subtle rotation
  });

  return (
    <group ref={group}>
      {/* Particles scattered through the full vertical space */}
      <Particles count={isMobile ? 40 : 80} spread={isMobile ? 12 : 20} />

      {/* Rings at different depths */}
      <Ring position={[isMobile ? 2 : 3.5, -1, -4]} scale={isMobile ? 1 : 1.8} rotSpeed={0.03} />
      <Ring position={[isMobile ? -1.5 : -2.5, -5, -3]} scale={isMobile ? 0.8 : 1.2} rotSpeed={0.05} />
      {!isMobile && <Ring position={[1, -9, -5]} scale={2.2} rotSpeed={0.02} />}

      {/* Ghost spheres — barely visible wireframes */}
      <GhostSphere position={[isMobile ? -1.5 : -3, 1, -3]} scale={isMobile ? 0.6 : 1} speed={0.4} />
      <GhostSphere position={[isMobile ? 1 : 2, -4, -4]} scale={isMobile ? 0.4 : 0.7} speed={0.6} />
      {!isMobile && <GhostSphere position={[-1, -8, -2]} scale={0.5} speed={0.3} />}

      {/* Drift lines — subtle connecting elements */}
      <DriftLine start={[-4, 2, -6]} end={[4, -3, -6]} speed={0.02} />
      <DriftLine start={[3, -2, -5]} end={[-3, -7, -5]} speed={0.015} />
      {!isMobile && <DriftLine start={[-2, -6, -4]} end={[2, -11, -4]} speed={0.025} />}
    </group>
  );
};

/* ── Main backdrop component — fixed behind everything ── */
const GlobalScene = () => {
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-0" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        gl={{ antialias: !isMobile, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ScrollScene isMobile={isMobile} />
      </Canvas>
    </div>
  );
};

export default GlobalScene;
