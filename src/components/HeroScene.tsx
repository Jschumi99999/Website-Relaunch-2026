import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshTransmissionMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

/* ── Shared primitives ── */

const AnimatedSphere = ({ position, scale, speed, distort, color }: {
  position: [number, number, number];
  scale: number;
  speed: number;
  distort: number;
  color: string;
}) => {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
    mesh.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
  });
  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={mesh} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial color={color} roughness={0.2} metalness={0.8} distort={distort} speed={2} transparent opacity={0.7} />
      </mesh>
    </Float>
  );
};

const GlassSphere = ({ position = [2, 0, -1] as [number, number, number], scale = 1.8 }) => {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.15;
    mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
  });
  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <dodecahedronGeometry args={[1, 2]} />
      <MeshTransmissionMaterial backside samples={6} thickness={0.5} chromaticAberration={0.3} anisotropy={0.5} distortion={0.4} distortionScale={0.3} temporalDistortion={0.2} ior={1.5} color="#c4956a" roughness={0} />
    </mesh>
  );
};

const Particles = ({ count = 200, spread = 20, color = "#c4956a", size = 0.03 }: { count?: number; spread?: number; color?: string; size?: number }) => {
  const mesh = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    return pos;
  }, [count, spread]);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.01;
  });
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={size} color={color} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

const WireframeTorus = ({ position = [-3, -1, -3] as [number, number, number], scale = 2, color = "#8a7060" }) => {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.1;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.08;
  });
  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <torusGeometry args={[1, 0.3, 32, 64]} />
      <meshStandardMaterial color={color} wireframe transparent opacity={0.3} />
    </mesh>
  );
};

/* ── Shopping bag shape (extruded) ── */
const ShoppingBag = ({ position, scale = 1, color = "#c4956a" }: { position: [number, number, number]; scale?: number; color?: string }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.5, -0.7);
    s.lineTo(-0.5, 0.5);
    s.quadraticCurveTo(-0.5, 0.7, -0.3, 0.7);
    s.lineTo(0.3, 0.7);
    s.quadraticCurveTo(0.5, 0.7, 0.5, 0.5);
    s.lineTo(0.5, -0.7);
    s.lineTo(-0.5, -0.7);
    return s;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.2;
    mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6) * 0.15;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={mesh} position={position} scale={scale}>
        <extrudeGeometry args={[shape, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 }]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} transparent opacity={0.8} />
      </mesh>
    </Float>
  );
};

/* ── Code bracket shape ── */
const CodeBracket = ({ position, scale = 1, color = "#8a7060" }: { position: [number, number, number]; scale?: number; color?: string }) => {
  const mesh = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <group ref={mesh} position={position} scale={scale}>
        {/* Left bracket < */}
        <mesh position={[-0.4, 0, 0]}>
          <boxGeometry args={[0.08, 1.2, 0.08]} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} transparent opacity={0.7} />
        </mesh>
        <mesh position={[-0.6, 0.3, 0]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.08, 0.7, 0.08]} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} transparent opacity={0.7} />
        </mesh>
        <mesh position={[-0.6, -0.3, 0]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.08, 0.7, 0.08]} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} transparent opacity={0.7} />
        </mesh>
        {/* Right bracket > */}
        <mesh position={[0.4, 0, 0]}>
          <boxGeometry args={[0.08, 1.2, 0.08]} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.6, 0.3, 0]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.08, 0.7, 0.08]} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} transparent opacity={0.7} />
        </mesh>
        <mesh position={[0.6, -0.3, 0]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.08, 0.7, 0.08]} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} transparent opacity={0.7} />
        </mesh>
        {/* Slash / */}
        <mesh rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.06, 1.4, 0.06]} />
          <meshStandardMaterial color="#c4956a" metalness={0.6} roughness={0.3} transparent opacity={0.5} />
        </mesh>
      </group>
    </Float>
  );
};

/* ── Diamond / gem shape ── */
const Diamond = ({ position, scale = 1, color = "#c4956a" }: { position: [number, number, number]; scale?: number; color?: string }) => {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.3;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
  });
  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={mesh} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} transparent opacity={0.6} />
      </mesh>
    </Float>
  );
};

/* ── Connected nodes (process/network) ── */
const ConnectedNodes = ({ positions, color = "#c4956a" }: { positions: [number, number, number][]; color?: string }) => {
  const group = useRef<THREE.Group>(null);
  const lineRef = useRef<THREE.Line>(null);

  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    positions.forEach((p) => points.push(new THREE.Vector3(...p)));
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [positions]);

  const lineMaterial = useMemo(() => new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.2 }), [color]);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={group}>
      {positions.map((pos, i) => (
        <Float key={i} speed={0.8 + i * 0.2} floatIntensity={0.3}>
          <mesh position={pos}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.8} roughness={0.2} />
          </mesh>
        </Float>
      ))}
      <primitive object={new THREE.Line(lineGeometry, lineMaterial)} />
    </group>
  );
};

