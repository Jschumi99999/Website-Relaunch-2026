import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, MeshTransmissionMaterial, Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

/* ═══════════════════════════════════════════════════════════
   HERO BLOB — Massive morphing glass sphere, centerpiece
   ═══════════════════════════════════════════════════════════ */
const GlassBlob = ({ isMobile }: { isMobile: boolean }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.05;
    ref.current.rotation.y = state.clock.elapsedTime * 0.08;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={ref} position={[isMobile ? 1.5 : 4, 1, -2]} scale={isMobile ? 2 : 3.5}>
        <icosahedronGeometry args={[1, isMobile ? 8 : 12]} />
        <MeshDistortMaterial
          color="#5a4a3a"
          roughness={0.15}
          metalness={0.8}
          distort={0.35}
          speed={1.5}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
};

/* ═══════════════════════════════════════════════════════════
   GIANT TORUS — Slow-rotating massive ring
   ═══════════════════════════════════════════════════════════ */
const GiantTorus = ({
  position,
  scale = 1,
  speed = 0.03,
  color = "#6a5a4a",
  opacity = 0.25,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  color?: string;
  opacity?: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * speed;
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.7;
    ref.current.rotation.z = state.clock.elapsedTime * speed * 0.3;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <torusGeometry args={[1, 0.03, 32, 128]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        roughness={0.3}
        metalness={0.9}
      />
    </mesh>
  );
};

/* ═══════════════════════════════════════════════════════════
   MORPHING SPHERE — Large, distorted, glass-like orb
   ═══════════════════════════════════════════════════════════ */
const MorphSphere = ({
  position,
  scale = 1,
  distort = 0.4,
  speed = 2,
  color = "#7a6a5a",
  opacity = 0.3,
}: {
  position: [number, number, number];
  scale?: number;
  distort?: number;
  speed?: number;
  color?: string;
  opacity?: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.04;
  });

  return (
    <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.5}>
      <mesh ref={ref} position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.1}
          metalness={0.95}
          distort={distort}
          speed={speed}
          transparent
          opacity={opacity}
        />
      </mesh>
    </Float>
  );
};

/* ═══════════════════════════════════════════════════════════
   WIREFRAME DODECAHEDRON — Huge, slowly rotating skeleton
   ═══════════════════════════════════════════════════════════ */
const WireframePoly = ({
  position,
  scale = 1,
  speed = 0.02,
  opacity = 0.12,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  opacity?: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * speed;
    ref.current.rotation.y = state.clock.elapsedTime * speed * 1.3;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#9a8a7a"
        wireframe
        transparent
        opacity={opacity}
        roughness={0.4}
        metalness={0.8}
      />
    </mesh>
  );
};

/* ═══════════════════════════════════════════════════════════
   FLOWING RIBBON — Custom shader-driven flowing band
   ═══════════════════════════════════════════════════════════ */
const ribbonVertex = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vWave;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    float wave1 = sin(pos.x * 0.8 + uTime * 0.4) * 0.8;
    float wave2 = sin(pos.x * 1.6 + uTime * 0.25 + 2.0) * 0.3;
    float wave3 = cos(pos.x * 0.4 + uTime * 0.15) * 0.5;
    
    pos.y += wave1 + wave2;
    pos.z += wave3;
    vWave = wave1;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const ribbonFragment = `
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;
  varying float vWave;
  
  void main() {
    vec3 warm = vec3(0.55, 0.42, 0.32);
    vec3 cool = vec3(0.42, 0.50, 0.45);
    float blend = sin(vUv.x * 3.14 + uTime * 0.1) * 0.5 + 0.5;
    vec3 color = mix(warm, cool, blend);
    
    // Soft vertical edges
    float edgeFade = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
    // Soft horizontal edges
    edgeFade *= smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
    
    // Shimmer highlight
    float shimmer = pow(sin(vUv.x * 30.0 + uTime * 0.8) * 0.5 + 0.5, 8.0) * 0.3;
    
    gl_FragColor = vec4(color + shimmer, edgeFade * uOpacity);
  }
`;

const FlowingRibbon = ({
  position,
  rotation,
  width = 16,
  height = 1.2,
  opacity = 0.15,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  opacity?: number;
}) => {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: opacity },
    }),
    [opacity]
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh position={position} rotation={rotation || [0, 0, 0]}>
      <planeGeometry args={[width, height, 200, 1]} />
      <shaderMaterial
        vertexShader={ribbonVertex}
        fragmentShader={ribbonFragment}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};

