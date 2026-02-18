import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshTransmissionMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

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
        <MeshDistortMaterial
          color={color}
          roughness={0.2}
          metalness={0.8}
          distort={distort}
          speed={2}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
};

const GlassSphere = () => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.15;
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
  });

  return (
    <mesh ref={mesh} position={[2, 0, -1]} scale={1.8}>
      <dodecahedronGeometry args={[1, 2]} />
      <MeshTransmissionMaterial
        backside
        samples={8}
        thickness={0.5}
        chromaticAberration={0.3}
        anisotropy={0.5}
        distortion={0.4}
        distortionScale={0.3}
        temporalDistortion={0.2}
        ior={1.5}
        color="#c4956a"
        roughness={0}
      />
    </mesh>
  );
};

const Particles = ({ count = 200 }: { count?: number }) => {
  const mesh = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#c4956a"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

const WireframeTorus = () => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.1;
    mesh.current.rotation.z = state.clock.elapsedTime * 0.08;
  });

  return (
    <mesh ref={mesh} position={[-3, -1, -3]} scale={2}>
      <torusGeometry args={[1, 0.3, 32, 64]} />
      <meshStandardMaterial
        color="#8a7060"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
};

const Scene = () => {
  return (
    <>
      <Environment preset="night" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#f5e6d3" />
      <pointLight position={[-5, -3, 2]} intensity={0.5} color="#c4956a" />

      <AnimatedSphere position={[-2.5, 1.5, -2]} scale={1.2} speed={1.5} distort={0.4} color="#5a4a3a" />
      <AnimatedSphere position={[3.5, -1, -4]} scale={0.8} speed={2} distort={0.6} color="#8a7060" />
      <AnimatedSphere position={[-1, -2, -3]} scale={0.5} speed={1} distort={0.3} color="#c4956a" />
      
      <GlassSphere />
      <WireframeTorus />
      <Particles count={300} />

      <fog attach="fog" args={["#282624", 5, 20]} />
    </>
  );
};

const HeroScene = () => {
  return (
    <div className="absolute inset-0" style={{ zIndex: 1 }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default HeroScene;
