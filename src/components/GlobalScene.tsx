import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

/* ═══════════════════════════════════════════════════════════
   CUSTOM SHADER: Flowing Aurora Ribbon
   — Organic, flowing ribbons of light that undulate like
     the northern lights, themed in warm accent tones
   ═══════════════════════════════════════════════════════════ */

const auroraVertexShader = `
  uniform float uTime;
  uniform float uSpeed;
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Multi-frequency wave displacement
    float wave1 = sin(pos.x * 1.5 + uTime * uSpeed) * 0.4;
    float wave2 = sin(pos.x * 3.0 + uTime * uSpeed * 0.7 + 1.5) * 0.15;
    float wave3 = cos(pos.x * 0.8 + uTime * uSpeed * 0.3) * 0.3;
    
    pos.y += wave1 + wave2;
    pos.z += wave3;
    
    vElevation = wave1 + wave2;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const auroraFragmentShader = `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uOpacity;
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    // Blend between three colors based on position and time
    float mixFactor = sin(vUv.x * 3.14159 + uTime * 0.2) * 0.5 + 0.5;
    float mixFactor2 = cos(vUv.y * 6.28 + uTime * 0.15) * 0.5 + 0.5;
    
    vec3 color = mix(uColorA, uColorB, mixFactor);
    color = mix(color, uColorC, mixFactor2 * 0.4);
    
    // Soft edges
    float alpha = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
    alpha *= smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x);
    alpha *= uOpacity;
    
    // Shimmer
    alpha *= 0.7 + 0.3 * sin(vUv.x * 20.0 + uTime * 0.5);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

/* ── Aurora Ribbon component ── */
const AuroraRibbon = ({
  position,
  rotation,
  width = 12,
  height = 2,
  colorA = "#8a6a4a",
  colorB = "#6a8a7a",
  colorC = "#7a6a8a",
  speed = 0.4,
  opacity = 0.12,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  colorA?: string;
  colorB?: string;
  colorC?: string;
  speed?: number;
  opacity?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
      uColorC: { value: new THREE.Color(colorC) },
      uOpacity: { value: opacity },
    }),
    [speed, colorA, colorB, colorC, opacity]
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation || [0, 0, 0]}>
      <planeGeometry args={[width, height, 128, 32]} />
      <shaderMaterial
        vertexShader={auroraVertexShader}
        fragmentShader={auroraFragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};

/* ═══════════════════════════════════════════════════════════
   DATA STREAM: Flowing particles that trace paths
   — Represents data flowing through e-commerce systems
   ═══════════════════════════════════════════════════════════ */

