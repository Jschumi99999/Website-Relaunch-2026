import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  MeshDistortMaterial,
  MeshTransmissionMaterial,
  Float,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

/* ═══════════════════════════════════════════════════════════
   HERO GLASS BLOB — Large refractive glass sphere
   ═══════════════════════════════════════════════════════════ */
const GlassBlob = ({ isMobile }: { isMobile: boolean }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.08;
    ref.current.rotation.y = t * 0.12;
    ref.current.position.y = 1 + Math.sin(t * 0.4) * 0.3;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1}>
      <mesh
        ref={ref}
        position={[isMobile ? 1.5 : 3.5, 1, 0]}
        scale={isMobile ? 1.6 : 2.8}
        castShadow
      >
        <icosahedronGeometry args={[1, isMobile ? 6 : 12]} />
        <MeshTransmissionMaterial
          backside
          samples={isMobile ? 4 : 8}
          thickness={0.4}
          chromaticAberration={0.3}
          anisotropy={0.5}
          distortion={0.6}
          distortionScale={0.4}
          temporalDistortion={0.2}
          roughness={0.05}
          ior={1.5}
          color="#e8d8c8"
          transmission={0.95}
        />
      </mesh>
    </Float>
  );
};

/* ═══════════════════════════════════════════════════════════
   MORPHING METALLIC SPHERE — Liquid metal effect
   ═══════════════════════════════════════════════════════════ */
const LiquidMetal = ({
  position,
  scale = 1,
  color = "#8a7a6a",
  distort = 0.5,
  speed = 3,
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
  distort?: number;
  speed?: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.06;
    ref.current.rotation.z = Math.sin(t * 0.3) * 0.15;
    ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.4;
    ref.current.position.x = position[0] + Math.sin(t * 0.3) * 0.2;
  });

  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={ref} position={position} scale={scale} castShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          envMapIntensity={1.2}
          roughness={0.05}
          metalness={1}
          distort={distort}
          speed={speed}
        />
      </mesh>
    </Float>
  );
};

/* ═══════════════════════════════════════════════════════════
   ROTATING TORUS — Big dramatic ring with reflections
   ═══════════════════════════════════════════════════════════ */
const DramaticTorus = ({
  position,
  scale = 1,
  speed = 0.04,
  tubeRadius = 0.06,
  color = "#b0a090",
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  tubeRadius?: number;
  color?: string;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * speed;
    ref.current.rotation.y = t * speed * 0.7;
    ref.current.rotation.z = Math.sin(t * speed * 2) * 0.3;
  });

  return (
    <mesh ref={ref} position={position} scale={scale} castShadow>
      <torusGeometry args={[1, tubeRadius, 48, 128]} />
      <meshStandardMaterial
        color={color}
        roughness={0.1}
        metalness={0.95}
        envMapIntensity={1.5}
      />
    </mesh>
  );
};

/* ═══════════════════════════════════════════════════════════
   GLASS TORUS — Second ring with transmission
   ═══════════════════════════════════════════════════════════ */
const GlassTorus = ({
  position,
  scale = 1,
  speed = 0.03,
  isMobile = false,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  isMobile?: boolean;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * speed + Math.PI * 0.25;
    ref.current.rotation.z = t * speed * 0.5;
  });

  return (
    <mesh ref={ref} position={position} scale={scale} castShadow>
      <torusGeometry args={[1, 0.04, 32, 100]} />
      <MeshTransmissionMaterial
        backside
        samples={isMobile ? 2 : 6}
        thickness={0.3}
        chromaticAberration={0.15}
        roughness={0.02}
        transmission={0.9}
        ior={1.4}
        color="#d0c8c0"
      />
    </mesh>
  );
};

/* ═══════════════════════════════════════════════════════════
   ORBITING SMALL SPHERES — Satellites around main blob
   ═══════════════════════════════════════════════════════════ */
const OrbitingSpheres = ({
  center,
  count = 5,
  radius = 3,
  isMobile = false,
}: {
  center: [number, number, number];
  count?: number;
  radius?: number;
  isMobile?: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const actualCount = isMobile ? 3 : count;

  const spheres = useMemo(
    () =>
      Array.from({ length: actualCount }, (_, i) => ({
        phase: (i / actualCount) * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.15,
        size: 0.06 + Math.random() * 0.1,
        yOff: (Math.random() - 0.5) * 2,
        orbitRadius: radius * (0.8 + Math.random() * 0.4),
      })),
    [actualCount, radius]
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const s = spheres[i];
      if (!s) return;
      const angle = t * s.speed + s.phase;
      child.position.set(
        center[0] + Math.cos(angle) * s.orbitRadius,
        center[1] + s.yOff + Math.sin(t * 0.5 + s.phase) * 0.3,
        center[2] + Math.sin(angle) * s.orbitRadius
      );
    });
  });

  return (
    <group ref={groupRef}>
      {spheres.map((s, i) => (
        <mesh key={i} scale={s.size} castShadow>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial
            color="#e0d0c0"
            roughness={0.1}
            metalness={0.9}
            emissive="#c0a080"
            emissiveIntensity={0.3}
            envMapIntensity={1.5}
          />
        </mesh>
      ))}
    </group>
  );
};

/* ═══════════════════════════════════════════════════════════
   FLOATING DIAMOND — Rotating gem shape
   ═══════════════════════════════════════════════════════════ */
