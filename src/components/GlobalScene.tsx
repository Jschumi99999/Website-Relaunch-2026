import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

/* ── Soft morphing blob ── */
const SoftBlob = ({
  position,
  scale = 1,
  color = "#c8b8a8",
  distort = 0.3,
  speed = 1.5,
  opacity = 0.35,
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
  distort?: number;
  speed?: number;
  opacity?: number;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    ref.current.rotation.x = state.clock.elapsedTime * 0.02;
  });

  return (
    <Float speed={0.6} rotationIntensity={0.15} floatIntensity={0.6}>
      <mesh ref={ref} position={position} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.6}
          metalness={0.1}
          distort={distort}
          speed={speed}
          transparent
          opacity={opacity}
        />
      </mesh>
    </Float>
  );
};

/* ── Thin elegant ring ── */
const ElegantRing = ({
  position,
  scale = 1,
  speed = 0.025,
  color = "#d0c4b8",
  opacity = 0.2,
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
    ref.current.rotation.z = state.clock.elapsedTime * speed * 0.6;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <torusGeometry args={[1, 0.015, 32, 128]} />
      <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.5} metalness={0.3} />
    </mesh>
  );
};

/* ── Gentle wireframe shape ── */
const WireShape = ({
  position,
  scale = 1,
  speed = 0.015,
  opacity = 0.08,
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
    ref.current.rotation.y = state.clock.elapsedTime * speed * 1.2;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#c8b8a8" wireframe transparent opacity={opacity} />
    </mesh>
  );
};

/* ── Soft flowing ribbon via shader ── */
const ribbonVert = `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.y += sin(pos.x * 0.6 + uTime * 0.3) * 0.6;
    pos.z += cos(pos.x * 0.3 + uTime * 0.15) * 0.4;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;
const ribbonFrag = `
  uniform float uOpacity;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec3 warm = vec3(0.78, 0.72, 0.65);
    vec3 cool = vec3(0.72, 0.76, 0.73);
    vec3 color = mix(warm, cool, sin(vUv.x * 3.14 + uTime * 0.1) * 0.5 + 0.5);
    float edge = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
    edge *= smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
    gl_FragColor = vec4(color, edge * uOpacity);
  }
`;

const SoftRibbon = ({
  position,
  rotation,
  width = 14,
  height = 1,
  opacity = 0.1,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  opacity?: number;
}) => {
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uOpacity: { value: opacity },
  }), [opacity]);

  useFrame((state) => { uniforms.uTime.value = state.clock.elapsedTime; });

  return (
    <mesh position={position} rotation={rotation || [0, 0, 0]}>
      <planeGeometry args={[width, height, 128, 1]} />
      <shaderMaterial
        vertexShader={ribbonVert}
        fragmentShader={ribbonFrag}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};

/* ── Scene with scroll parallax ── */
const ScrollScene = ({ isMobile }: { isMobile: boolean }) => {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    const scrollY = window.scrollY || 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
    group.current.position.y = progress * 6;
    group.current.rotation.y = progress * 0.15;
  });

  return (
    <group ref={group}>
      {/* Hero blob — large and soft */}
      <SoftBlob
        position={[isMobile ? 1.5 : 3.5, 1, -2]}
        scale={isMobile ? 1.8 : 3}
        color="#d4c4b4"
        distort={0.25}
        speed={1.2}
        opacity={0.3}
      />

      {/* Secondary blob — About area */}
      <SoftBlob
        position={[isMobile ? -1.5 : -3, -4, -3]}
        scale={isMobile ? 1.2 : 2}
        color="#c4d0c8"
        distort={0.35}
        speed={1.8}
        opacity={0.2}
      />

      {/* Elegant rings */}
      <ElegantRing
        position={[isMobile ? -1 : -2.5, 0.5, -4]}
        scale={isMobile ? 2 : 3.5}
        speed={0.02}
        opacity={0.15}
      />
      <ElegantRing
        position={[isMobile ? 1.5 : 3, -3, -3]}
        scale={isMobile ? 1.5 : 2.5}
        speed={0.03}
        color="#c8d0c4"
        opacity={0.12}
      />

      {/* Wireframe accents */}
      <WireShape
        position={[isMobile ? 2 : 4.5, -2, -5]}
        scale={isMobile ? 1 : 2}
        speed={0.012}
        opacity={0.06}
      />
      {!isMobile && (
        <WireShape position={[-3.5, -5.5, -4]} scale={1.5} speed={0.018} opacity={0.05} />
      )}

      {/* Soft ribbon */}
      <SoftRibbon
        position={[0, -1, -6]}
        rotation={[-0.1, 0, 0.03]}
        width={isMobile ? 8 : 16}
        height={isMobile ? 0.6 : 1}
        opacity={0.08}
      />
    </group>
  );
};

/* ── Main component ── */
const GlobalScene = () => {
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-0" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 40 }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        gl={{ antialias: !isMobile, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.4} color="#fff5ee" />
        <directionalLight position={[-3, -2, 4]} intensity={0.2} color="#eef5ff" />
        <ScrollScene isMobile={isMobile} />
      </Canvas>
    </div>
  );
};

export default GlobalScene;