const DataStream = ({
  count = 60,
  radius = 3,
  speed = 0.3,
  yOffset = 0,
  color = "#a08868",
  opacity = 0.5,
}: {
  count?: number;
  radius?: number;
  speed?: number;
  yOffset?: number;
  color?: string;
  opacity?: number;
}) => {
  const ref = useRef<THREE.Points>(null);
  const { positions, phases, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);
    const sp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      ph[i] = Math.random() * Math.PI * 2;
      sp[i] = 0.5 + Math.random() * 1.5;
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
    }
    return { positions: pos, phases: ph, speeds: sp };
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const geo = ref.current.geometry;
    const posAttr = geo.attributes.position;
    const t = state.clock.elapsedTime * speed;

    for (let i = 0; i < count; i++) {
      const phase = phases[i];
      const s = speeds[i];
      const angle = t * s + phase;

      // Spiral helix path
      posAttr.setXYZ(
        i,
        Math.cos(angle) * radius * (0.6 + 0.4 * Math.sin(angle * 0.3)),
        yOffset + Math.sin(angle * 0.5) * 2 + (i / count) * 4 - 2,
        Math.sin(angle) * radius * (0.6 + 0.4 * Math.cos(angle * 0.3)) - 5
      );
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

/* ═══════════════════════════════════════════════════════════
   MORPHING NOISE TERRAIN
   — A living, breathing surface representing the digital
     landscape of e-commerce
   ═══════════════════════════════════════════════════════════ */

const terrainVertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevation;
  
  // Simplex-like noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    float n1 = snoise(pos.xz * 0.3 + uTime * 0.08) * 0.6;
    float n2 = snoise(pos.xz * 0.8 + uTime * 0.12) * 0.2;
    float n3 = snoise(pos.xz * 1.5 + uTime * 0.05) * 0.1;
    
    pos.y += n1 + n2 + n3;
    vElevation = pos.y;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const terrainFragmentShader = `
  uniform float uTime;
  uniform vec3 uLowColor;
  uniform vec3 uHighColor;
  uniform float uOpacity;
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    float heightMix = smoothstep(-0.3, 0.6, vElevation);
    vec3 color = mix(uLowColor, uHighColor, heightMix);
    
    // Grid lines for digital feel
    float gridX = abs(sin(vUv.x * 40.0)) < 0.02 ? 1.0 : 0.0;
    float gridY = abs(sin(vUv.y * 40.0)) < 0.02 ? 1.0 : 0.0;
    float grid = max(gridX, gridY) * 0.15;
    
    // Distance fade
    float fade = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
    fade *= smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x);
    
    float alpha = (uOpacity + grid) * fade;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

const MorphingTerrain = ({
  position,
  rotation,
  size = 20,
  opacity = 0.06,
  isMobile = false,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  size?: number;
  opacity?: number;
  isMobile?: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const segments = isMobile ? 48 : 96;
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uLowColor: { value: new THREE.Color("#3a3530") },
      uHighColor: { value: new THREE.Color("#8a7a6a") },
      uOpacity: { value: opacity },
    }),
    [opacity]
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={[size, size, segments, segments]} />
      <shaderMaterial
        vertexShader={terrainVertexShader}
        fragmentShader={terrainFragmentShader}
        uniforms={uniforms}
        transparent
        wireframe
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};

/* ═══════════════════════════════════════════════════════════
   FLOATING LIGHT ORBS
   — Gentle glowing orbs that drift like will-o'-wisps
   ═══════════════════════════════════════════════════════════ */

const LightOrbs = ({
  count = 15,
  spread = 14,
  color = "#c0a080",
  isMobile = false,
}: {
  count?: number;
  spread?: number;
  color?: string;
  isMobile?: boolean;
}) => {
  const ref = useRef<THREE.Points>(null);
  const actualCount = isMobile ? Math.floor(count * 0.5) : count;

  const { positions, sizes, phases } = useMemo(() => {
    const pos = new Float32Array(actualCount * 3);
    const sz = new Float32Array(actualCount);
    const ph = new Float32Array(actualCount);
    for (let i = 0; i < actualCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 2.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 4;
      sz[i] = 0.08 + Math.random() * 0.15;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, sizes: sz, phases: ph };
  }, [actualCount, spread]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const posAttr = ref.current.geometry.attributes.position;

    for (let i = 0; i < actualCount; i++) {
      const base = i * 3;
      const phase = phases[i];
      // Gentle floating
      posAttr.array[base + 1] += Math.sin(t * 0.3 + phase) * 0.001;
      posAttr.array[base] += Math.cos(t * 0.2 + phase) * 0.0005;
    }
    posAttr.needsUpdate = true;
    ref.current.rotation.y = t * 0.005;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color={color}
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

/* ═══════════════════════════════════════════════════════════
   CONNECTING THREADS
   — Thin lines that connect and disconnect, representing
     the network of digital commerce
   ═══════════════════════════════════════════════════════════ */

const ConnectionThreads = ({
  count = 8,
  isMobile = false,
}: {
  count?: number;
  isMobile?: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const actualCount = isMobile ? 4 : count;

  const lines = useMemo(() => {
    return Array.from({ length: actualCount }, (_, i) => {
      const pointCount = 30;
      const points: THREE.Vector3[] = [];
      const startX = (Math.random() - 0.5) * 16;
      const startY = (Math.random() - 0.5) * 20;
      const startZ = -3 - Math.random() * 6;
      const angle = Math.random() * Math.PI * 2;
      const length = 3 + Math.random() * 5;

      for (let j = 0; j < pointCount; j++) {
        const t = j / (pointCount - 1);
        points.push(
          new THREE.Vector3(
            startX + Math.cos(angle + t * 2) * length * t,
            startY + t * length * 0.5,
            startZ + Math.sin(angle + t * 1.5) * 1.5
          )
        );
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(curve, 32, 0.003, 4, false);
      return { geometry, phase: Math.random() * Math.PI * 2, speed: 0.1 + Math.random() * 0.2 };
    });
  }, [actualCount]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      const line = lines[i];
      if (!line) return;
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      // Pulse opacity
      mat.opacity = 0.06 + Math.sin(t * line.speed + line.phase) * 0.04;
    });
  });

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => (
        <mesh key={i} geometry={line.geometry}>
          <meshBasicMaterial
            color="#9a8a7a"
            transparent
            opacity={0.08}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

/* ═══════════════════════════════════════════════════════════
   SCROLL-REACTIVE SCENE WRAPPER
   ═══════════════════════════════════════════════════════════ */

const ScrollScene = ({ isMobile }: { isMobile: boolean }) => {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    const scrollY = window.scrollY || 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
    // Smooth vertical drift
    group.current.position.y = progress * 6;
    group.current.rotation.y = progress * 0.2;
    group.current.rotation.x = progress * 0.05;
  });

  return (
    <group ref={group}>
      {/* Aurora ribbons — flowing at different depths */}
      <AuroraRibbon
        position={[0, 2, -8]}
        rotation={[-0.2, 0, 0.1]}
        width={isMobile ? 10 : 18}
        height={isMobile ? 1.5 : 3}
        colorA="#8a6a4a"
        colorB="#6a7a6a"
        colorC="#7a6a8a"
        speed={0.3}
        opacity={0.1}
      />
      <AuroraRibbon
        position={[2, -4, -10]}
        rotation={[0.15, 0.3, -0.1]}
        width={isMobile ? 8 : 14}
        height={isMobile ? 1 : 2}
        colorA="#6a8a7a"
        colorB="#8a7a6a"
        colorC="#6a6a8a"
        speed={0.25}
        opacity={0.07}
      />
      {!isMobile && (
        <AuroraRibbon
          position={[-3, -9, -7]}
          rotation={[0.1, -0.2, 0.15]}
          width={16}
          height={2.5}
          colorA="#7a6a5a"
          colorB="#5a7a6a"
          colorC="#8a7a8a"
          speed={0.35}
          opacity={0.08}
        />
      )}

      {/* Data streams — spiraling particles */}
      <DataStream
        count={isMobile ? 30 : 60}
        radius={isMobile ? 2 : 3.5}
        speed={0.25}
        yOffset={1}
        color="#b09878"
        opacity={0.45}
      />
      <DataStream
        count={isMobile ? 20 : 40}
        radius={isMobile ? 1.5 : 2.5}
        speed={0.35}
        yOffset={-5}
        color="#8aaa8a"
        opacity={0.35}
      />

      {/* Morphing terrain — digital landscape */}
      <MorphingTerrain
        position={[0, -3, -8]}
        rotation={[-Math.PI * 0.35, 0, 0]}
        size={isMobile ? 14 : 22}
        opacity={0.05}
        isMobile={isMobile}
      />

      {/* Light orbs — floating accents */}
      <LightOrbs count={isMobile ? 8 : 18} spread={isMobile ? 10 : 16} isMobile={isMobile} />

      {/* Connection threads — network visualization */}
      <ConnectionThreads count={isMobile ? 4 : 8} isMobile={isMobile} />
    </group>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT — Fixed behind everything
   ═══════════════════════════════════════════════════════════ */

const GlobalScene = () => {
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-0" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
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