const FloatingDiamond = ({
  position,
  scale = 1,
  speed = 0.06,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * speed;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.2;
    ref.current.position.y = position[1] + Math.sin(t * 0.6) * 0.3;
  });

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={ref} position={position} scale={scale} castShadow>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#c0b0a0"
          roughness={0.05}
          metalness={0.95}
          envMapIntensity={2}
        />
      </mesh>
    </Float>
  );
};

/* ═══════════════════════════════════════════════════════════
   SCENE WITH SCROLL + MOUSE PARALLAX
   ═══════════════════════════════════════════════════════════ */
const ScrollScene = ({ isMobile }: { isMobile: boolean }) => {
  const group = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (!group.current) return;

    // Scroll parallax
    const scrollY = window.scrollY || 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
    group.current.position.y = progress * 8;

    // Smooth mouse parallax (desktop only)
    if (!isMobile) {
      const targetX = ((window as any).__mouseX ?? 0.5) - 0.5;
      const targetY = ((window as any).__mouseY ?? 0.5) - 0.5;
      smoothMouse.current.x += (targetX - smoothMouse.current.x) * 0.03;
      smoothMouse.current.y += (targetY - smoothMouse.current.y) * 0.03;
      group.current.rotation.y = progress * 0.25 + smoothMouse.current.x * 0.15;
      group.current.rotation.x = smoothMouse.current.y * 0.08;
    } else {
      group.current.rotation.y = progress * 0.2;
    }
  });

  return (
    <group ref={group}>
      {/* ── Main glass blob — hero centerpiece ── */}
      <GlassBlob isMobile={isMobile} />

      {/* ── Orbiting satellites around the blob ── */}
      <OrbitingSpheres
        center={[isMobile ? 1.5 : 3.5, 1, 0]}
        count={isMobile ? 3 : 6}
        radius={isMobile ? 2.5 : 4}
        isMobile={isMobile}
      />

      {/* ── Liquid metal sphere ── */}
      <LiquidMetal
        position={[isMobile ? -1.5 : -3.5, -3.5, -1]}
        scale={isMobile ? 1 : 1.8}
        color="#9a8a7a"
        distort={0.5}
        speed={3}
      />

      {/* ── Dramatic torus rings ── */}
      <DramaticTorus
        position={[isMobile ? -0.5 : -2, 0, -3]}
        scale={isMobile ? 2 : 4}
        speed={0.035}
        tubeRadius={0.05}
        color="#b8a898"
      />
      <GlassTorus
        position={[isMobile ? 1 : 2.5, -2.5, -2]}
        scale={isMobile ? 1.5 : 3}
        speed={0.025}
        isMobile={isMobile}
      />
      {!isMobile && (
        <DramaticTorus
          position={[-1, -6, -4]}
          scale={3.5}
          speed={0.02}
          tubeRadius={0.04}
          color="#a09888"
        />
      )}

      {/* ── Floating diamond ── */}
      <FloatingDiamond
        position={[isMobile ? 2 : 5, -1.5, -2]}
        scale={isMobile ? 0.5 : 0.8}
        speed={0.05}
      />
      {!isMobile && (
        <FloatingDiamond position={[-4, -4.5, -1.5]} scale={0.6} speed={0.04} />
      )}

      {/* ── Contact shadows on ground plane ── */}
      <ContactShadows
        position={[0, -4, 0]}
        opacity={0.3}
        scale={20}
        blur={2.5}
        far={8}
        color="#2a2420"
      />
    </group>
  );
};

/* ═══════════════════════════════════════════════════════════
   MOUSE TRACKER — captures mouse for parallax
   ═══════════════════════════════════════════════════════════ */
const MouseTracker = () => {
  const { gl } = useThree();

  useFrame(() => {
    const handler = (e: MouseEvent) => {
      (window as any).__mouseX = e.clientX / window.innerWidth;
      (window as any).__mouseY = e.clientY / window.innerHeight;
    };

    if (!(window as any).__mouseTrackerAdded) {
      window.addEventListener("mousemove", handler);
      (window as any).__mouseTrackerAdded = true;
      (window as any).__mouseCleanup = () => {
        window.removeEventListener("mousemove", handler);
        (window as any).__mouseTrackerAdded = false;
      };
    }
  });

  return null;
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
const GlobalScene = () => {
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-0" style={{ zIndex: 0 }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 10], fov: 42 }}
        dpr={isMobile ? [1, 1] : [1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        style={{ background: "transparent" }}
      >
        {/* Rich lighting setup for reflections */}
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[6, 8, 5]}
          intensity={1.2}
          color="#fff0e0"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.001}
        />
        <directionalLight position={[-4, -3, 4]} intensity={0.4} color="#e0e8ff" />
        <pointLight position={[0, 5, 3]} intensity={0.6} color="#ffe0c0" />
        <pointLight position={[-3, -2, 2]} intensity={0.3} color="#c0d0e0" />
        <spotLight
          position={[4, 6, 4]}
          angle={0.4}
          penumbra={0.8}
          intensity={0.8}
          color="#f0e0d0"
          castShadow
        />

        {/* HDRI environment for realistic reflections */}
        <Environment preset="city" environmentIntensity={0.4} />

        <MouseTracker />
        <ScrollScene isMobile={isMobile} />
      </Canvas>
    </div>
  );
};

export default GlobalScene;
