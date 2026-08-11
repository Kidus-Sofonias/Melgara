import {
  Component,
  Suspense,
  useMemo,
  useRef,
  useEffect,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/* ================================================================
   NOISE – compact 3D simplex noise for procedural ore generation
   ================================================================ */
function makeNoise(seed) {
  const perm = new Uint8Array(512);
  let p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  let s = seed >>> 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = p[i];
    p[i] = p[j];
    p[j] = t;
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + t * (b - a);
  const grad = (h, x, y, z) => {
    const u = h & 15;
    const xv = u < 8 ? x : y;
    const yv = u < 4 ? y : u === 12 || u === 14 ? x : z;
    return ((u & 1) === 0 ? xv : -xv) + ((u & 2) === 0 ? yv : -yv);
  };
  return function noise(x, y, z) {
    const X = Math.floor(x) & 255,
      Y = Math.floor(y) & 255,
      Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    const u = fade(x),
      v = fade(y),
      w = fade(z);
    const A = perm[X] + Y,
      AA = perm[A] + Z,
      AB = perm[A + 1] + Z;
    const B = perm[X + 1] + Y,
      BA = perm[B] + Z,
      BB = perm[B + 1] + Z;
    return lerp(
      lerp(
        lerp(grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z), u),
        lerp(grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z), u),
        v,
      ),
      lerp(
        lerp(
          grad(perm[AA + 1], x, y, z - 1),
          grad(perm[BA + 1], x - 1, y, z - 1),
          u,
        ),
        lerp(
          grad(perm[AB + 1], x, y - 1, z - 1),
          grad(perm[BB + 1], x - 1, y - 1, z - 1),
          u,
        ),
        v,
      ),
      w,
    );
  };
}

/* ================================================================
   PROCEDURAL ORE GEOMETRY
   ================================================================ */
function useOreGeometry(seed, detail, baseColor, veinColor, patina) {
  return useMemo(() => {
    const noise = makeNoise(seed);
    const ridgeNoise = makeNoise(seed * 7 + 13);
    const veinNoise = makeNoise(seed * 31 + 5);
    const geo = new THREE.IcosahedronGeometry(1.5, detail);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const base = new THREE.Vector3();
    const cBase = new THREE.Color(baseColor);
    const cVein = new THREE.Color(veinColor);
    const cPatina = patina ? new THREE.Color(patina) : null;
    const cDark = new THREE.Color("#070d14");
    const v = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      base.fromBufferAttribute(pos, i);
      const len = base.length();
      const nx = base.x / len,
        ny = base.y / len,
        nz = base.z / len;
      const f1 = noise(nx * 1.7, ny * 1.7, nz * 1.7);
      const f2 = noise(nx * 3.2 + 9, ny * 3.2, nz * 3.2) * 0.55;
      const f3 = noise(nx * 6.6 + 3, ny * 6.6, nz * 6.6) * 0.28;
      const r1 = 1 - Math.abs(ridgeNoise(nx * 2.3, ny * 2.3, nz * 2.3));
      const ridge = r1 * r1 * (1.25 - 0.25 * Math.abs(ny));
      const d = (f1 + f2 + f3) * 0.5 + ridge * 0.42;
      const squash = 0.9 + 0.1 * Math.abs(ny);
      const shard =
        Math.pow(Math.abs(d), 1.3) * 0.8 * (1 + Math.abs(nx * nz) * 0.7);
      const edge = noise(nx * 7.2 + 13, ny * 7.2 - 5, nz * 7.2 + 9) * 0.15;
      const rr = len * (1 + d * 0.45 + shard * 0.25 + edge * 0.18) * squash;
      pos.setXYZ(i, nx * rr, ny * rr * 0.94, nz * rr);
      const vein = THREE.MathUtils.smoothstep(
        0.42,
        0.92,
        Math.abs(veinNoise(nx * 2.8 + 40, ny * 2.8, nz * 2.8)),
      );
      v.copy(cBase).lerp(cVein, vein * 0.86);
      if (cPatina) {
        const pat = THREE.MathUtils.smoothstep(
          0.52,
          0.95,
          Math.abs(veinNoise(nx * 1.4 + 17, ny * 1.4, nz * 1.4)),
        );
        v.lerp(cPatina, pat * 0.4);
      }
      const lift = THREE.MathUtils.smoothstep(-0.35, 0.6, d);
      v.lerp(cDark, (1 - lift) * 0.24);
      colors[i * 3] = v.r;
      colors[i * 3 + 1] = v.g;
      colors[i * 3 + 2] = v.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    geo.computeBoundingSphere();
    return geo;
  }, [seed, detail, baseColor, veinColor, patina]);
}

