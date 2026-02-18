import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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
   GLASS BUBBLE — Refractive transparent sphere
   ═══════════════════════════════════════════════════════════ */
const GlassBubble = ({
  position,
  scale = 1,
  speed = 0.3,
  isMobile = false,
  color = "#e8d8c8",
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  isMobile?: boolean;
  color?: string;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * speed * 0.3;
    ref.current.rotation.y = t * speed * 0.5;
    ref.current.position.y = position[1] + Math.sin(t * speed + position[0]) * 0.4;
    ref.current.position.x = position[0] + Math.sin(t * speed * 0.7 + position[2]) * 0.15;
  });

  return (
    <Float speed={speed * 3} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={ref} position={position} scale={scale} castShadow>
        <sphereGeometry args={[1, isMobile ? 24 : 48, isMobile ? 24 : 48]} />
        <MeshTransmissionMaterial
          backside
          samples={isMobile ? 3 : 6}
          thickness={0.35}
          chromaticAberration={0.25}
          anisotropy={0.4}
          distortion={0.5}
          distortionScale={0.3}
          temporalDistortion={0.15}
          roughness={0.02}
          ior={1.5}
          color={color}
          transmission={0.95}
        />
      </mesh>
    </Float>
  );
};

/* ═══════════════════════════════════════════════════════════
   METALLIC BUBBLE — Morphing reflective sphere
   ═══════════════════════════════════════════════════════════ */
const MetallicBubble = ({
  position,
  scale = 1,
  color = "#9a8a7a",
  distort = 0.4,
  speed = 2.5,
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
    ref.current.rotation.y = t * 0.08;
    ref.current.rotation.z = Math.sin(t * 0.25) * 0.12;
    ref.current.position.y = position[1] + Math.sin(t * 0.4 + position[0]) * 0.35;
    ref.current.position.x = position[0] + Math.cos(t * 0.3 + position[2]) * 0.2;
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh ref={ref} position={position} scale={scale} castShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          envMapIntensity={1.4}
          roughness={0.03}
          metalness={1}
          distort={distort}
          speed={speed}
        />
      </mesh>
    </Float>
  );
};

/* ═══════════════════════════════════════════════════════════
   SOFT GLOW BUBBLE — Emissive ambient sphere
   ═══════════════════════════════════════════════════════════ */
const GlowBubble = ({
  position,
  scale = 1,
  color = "#c4956a",
  speed = 0.5,
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
  speed?: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = position[1] + Math.sin(t * speed + position[0] * 2) * 0.5;
    ref.current.position.x = position[0] + Math.cos(t * speed * 0.6 + position[2]) * 0.3;
    const pulse = 0.85 + Math.sin(t * speed * 1.5) * 0.15;
    ref.current.scale.setScalar(scale * pulse);
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.15}
        roughness={0.15}
        metalness={0.85}
        envMapIntensity={1.2}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
};

/* ═══════════════════════════════════════════════════════════
   TINY FLOATING BUBBLES — Small ambient particles
   ═══════════════════════════════════════════════════════════ */
const TinyBubbles = ({
  count = 15,
  spread = 12,
  isMobile = false,
}: {
  count?: number;
  spread?: number;
  isMobile?: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const actualCount = isMobile ? Math.floor(count * 0.5) : count;

  const bubbles = useMemo(
    () =>
      Array.from({ length: actualCount }, (_, i) => ({
        pos: [
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread * 0.8,
          (Math.random() - 0.5) * spread * 0.5 - 2,
        ] as [number, number, number],
        size: 0.04 + Math.random() * 0.08,
        speed: 0.2 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
      })),
    [actualCount, spread]
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const b = bubbles[i];
      if (!b) return;
      child.position.y = b.pos[1] + Math.sin(t * b.speed + b.phase) * 0.6;
      child.position.x = b.pos[0] + Math.cos(t * b.speed * 0.7 + b.phase) * 0.3;
    });
  });

  return (
    <group ref={groupRef}>
      {bubbles.map((b, i) => (
        <mesh key={i} position={b.pos} scale={b.size} castShadow>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color="#e0d0c0"
            roughness={0.1}
            metalness={0.9}
            emissive="#c0a080"
            emissiveIntensity={0.2}
            envMapIntensity={1.5}
          />
        </mesh>
      ))}
    </group>
  );
};

/* ═══════════════════════════════════════════════════════════
   SCROLL SCENE — Bubbles with scroll + mouse parallax
   ═══════════════════════════════════════════════════════════ */