/* ── Ring / orbit ── */
const OrbitRing = ({ position, scale = 1, color = "#8a7060", speed = 0.1 }: { position: [number, number, number]; scale?: number; color?: string; speed?: number }) => {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * speed;
    mesh.current.rotation.y = state.clock.elapsedTime * speed * 0.7;
  });
  return (
    <mesh ref={mesh} position={position} scale={scale}>
      <torusGeometry args={[1, 0.02, 16, 100]} />
      <meshStandardMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
};

/* ═══════════════════════════════════════════════
   SCENE DEFINITIONS
   ═══════════════════════════════════════════════ */

/* ── Hero Scene ── */
const HeroSceneContent = ({ isMobile }: { isMobile: boolean }) => (
  <>
    <Environment preset="night" />
    <ambientLight intensity={0.3} />
    <directionalLight position={[5, 5, 5]} intensity={0.8} color="#f5e6d3" />
    <pointLight position={[-5, -3, 2]} intensity={0.5} color="#c4956a" />

    <AnimatedSphere position={isMobile ? [-1.5, 1.2, -2] : [-2.5, 1.5, -2]} scale={isMobile ? 0.8 : 1.2} speed={1.5} distort={0.4} color="#5a4a3a" />
    <AnimatedSphere position={isMobile ? [2, -0.5, -4] : [3.5, -1, -4]} scale={isMobile ? 0.5 : 0.8} speed={2} distort={0.6} color="#8a7060" />
    {!isMobile && <AnimatedSphere position={[-1, -2, -3]} scale={0.5} speed={1} distort={0.3} color="#c4956a" />}

    <GlassSphere position={isMobile ? [1.5, 0, -1] : [2, 0, -1]} scale={isMobile ? 1.2 : 1.8} />
    <WireframeTorus position={isMobile ? [-2, -0.5, -3] : [-3, -1, -3]} scale={isMobile ? 1.2 : 2} />
    <Particles count={isMobile ? 100 : 300} />

    <fog attach="fog" args={["#282624", 5, 20]} />
  </>
);

/* ── About Scene: shopping bags + brand diamonds ── */
const AboutSceneContent = ({ isMobile }: { isMobile: boolean }) => (
  <>
    <ambientLight intensity={0.4} />
    <directionalLight position={[3, 5, 4]} intensity={0.6} color="#f5e6d3" />
    <pointLight position={[-3, 2, 3]} intensity={0.3} color="#c4956a" />

    <ShoppingBag position={isMobile ? [2, 0.5, -1] : [3, 1, -2]} scale={isMobile ? 0.8 : 1.2} color="#8a7060" />
    {!isMobile && <ShoppingBag position={[-3, -0.5, -3]} scale={0.7} color="#5a4a3a" />}
    <Diamond position={isMobile ? [-1.5, -0.5, -2] : [-2, -1, -2]} scale={isMobile ? 0.3 : 0.5} color="#c4956a" />
    {!isMobile && <Diamond position={[2, -1.5, -4]} scale={0.3} color="#8a7060" />}
    <OrbitRing position={isMobile ? [1.5, 0, -2] : [2.5, 0, -3]} scale={isMobile ? 1 : 1.5} speed={0.08} />
    <Particles count={isMobile ? 50 : 120} spread={15} color="#c4956a" size={0.02} />

    <fog attach="fog" args={["hsl(30, 10%, 97%)", 6, 18]} />
  </>
);

/* ── Services Scene: code brackets + tech geometry ── */
const ServicesSceneContent = ({ isMobile }: { isMobile: boolean }) => (
  <>
    <ambientLight intensity={0.35} />
    <directionalLight position={[-3, 5, 4]} intensity={0.5} color="#f5e6d3" />
    <pointLight position={[4, -2, 2]} intensity={0.4} color="#c4956a" />

    <CodeBracket position={isMobile ? [-1.5, 1, -2] : [-3, 1.5, -3]} scale={isMobile ? 0.8 : 1.2} />
    {!isMobile && <CodeBracket position={[3.5, -0.5, -4]} scale={0.6} color="#5a4a3a" />}
    <WireframeTorus position={isMobile ? [1.5, -0.5, -3] : [3, -1, -3]} scale={isMobile ? 0.8 : 1.2} color="#5a4a3a" />
    <AnimatedSphere position={isMobile ? [1.5, 1, -2] : [2.5, 1.5, -2]} scale={isMobile ? 0.4 : 0.6} speed={1.2} distort={0.3} color="#c4956a" />
    {!isMobile && <OrbitRing position={[-2, -1, -2]} scale={1} speed={0.12} color="#c4956a" />}
    <Particles count={isMobile ? 40 : 100} spread={14} color="#8a7060" size={0.025} />

    <fog attach="fog" args={["hsl(30, 10%, 95%)", 5, 16]} />
  </>
);