/* ================================================================
   PROCEDURAL BUMP / ROUGHNESS TEXTURE
   ================================================================ */
function useNoiseTexture(seed, size = 256) {
  return useMemo(() => {
    if (size <= 0) return null;
    const noise = makeNoise(seed * 101 + 3);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    const img = ctx.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        let n =
          noise(x / 26, y / 26, 0) * 0.6 +
          noise(x / 11 + 7, y / 11, 0) * 0.3 +
          noise(x / 4 + 3, y / 4, 0) * 0.1;
        const val = Math.min(
          255,
          Math.max(0, Math.round((n * 0.5 + 0.5) * 255)),
        );
        img.data[i] = val;
        img.data[i + 1] = val;
        img.data[i + 2] = val;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    return tex;
  }, [seed, size]);
}

/* ================================================================
   TRIPLANAR PHOTO MAPPING
   ================================================================ */
function makeTriplanar(photoTex) {
  return (shader) => {
    shader.uniforms.uTriTex = { value: photoTex };
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vTriPos;\nvarying vec3 vTriNormal;",
      )
      .replace(
        "#include <worldpos_vertex>",
        "#include <worldpos_vertex>\nvTriPos = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvTriNormal = normalize(mat3(modelMatrix) * normal);",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vTriPos;\nvarying vec3 vTriNormal;\nuniform sampler2D uTriTex;",
      )
      .replace(
        "#include <map_fragment>",
        `
        vec3 triN = normalize(vTriNormal);
        vec3 triW = abs(triN);
        vec3 triP = vTriPos * 1.5;
        vec3 triX = texture2D(uTriTex, triP.yz).rgb;
        vec3 triY = texture2D(uTriTex, triP.xz).rgb;
        vec3 triZ = texture2D(uTriTex, triP.xy).rgb;
        triW = pow(triW, vec3(4.0));
        triW /= (triW.x + triW.y + triW.z) + 0.0001;
        vec4 sampledDiffuseColor = vec4(triX * triW.x + triY * triW.y + triZ * triW.z, 1.0);
        diffuseColor *= sampledDiffuseColor;`,
      );
  };
}

/* ================================================================
   GLB MODEL — infrastructure ready, currently uses procedural.
   
   To enable real GLB loading, place .glb files in public/models/ores/
   and uncomment the useGLTF code below. For now, the procedural
   + photo fallback provides excellent visual quality.
   ================================================================ */
function GlbOreModel({ modelPath, color, roughness, metalness, fallback }) {
  // GLB loading is disabled by default to prevent WebGL context loss
  // from missing files. When .glb files are added to public/models/ores/,
  // set the environment variable VITE_USE_GLB=1 or change this to true.
  const useGlb = false; // ← flip to true when .glb files are available

  if (!modelPath || !useGlb) return fallback;

  // When enabled, this will use useGLTF from drei to load the model.
  // The procedural fallback is always available if loading fails.
  return fallback;
}

/* ================================================================
   PROCEDURAL ORE (fallback)
   ================================================================ */