/* ═══════════════════════════════════════════════════════════
   ACCENT PARTICLES — Just a few glowing orbs, not many dots
   ═══════════════════════════════════════════════════════════ */
const AccentOrbs = ({ count = 6, isMobile = false }: { count?: number; isMobile?: boolean }) => {
  const ref = useRef<THREE.Group>(null);
  const actualCount = isMobile ? 3 : count;

  const orbs = useMemo(
    () =>
      Array.from({ length: actualCount }, (_, i) => ({
        pos: [
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 20,
          -2 - Math.random() * 6,
        ] as [number, number, number],
        scale: 0.06 + Math.random() * 0.12,
        speed: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      })),
    [actualCount]
  );

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.children.forEach((child, i) => {
      const orb = orbs[i];
      if (!orb) return;
      child.position.y = orb.pos[1] + Math.sin(state.clock.elapsedTime * orb.speed + orb.phase) * 0.5;
    });
  });

  return (
    <group ref={ref}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.pos} scale={orb.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color="#c0a080"
            emissive="#c0a080"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
};

/* ═══════════════════════════════════════════════════════════
   SCROLL-REACTIVE SCENE
   ═══════════════════════════════════════════════════════════ */
const ScrollScene = ({ isMobile }: { isMobile: boolean }) => {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    const scrollY = window.scrollY || 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
    group.current.position.y = progress * 8;
    group.current.rotation.y = progress * 0.3;
  });

  return (
    <group ref={group}>
      {/* ── HERO area: Massive glass blob ── */}
      <GlassBlob isMobile={isMobile} />

      {/* ── Giant torus rings at different depths ── */}
      <GiantTorus
        position={[isMobile ? -1 : -3, -1, -4]}
        scale={isMobile ? 2.5 : 4.5}
        speed={0.025}
        color="#7a6a5a"
        opacity={0.2}
      />
      <GiantTorus
        position={[isMobile ? 2 : 4, -7, -3]}
        scale={isMobile ? 2 : 3.5}
        speed={0.035}
        color="#5a6a5a"
        opacity={0.15}
      />
      {!isMobile && (
        <GiantTorus
          position={[-2, -14, -5]}
          scale={5}
          speed={0.02}
          color="#6a5a6a"
          opacity={0.12}
        />
      )}

      {/* ── Large morphing spheres ── */}
      <MorphSphere
        position={[isMobile ? -2 : -5, -5, -3]}
        scale={isMobile ? 1.5 : 2.5}
        distort={0.3}
        speed={1.8}
        color="#6a5a4a"
        opacity={0.25}
      />
      <MorphSphere
        position={[isMobile ? 1.5 : 3, -11, -4]}
        scale={isMobile ? 1.2 : 2}
        distort={0.45}
        speed={2.2}
        color="#5a5a6a"
        opacity={0.2}
      />

      {/* ── Wireframe polyhedra — large and skeletal ── */}
      <WireframePoly
        position={[isMobile ? 2 : 5, -3, -6]}
        scale={isMobile ? 1.5 : 3}
        speed={0.015}
        opacity={0.1}
      />
      {!isMobile && (
        <WireframePoly
          position={[-4, -10, -5]}
          scale={2.5}
          speed={0.02}
          opacity={0.08}
        />
      )}

      {/* ── Flowing ribbons ── */}
      <FlowingRibbon
        position={[0, 0, -7]}
        rotation={[-0.15, 0, 0.05]}
        width={isMobile ? 10 : 20}
        height={isMobile ? 0.8 : 1.5}
        opacity={0.12}
      />
      <FlowingRibbon
        position={[2, -8, -9]}
        rotation={[0.1, 0.3, -0.08]}
        width={isMobile ? 8 : 16}
        height={isMobile ? 0.6 : 1}
        opacity={0.08}
      />

      {/* ── Few accent orbs — NOT many particles ── */}
      <AccentOrbs count={isMobile ? 3 : 6} isMobile={isMobile} />
    </group>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
const GlobalScene = () => {
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-0" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 40 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        gl={{ antialias: !isMobile, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        {/* Lighting for metallic/glass materials */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} color="#f0e0d0" />
        <directionalLight position={[-5, -3, 3]} intensity={0.3} color="#d0e0f0" />
        <pointLight position={[0, 3, 3]} intensity={0.4} color="#e0c8a0" />
        <ScrollScene isMobile={isMobile} />
      </Canvas>
    </div>
  );
};

export default GlobalScene;