/* ── Process Scene: connected nodes pipeline ── */
const ProcessSceneContent = ({ isMobile }: { isMobile: boolean }) => {
  const nodePositions: [number, number, number][] = isMobile
    ? [[-1.5, 1, -2], [-0.5, 0, -2], [0.5, -0.5, -2], [1.5, -1.2, -2]]
    : [[-3, 1, -2], [-1, 0.5, -3], [1, -0.5, -2], [3, -1, -3]];

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 3, 4]} intensity={0.5} color="#f5e6d3" />
      <pointLight position={[-3, -2, 3]} intensity={0.3} color="#c4956a" />

      <ConnectedNodes positions={nodePositions} color="#c4956a" />
      <Diamond position={isMobile ? [1, 1.2, -3] : [2, 2, -4]} scale={isMobile ? 0.2 : 0.4} color="#8a7060" />
      {!isMobile && <WireframeTorus position={[-3, -2, -4]} scale={0.8} color="#5a4a3a" />}
      {!isMobile && <OrbitRing position={[0, 0, -3]} scale={2.5} speed={0.03} color="#8a7060" />}
      <Particles count={isMobile ? 30 : 80} spread={12} color="#c4956a" size={0.02} />

      <fog attach="fog" args={["hsl(30, 10%, 97%)", 5, 16]} />
    </>
  );
};

/* ── CTA Scene: glowing particles + orbits ── */
const CTASceneContent = ({ isMobile }: { isMobile: boolean }) => (
  <>
    <ambientLight intensity={0.2} />
    <pointLight position={[0, 0, 3]} intensity={0.8} color="#c4956a" />
    <pointLight position={[-3, 2, -2]} intensity={0.3} color="#f5e6d3" />

    <GlassSphere position={isMobile ? [-1, 0.5, -1] : [-2.5, 1, -2]} scale={isMobile ? 0.8 : 1.2} />
    {!isMobile && <AnimatedSphere position={[3, -1, -3]} scale={0.6} speed={0.8} distort={0.5} color="#5a4a3a" />}
    <OrbitRing position={[0, 0, -2]} scale={isMobile ? 1.5 : 3} speed={0.05} color="#c4956a" />
    <OrbitRing position={[0, 0, -2]} scale={isMobile ? 1.8 : 3.5} speed={0.03} color="#8a7060" />
    {!isMobile && <Diamond position={[2.5, 1.5, -4]} scale={0.3} color="#c4956a" />}
    <Particles count={isMobile ? 60 : 200} spread={16} color="#c4956a" size={0.035} />

    <fog attach="fog" args={["hsl(30, 5%, 15%)", 4, 16]} />
  </>
);

/* ═══════════════════════════════════════════════
   CANVAS WRAPPER
   ═══════════════════════════════════════════════ */

interface SceneCanvasProps {
  children: React.ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
}

const SceneCanvas = ({ children, className = "", cameraPosition = [0, 0, 6], fov = 55 }: SceneCanvasProps) => {
  const isMobile = useIsMobile();
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} style={{ zIndex: 1 }}>
      <Canvas
        camera={{ position: cameraPosition, fov }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        gl={{ antialias: !isMobile, alpha: true }}
        style={{ background: "transparent" }}
      >
        {children}
      </Canvas>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   EXPORTS
   ═══════════════════════════════════════════════ */

export const HeroScene = () => {
  const isMobile = useIsMobile();
  return (
    <SceneCanvas>
      <HeroSceneContent isMobile={isMobile} />
    </SceneCanvas>
  );
};

export const AboutScene = () => {
  const isMobile = useIsMobile();
  return (
    <SceneCanvas cameraPosition={[0, 0, 5]} fov={50}>
      <AboutSceneContent isMobile={isMobile} />
    </SceneCanvas>
  );
};

export const ServicesScene = () => {
  const isMobile = useIsMobile();
  return (
    <SceneCanvas cameraPosition={[0, 0, 5]} fov={50}>
      <ServicesSceneContent isMobile={isMobile} />
    </SceneCanvas>
  );
};

export const ProcessScene = () => {
  const isMobile = useIsMobile();
  return (
    <SceneCanvas cameraPosition={[0, 0, 5]} fov={50}>
      <ProcessSceneContent isMobile={isMobile} />
    </SceneCanvas>
  );
};

export const CTAScene = () => {
  const isMobile = useIsMobile();
  return (
    <SceneCanvas cameraPosition={[0, 0, 5]} fov={50}>
      <CTASceneContent isMobile={isMobile} />
    </SceneCanvas>
  );
};

export default HeroScene;