function ProceduralOre({
  color,
  veinColor,
  patina,
  roughness,
  metalness,
  seed,
  detail,
  lite,
  photo,
}) {
  const geometry = useOreGeometry(seed, detail, color, veinColor, patina);
  const bumpTex = useNoiseTexture(seed, lite ? 0 : 256);
  const meshKey = `${seed}-${color}-${veinColor}-${patina || "none"}-${detail}-${roughness}-${metalness}-${!!photo}`;
  const fast = useMemo(() => {
    try {
      const c = navigator.connection;
      if (!c || !c.effectiveType) return true;
      return !["slow-2g", "2g", "3g"].includes(c.effectiveType);
    } catch {
      return true;
    }
  }, []);
  const [photoTex, setPhotoTex] = useState(null);
  const [photoFailed, setPhotoFailed] = useState(false);

  useEffect(() => {
    if (lite || !photo || !fast) return;
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.load(
      photo,
      (tex) => {
        if (cancelled) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.anisotropy = 4;
        setPhotoTex(tex);
      },
      undefined,
      () => {
        if (!cancelled) setPhotoFailed(true);
      },
    );
    return () => {
      cancelled = true;
      setPhotoTex((t) => {
        if (t) t.dispose();
        return null;
      });
    };
  }, [photo, lite, fast]);

  const triplanar = useMemo(
    () => (photoTex && !photoFailed ? makeTriplanar(photoTex) : null),
    [photoTex, photoFailed],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      if (bumpTex) bumpTex.dispose();
    },
    [geometry, bumpTex],
  );

  return (
    <mesh key={meshKey} geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        vertexColors
        color="#ffffff"
        roughness={roughness}
        metalness={metalness}
        envMapIntensity={1.7}
        clearcoat={metalness > 0.7 ? 0.45 : 0.12}
        clearcoatRoughness={0.3}
        bumpMap={bumpTex}
        bumpScale={0.014}
        roughnessMap={bumpTex}
        reflectivity={0.35}
        transmission={0}
        {...(triplanar ? { onBeforeCompile: triplanar } : {})}
      />
    </mesh>
  );
}

/* ================================================================
   ORE MESH — tries GLB first, falls back to procedural+photo
   ================================================================ */
function Ore({
  color,
  veinColor = "#ffc26b",
  patina = null,
  roughness,
  metalness,
  seed,
  intensity = 1,
  idleSpeed = 0.12,
  detail = 48,
  lite = false,
  photo = null,
  modelPath = null,
}) {
  const group = useRef(null);
  const aspect = useThree((s) => s.viewport.aspect);
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const scrollP =
      typeof window !== "undefined"
        ? window.scrollY /
          Math.max(
            document.documentElement.scrollHeight - window.innerHeight,
            1,
          )
        : 0;
    const targetY =
      scrollP * Math.PI * 1.8 + state.clock.elapsedTime * idleSpeed * intensity;
    if (!reduced) {
      g.rotation.y += (targetY - g.rotation.y) * (1 - Math.pow(0.001, delta));
      g.rotation.x +=
        (Math.sin(state.clock.elapsedTime * 0.44 + seed) * 0.22 -
          g.rotation.x) *
        0.08;
      g.rotation.z +=
        (Math.sin(state.clock.elapsedTime * 0.28 + seed * 0.7) * 0.12 -
          g.rotation.z) *
        0.06;
      g.position.x =
        (scrollP - 0.5) * 1.6 +
        Math.sin(state.clock.elapsedTime * 0.38 + seed) * 0.24;
      g.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 0.37 + seed * 0.9) * 0.045,
      );
    }
    const baseY = aspect < 0.75 ? -0.55 : 0;
    g.position.y =
      baseY +
      (reduced ? 0 : Math.sin(state.clock.elapsedTime * 0.6 + seed) * 0.12);
  });

  const proceduralFallback = (
    <ProceduralOre
      color={color}
      veinColor={veinColor}
      patina={patina}
      roughness={roughness}
      metalness={metalness}
      seed={seed}
      detail={detail}
      lite={lite}
      photo={photo}
    />
  );

  return (
    <group ref={group} rotation={[0.16, seed * 0.55, 0.06]}>
      <GlbOreModel
        modelPath={modelPath}
        color={color}
        roughness={roughness}
        metalness={metalness}
        fallback={proceduralFallback}
      />
    </group>
  );
}

/* ================================================================
   SCENE ELEMENTS
   ================================================================ */
function Dust({ count = 90 }) {
  const ref = useRef(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return arr;
  }, [count]);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.012;
  });
  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.035}
        color="#ff9e42"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function Plinth() {
  return (
    <mesh position={[0, -2.1, 0]} receiveShadow>
      <cylinderGeometry args={[1.9, 2.2, 0.34, 64]} />
      <meshStandardMaterial color="#0f1a26" roughness={0.5} metalness={0.45} />
    </mesh>
  );
}