const ScrollScene = ({ isMobile }: { isMobile: boolean }) => {
  const group = useRef<THREE.Group>(null);
  const smoothMouse = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (!group.current) return;

    const scrollY = window.scrollY || 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
    group.current.position.y = progress * 6;

    if (!isMobile) {
      const targetX = ((window as any).__mouseX ?? 0.5) - 0.5;
      const targetY = ((window as any).__mouseY ?? 0.5) - 0.5;
      smoothMouse.current.x += (targetX - smoothMouse.current.x) * 0.03;
      smoothMouse.current.y += (targetY - smoothMouse.current.y) * 0.03;
      group.current.rotation.y = progress * 0.2 + smoothMouse.current.x * 0.12;
      group.current.rotation.x = smoothMouse.current.y * 0.06;
    } else {
      group.current.rotation.y = progress * 0.15;
    }
  });

  return (
    <group ref={group}>
      {/* ── Hero: Large glass bubble ── */}
      <GlassBubble
        position={[isMobile ? 1.8 : 3.5, 1, 0]}
        scale={isMobile ? 1.8 : 2.8}
        speed={0.3}
        isMobile={isMobile}
        color="#e8d8c8"
      />

      {/* ── Hero: Medium metallic bubble ── */}
      <MetallicBubble
        position={[isMobile ? -1.2 : -2.8, 0.5, -1]}
        scale={isMobile ? 1 : 1.6}
        color="#a09080"
        distort={0.45}
        speed={2.5}
      />

      {/* ── Hero: Small glass accent ── */}
      <GlassBubble
        position={[isMobile ? -0.8 : -1.2, 2.2, -2]}
        scale={isMobile ? 0.5 : 0.8}
        speed={0.5}
        isMobile={isMobile}
        color="#d0c8c0"
      />

      {/* ── Scattered glow bubbles ── */}
      <GlowBubble position={[isMobile ? 2.2 : 4.5, -1.5, -2]} scale={isMobile ? 0.4 : 0.7} color="#c4956a" speed={0.4} />
      <GlowBubble position={[isMobile ? -1.8 : -4, -3, -1.5]} scale={isMobile ? 0.5 : 0.9} color="#8a7a6a" speed={0.35} />
      {!isMobile && (
        <>
          <GlowBubble position={[1, -5, -3]} scale={0.5} color="#b0a090" speed={0.45} />
          <GlassBubble position={[-3, -2, -3]} scale={0.6} speed={0.4} color="#d8c8b8" />
          <MetallicBubble position={[4, -4, -2]} scale={0.7} color="#9a8a7a" distort={0.35} speed={2} />
        </>
      )}

      {/* ── Tiny ambient bubbles ── */}
      <TinyBubbles count={20} spread={14} isMobile={isMobile} />

      {/* ── Contact shadows ── */}
      <ContactShadows
        position={[0, -4, 0]}
        opacity={0.25}
        scale={20}
        blur={2.5}
        far={8}
        color="#2a2420"
      />
    </group>
  );
};

/* ═══════════════════════════════════════════════════════════
   MOUSE TRACKER
   ═══════════════════════════════════════════════════════════ */
const MouseTracker = () => {
  useFrame(() => {
    if (!(window as any).__mouseTrackerAdded) {
      const handler = (e: MouseEvent) => {
        (window as any).__mouseX = e.clientX / window.innerWidth;
        (window as any).__mouseY = e.clientY / window.innerHeight;
      };
      window.addEventListener("mousemove", handler);
      (window as any).__mouseTrackerAdded = true;
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
        <ambientLight intensity={0.25} />
        <directionalLight
          position={[6, 8, 5]}
          intensity={1.1}
          color="#fff0e0"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.001}
        />
        <directionalLight position={[-4, -3, 4]} intensity={0.35} color="#e0e8ff" />
        <pointLight position={[0, 5, 3]} intensity={0.5} color="#ffe0c0" />
        <pointLight position={[-3, -2, 2]} intensity={0.25} color="#c0d0e0" />
        <spotLight
          position={[4, 6, 4]}
          angle={0.4}
          penumbra={0.8}
          intensity={0.7}
          color="#f0e0d0"
          castShadow
        />

        <Environment preset="city" environmentIntensity={0.5} />

        <MouseTracker />
        <ScrollScene isMobile={isMobile} />
      </Canvas>
    </div>
  );
};

export default GlobalScene;