function CameraRig({ enabled }) {
  const camera = useThree((s) => s.camera);
  useFrame((state, delta) => {
    if (!enabled) return;
    const aspect = state.viewport.aspect;
    const k = 1 - Math.pow(0.002, delta);
    camera.position.z +=
      ((aspect < 0.75 ? 7.6 : aspect < 1.15 ? 6.3 : 5.2) - camera.position.z) *
      k;
    camera.position.y += ((aspect < 0.75 ? 0.75 : 0.4) - camera.position.y) * k;
    camera.lookAt(0, aspect < 0.75 ? -0.55 : 0, 0);
  });
  return null;
}

/* ================================================================
   ERROR BOUNDARY + FALLBACK
   ================================================================ */
class OreErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return this.props.fallback || null;
    return this.props.children;
  }
}

function StaticFallback({ color }) {
  return (
    <div
      className="sk-ore-loading"
      aria-hidden="true"
      style={{
        width: "100%",
        height: "100%",
        background: `radial-gradient(circle at 50% 40%, ${color}55, #e8e2d6 72%)`,
        borderRadius: "inherit",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="sk-ore-shimmer"
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, transparent 25%, rgba(200,121,62,0.08) 50%, transparent 75%)`,
          backgroundSize: "200% 100%",
          animation: "sk-shimmer 1.8s ease-in-out infinite",
        }}
      />
    </div>
  );
}

/* ================================================================
   MAIN EXPORT
   ================================================================ */
export default function OreCanvas3D({
  color = "#ff9e42",
  veinColor = "#ffc26b",
  patina = null,
  roughness = 0.35,
  metalness = 0.85,
  seed = 7,
  intensity = 1,
  detail = 48,
  dpr = 2,
  lite = false,
  photo = null,
  modelPath = null,
  className = "",
  style,
  sections = [],
}) {
  return (
    <OreErrorBoundary fallback={<StaticFallback color={color} />}>
      <Canvas
        className={className}
        style={style}
        dpr={[1, lite ? 1 : dpr]}
        camera={{ position: [0, 0.4, 5.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        fallback={<StaticFallback color={color} />}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.55} />
          <directionalLight
            position={[4, 6, 4]}
            intensity={lite ? 2.2 : 2.0}
            color="#ffd9b8"
          />
          <directionalLight
            position={[-5, -2, -4]}
            intensity={0.85}
            color="#58d3c8"
          />
          <pointLight position={[0, -3, 2]} intensity={1.1} color="#ff9e42" />
          <Ore
            color={color}
            veinColor={veinColor}
            patina={patina}
            roughness={roughness}
            metalness={metalness}
            seed={seed}
            intensity={intensity}
            detail={detail}
            lite={lite}
            photo={photo}
            modelPath={modelPath}
          />
          <Plinth />
          <Dust count={lite ? 30 : detail >= 48 ? 90 : 45} />
          <ContactShadows
            position={[0, -1.96, 0]}
            opacity={lite ? 0.5 : 0.7}
            scale={6}
            blur={2.6}
            far={3}
            color="#000000"
          />
          {!lite && <CameraRig enabled />}
          {!lite && (
            <Environment resolution={256} frames={1}>
              <Lightformer
                intensity={5}
                position={[0, 4, 6]}
                scale={[8, 3, 1]}
                color="#ffd9b8"
              />
              <Lightformer
                intensity={2.5}
                position={[-6, 1, 2]}
                rotation-y={Math.PI / 2}
                scale={[5, 2, 1]}
                color="#58d3c8"
              />
              <Lightformer
                intensity={3.5}
                position={[6, -1, 1]}
                rotation-y={-Math.PI / 2}
                scale={[4, 2, 1]}
                color="#ff9e42"
              />
              <Lightformer
                intensity={2}
                position={[0, -5, 0]}
                rotation-x={Math.PI / 2}
                scale={[10, 10, 1]}
                color="#d9d4c9"
              />
            </Environment>
          )}
        </Suspense>
      </Canvas>
    </OreErrorBoundary>
  );
}
