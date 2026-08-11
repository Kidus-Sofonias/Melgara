import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";

/* ================================================================
   GLOBE REACH — r3f globe
   Replaces the previous cobe-based canvas with a full
   @react-three/fiber scene: procedural earth texture, atmosphere
   glow, trade arcs, markers with hover highlight + DOM tooltip,
   click-to-focus zoom, and reset on empty-space click.
   ================================================================ */

/* ---- Location data for Melgara's global footprint ---- */
const LOCATIONS = [
  {
    name: "Addis Ababa",
    country: "Ethiopia",
    lat: 9.0192,
    lng: 38.7525,
    role: "hq",
    note: "Headquarters · Mining & Manufacturing",
    slug: "about",
  },
  {
    name: "Khartoum",
    country: "Sudan",
    lat: 15.5007,
    lng: 32.5599,
    role: "operations",
    note: "Mineral sourcing & operations",
  },
  {
    name: "Asmara",
    country: "Eritrea",
    lat: 15.3389,
    lng: 38.9318,
    role: "operations",
    note: "Mineral sourcing & operations",
  },
  {
    name: "Mogadishu",
    country: "Somalia",
    lat: 2.0469,
    lng: 45.3182,
    role: "operations",
    note: "Mineral sourcing & operations",
  },
  {
    name: "Kampala",
    country: "Uganda",
    lat: 0.3476,
    lng: 32.5825,
    role: "operations",
    note: "Mineral sourcing & operations",
  },
  {
    name: "Nairobi",
    country: "Kenya",
    lat: -1.2921,
    lng: 36.8219,
    role: "logistics",
    note: "Regional trade & logistics",
  },
  {
    name: "Dubai",
    country: "UAE",
    lat: 25.2048,
    lng: 55.2708,
    role: "hub",
    note: "International trading hub",
    slug: "contact",
  },
];

const ARCS = [
  { from: "Khartoum", to: "Addis Ababa" },
  { from: "Asmara", to: "Addis Ababa" },
  { from: "Mogadishu", to: "Addis Ababa" },
  { from: "Kampala", to: "Addis Ababa" },
  { from: "Addis Ababa", to: "Nairobi" },
  { from: "Nairobi", to: "Dubai" },
  { from: "Addis Ababa", to: "Dubai" },
  { from: "Dubai", to: "London" },
  { from: "Dubai", to: "Mumbai" },
  { from: "Dubai", to: "Shanghai" },
];

const GLOBAL_ENDPOINTS = [
  { name: "London", country: "UK", lat: 51.5074, lng: -0.1278, role: "global", note: "European market" },
  { name: "Mumbai", country: "India", lat: 19.076, lng: 72.8777, role: "global", note: "Asian market" },
  { name: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737, role: "global", note: "Asian market" },
];

const ALL_POINTS = [...LOCATIONS, ...GLOBAL_ENDPOINTS];
const LOC_MAP = {};
ALL_POINTS.forEach((p) => (LOC_MAP[p.name] = p));

const ROLE_LABELS = {
  hq: "Headquarters",
  hub: "Trading Hub",
  operations: "Operations",
  logistics: "Logistics",
  global: "Market",
};
/* Solid hex colors for the 3D scene (CSS vars can't reach WebGL materials) */
const ROLE_HEX = {
  hq: "#ff9e42",
  hub: "#f0c05a",
  operations: "#c3cdd4",
  logistics: "#9aa7b1",
  global: "#6b7682",
};
/* CSS var colors for the DOM tooltip / legend */
const ROLE_CSS = {
  hq: "var(--copper-bright)",
  hub: "var(--brass)",
  operations: "var(--text-dim)",
  logistics: "var(--muted)",
  global: "var(--faint)",
};

/* Marker size multiplier + city-label config by role — the mentioned
   capitals (HQ + hub + operations) get the spotlight. */
const ROLE_SIZE = {
  hq: 1.5,
  hub: 1.3,
  operations: 1.1,
  logistics: 1.0,
  global: 0.8,
};

const ROLE_LABEL = {
  hq: { scale: 1.12, color: "#ffc26b" },
  hub: { scale: 1.02, color: "#ffd9a0" },
  operations: { scale: 0.88, color: "#ffffff" },
  logistics: { scale: 0.82, color: "#ffffff" },
  global: null,
};

/* ---- Lat/lng -> unit vector on the sphere (matches the sphere UV map) ---- */
function latLngToVector3(lat, lng, radius = 1) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/* ---- Seeded 2D value noise (for the procedural earth texture) ---- */
function makeNoise2D(seed) {
  const size = 256;
  const p = new Uint8Array(size);
  for (let i = 0; i < size; i++) p[i] = i;
  let s = seed >>> 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  for (let i = size - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = p[i];
    p[i] = p[j];
    p[j] = t;
  }
  const perm = new Uint8Array(size * 2);
  for (let i = 0; i < size * 2; i++) perm[i] = p[i & (size - 1)];
  const fade = (t) => t * t * (3 - 2 * t);
  const lerp = (a, b, t) => a + (b - a) * t;
  return (x, y) => {
    const xi = Math.floor(x) & (size - 1);
    const yi = Math.floor(y) & (size - 1);
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);
    const aa = perm[perm[xi] + yi];
    const ab = perm[perm[xi] + yi + 1];
    const ba = perm[perm[xi + 1] + yi];
    const bb = perm[perm[xi + 1] + yi + 1];
    return lerp(lerp(aa, ba, u), lerp(ab, bb, u), v) / 255;
  };
}

/* ---- Procedural equirectangular earth texture (no network needed) ---- */
function makeEarthTexture() {
  const W = 1024;
  const H = 512;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(W, H);
  const n1 = makeNoise2D(42);
  const n2 = makeNoise2D(1337);
  const n3 = makeNoise2D(777);

  const OCEAN_A = [16, 21, 27];
  const OCEAN_B = [26, 34, 43];
  const COAST = [70, 62, 48];
  const LAND_A = [56, 52, 43];
  const LAND_B = [86, 78, 60];
  const SNOW = [118, 114, 102];

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const nx = (x / W) * 6;
      const ny = (y / H) * 3;
      let e =
        n1(nx, ny) * 0.62 + n2(nx * 2.1, ny * 2.1) * 0.26 + n3(nx * 4.3, ny * 4.3) * 0.12;
      e = Math.min(1, e * e * 1.65);

      let r, g, b;
      if (e < 0.48) {
        const t = e / 0.48;
        r = OCEAN_A[0] + (OCEAN_B[0] - OCEAN_A[0]) * t;
        g = OCEAN_A[1] + (OCEAN_B[1] - OCEAN_A[1]) * t;
        b = OCEAN_A[2] + (OCEAN_B[2] - OCEAN_A[2]) * t;
      } else if (e < 0.56) {
        const t = (e - 0.48) / 0.08;
        r = COAST[0] + (LAND_A[0] - COAST[0]) * t;
        g = COAST[1] + (LAND_A[1] - COAST[1]) * t;
        b = COAST[2] + (LAND_A[2] - COAST[2]) * t;
      } else if (e < 0.9) {
        const t = (e - 0.56) / 0.34;
        r = LAND_A[0] + (LAND_B[0] - LAND_A[0]) * t;
        g = LAND_A[1] + (LAND_B[1] - LAND_A[1]) * t;
        b = LAND_A[2] + (LAND_B[2] - LAND_A[2]) * t;
      } else {
        const t = Math.min(1, (e - 0.9) / 0.1);
        r = LAND_B[0] + (SNOW[0] - LAND_B[0]) * t;
        g = LAND_B[1] + (SNOW[1] - LAND_B[1]) * t;
        b = LAND_B[2] + (SNOW[2] - LAND_B[2]) * t;
      }

      // Faint graticule (every 30°) + slightly brighter equator
      const lon = (x / W) * 360 - 180;
      const lat = 90 - (y / H) * 180;
      const grid = Math.abs(lon % 30) < 1.2 || Math.abs(lat % 30) < 1.2;
      const eq = Math.abs(lat) < 1.0;
      if (eq) {
        r = Math.min(255, r + 26);
        g = Math.min(255, g + 26);
        b = Math.min(255, b + 26);
      } else if (grid) {
        r = Math.min(255, r + 10);
        g = Math.min(255, g + 10);
        b = Math.min(255, b + 10);
      }

      img.data[i] = r;
      img.data[i + 1] = g;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

let earthTextureCache = null;
function getEarthTexture() {
  if (!earthTextureCache) earthTextureCache = makeEarthTexture();
  return earthTextureCache;
}

/* ---- Atmosphere glow (additive rim shader) ---- */
const ATMO_VERT = `
varying vec3 vNormal;
void main() {
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
const ATMO_FRAG = `
varying vec3 vNormal;
void main() {
  // max() guards against a negative pow() base (undefined in GLSL)
  float intensity = pow(max(0.0, 0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.6);
  gl_FragColor = vec4(0.95, 0.6, 0.3, 1.0) * intensity * 0.62;
}`;

function Atmosphere() {
  return (
    <mesh scale={1.13}>
      <sphereGeometry args={[1, 48, 48]} />
      <shaderMaterial
        vertexShader={ATMO_VERT}
        fragmentShader={ATMO_FRAG}
        transparent
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ---- Trade arc (elevated quadratic bezier) ---- */
function arcColor(fromName, toName) {
  const f = LOC_MAP[fromName];
  const t = LOC_MAP[toName];
  if (f?.role === "hq" || t?.role === "hq") return "#e08a3c";
  if (f?.role === "hub" || t?.role === "hub") return "#d8a832";
  return "#6b7682";
}

function Arc({ from, to, color }) {
  const geometry = useMemo(() => {
    if (!from || !to) return null;
    const a = latLngToVector3(from.lat, from.lng, 1.0);
    const b = latLngToVector3(to.lat, to.lng, 1.0);
    const dist = a.distanceTo(b);
    const mid = a
      .clone()
      .add(b)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(1.04 + dist * 0.16);
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(42));
  }, [from, to]);

  useEffect(() => () => geometry && geometry.dispose(), [geometry]);
  if (!geometry) return null;

  return (
    <line geometry={geometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={0.26}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </line>
  );
}

/* ---- Marker: dot + ring + invisible hit target ---- */
function Marker({ loc, hex, isActive, onOver, onOut, onClick, markerRefs }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const hitRef = useRef(null);
  const size = ROLE_SIZE[loc.role] || 1;
  const pos = useMemo(
    () => latLngToVector3(loc.lat, loc.lng, 1.02),
    [loc.lat, loc.lng]
  );
  const scaleRef = useRef(1);

  // Register this marker's mesh so the tooltip projector can track it
  useEffect(() => {
    if (markerRefs) markerRefs.current[loc.name] = dotRef;
    return () => {
      if (markerRefs && markerRefs.current) delete markerRefs.current[loc.name];
    };
  }, [loc.name, markerRefs]);

  useFrame(({ camera, clock }) => {
    const target = isActive ? 1.75 : 1;
    scaleRef.current += (target - scaleRef.current) * 0.14;
    if (dotRef.current) dotRef.current.scale.setScalar(scaleRef.current);
    if (ringRef.current) {
      ringRef.current.lookAt(camera.position);
      const pulse = isActive
        ? 1 + Math.sin(clock.elapsedTime * 5.2) * 0.22
        : 1 + Math.sin(clock.elapsedTime * 1.8 + loc.lng) * 0.07;
      ringRef.current.scale.setScalar(pulse);
      ringRef.current.material.opacity = isActive ? 0.95 : 0.38;
    }
    if (hitRef.current) hitRef.current.scale.setScalar(Math.max(scaleRef.current, 1));
  });

  return (
    <group position={pos}>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.024 * size, 16, 16]} />
        <meshBasicMaterial color={hex} />
      </mesh>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.036 * size, 0.066 * size, 40]} />
        <meshBasicMaterial
          color={hex}
          transparent
          opacity={0.38}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* invisible, slightly larger hit area for easier hovering */}
      <mesh ref={hitRef} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
        <sphereGeometry args={[0.085 * Math.max(size, 1), 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
    </group>
  );
}

/* ---- City label: canvas-text sprite that always faces the camera ---- */
function makeLabelTexture(name, color) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const font = '600 30px "Space Grotesk", "Inter", system-ui, sans-serif';
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(name).width) + 52;
  const h = 66;
  canvas.width = w;
  canvas.height = h;
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const cx = w / 2;
  const cy = h / 2;
  ctx.fillStyle = "rgba(23, 30, 36, 0.62)";
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(cx - w / 2 + 10, cy - 21, w - 20, 42, 21);
    ctx.fill();
  } else {
    ctx.fillRect(cx - w / 2 + 10, cy - 21, w - 20, 42);
  }
  ctx.fillStyle = color;
  ctx.fillText(name, cx, cy + 1);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 2;
  return tex;
}

function CityLabel({ loc }) {
  const cfg = ROLE_LABEL[loc.role];
  const pos = useMemo(
    () => latLngToVector3(loc.lat, loc.lng, 1.16),
    [loc.lat, loc.lng]
  );
  const tex = useMemo(
    () => (cfg ? makeLabelTexture(loc.name, cfg.color) : null),
    [loc.name, cfg]
  );

  useEffect(() => () => tex && tex.dispose(), [tex]);
  if (!cfg || !tex) return null;

  const s = cfg.scale;
  return (
    <sprite position={pos} scale={[s, s * 0.2, 1]} raycast={() => null}>
      <spriteMaterial map={tex} transparent depthWrite={false} sizeAttenuation />
    </sprite>
  );
}

/* ---- Spinning globe group + focus/zoom rig ---- */
const Z_AXIS = new THREE.Vector3(0, 0, 1);

function GlobeScene({ focused, hovering, activeName, markerRefs, onHover, onOut, onPick }) {
  const spin = useRef(null);
  const { camera } = useThree();
  const focusStart = useRef(0);
  const qTarget = useMemo(() => new THREE.Quaternion(), []);
  const dirV = useMemo(() => new THREE.Vector3(), []);
  const spinSpeed = 0.055;

  // Pooled vectors (no per-frame allocations)
  const focusDir = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    focusStart.current = performance.now();
  }, [focused]);

  useFrame((state, delta) => {
    const g = spin.current;
    if (!g) return;
    const damp = 1 - Math.pow(0.0015, delta);
    if (focused) {
      const phi = ((90 - focused.lat) * Math.PI) / 180;
      const theta = ((focused.lng + 180) * Math.PI) / 180;
      focusDir.set(
        -(Math.sin(phi) * Math.cos(theta)),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      );
      dirV.copy(focusDir).normalize();
      qTarget.setFromUnitVectors(dirV, Z_AXIS);
      const t = Math.min(1, (performance.now() - focusStart.current) / 1100);
      g.quaternion.slerp(qTarget, damp * (1.2 + t * 0.6));
      camera.position.z += (2.55 - camera.position.z) * damp;
    } else {
      g.rotation.y += delta * spinSpeed * (hovering ? 0.28 : 1);
      camera.position.z += (3.2 - camera.position.z) * damp;
    }
    g.position.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.035;
  });

  return (
    <group ref={spin}>
      {ARCS.map((arc, i) => (
        <Arc
          key={i}
          from={LOC_MAP[arc.from]}
          to={LOC_MAP[arc.to]}
          color={arcColor(arc.from, arc.to)}
        />
      ))}
      {ALL_POINTS.map((loc) => (
        <Marker
          key={loc.name}
          loc={loc}
          hex={ROLE_HEX[loc.role] || "#8a8580"}
          isActive={activeName === loc.name}
          markerRefs={markerRefs}
          onOver={() => onHover(loc)}
          onOut={onOut}
          onClick={() => onPick(loc)}
        />
      ))}
      {/* City-name labels on the mentioned capitals */}
      {LOCATIONS.map((loc) => (
        <CityLabel key={`label-${loc.name}`} loc={loc} />
      ))}
    </group>
  );
}

/* ---- Projects the active marker to screen space every frame ---- */
function TooltipProbe({ loc, markerRefs, onPos }) {
  const { camera } = useThree();
  const worldPos = useMemo(() => new THREE.Vector3(), []);
  const camDir = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const pos = useMemo(() => ({ x: 0, y: 0 }), []);

  useFrame(() => {
    if (!loc) return onPos(null);
    const dot = markerRefs?.current?.[loc.name];
    if (!dot || !dot.current) return onPos(null);
    dot.current.getWorldPosition(worldPos);
    camDir.copy(camera.position).normalize();
    dir.copy(worldPos).normalize();
    // hide tooltip when the marker rotates to the far side of the globe
    if (dir.dot(camDir) < 0.12) return onPos(null);
    worldPos.project(camera);
    pos.x = worldPos.x * 0.5 + 0.5;
    pos.y = -worldPos.y * 0.5 + 0.5;
    onPos(pos);
  });

  return null;
}

/* ================================================================
   MAIN EXPORT
   ================================================================ */
export default function GlobeReach() {
  const navigate = useNavigate();
  const wrapRef = useRef(null);
  const tooltipRef = useRef(null);
  const markerRefs = useRef({});
  const navTimer = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [legendHover, setLegendHover] = useState(null);
  const [focused, setFocused] = useState(null);
  // Lazy-init the procedural earth texture (cached singleton fallback)
  const [proceduralTex] = useState(getEarthTexture);
  const [earthTex, setEarthTex] = useState(null);

  // Prefer the real equirectangular earth map (real continents, self-hosted);
  // falls back to the procedural texture if the image can't be loaded.
  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.load(
      "/textures/earth-day.jpg",
      (tex) => {
        if (cancelled) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        setEarthTex(tex);
      },
      undefined,
      () => {
        if (!cancelled) setEarthTex(null);
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const mapTexture = earthTex || proceduralTex;

  const tooltipLoc = hovered || legendHover || focused;
  const activeName = tooltipLoc ? tooltipLoc.name : null;

  useEffect(() => () => clearTimeout(navTimer.current), []);

  const applyTooltipPos = useCallback((pos) => {
    const el = tooltipRef.current;
    const wrap = wrapRef.current;
    if (!el || !wrap) return;
    if (!pos) {
      el.style.opacity = "0";
      return;
    }
    const w = wrap.clientWidth || 520;
    const h = wrap.clientHeight || 520;
    const cx = pos.x * w;
    const cy = pos.y * h;
    el.style.left = `${THREE.MathUtils.clamp(cx - 96, 10, Math.max(10, w - 210))}px`;
    el.style.top = `${THREE.MathUtils.clamp(cy - 88, 10, Math.max(10, h - 70))}px`;
    el.style.opacity = "1";
  }, []);

  const handleHover = useCallback((loc) => setHovered(loc), []);
  const handleOut = useCallback(() => setHovered(null), []);
  const handlePick = useCallback(
    (loc) => {
      setFocused(loc);
      if (loc.slug) {
        clearTimeout(navTimer.current);
        navTimer.current = setTimeout(() => navigate(`/${loc.slug}`), 700);
      }
    },
    [navigate]
  );
  const handleReset = useCallback(() => setFocused(null), []);

  return (
    <div className="globe-reach">
      <div
        className="globe-canvas-wrap"
        ref={wrapRef}
        style={{ cursor: tooltipLoc ? "pointer" : "grab" }}
      >
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [0, 0, 3.2], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          style={{ touchAction: "pan-y" }}
          onPointerMissed={handleReset}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[3, 2.5, 4]} intensity={1.5} color="#ffe6c4" />
          <directionalLight position={[-4, -1, -2.5]} intensity={0.7} color="#58d3c8" />
          <group rotation={[0.16, 0, 0]}>
            <mesh onClick={handleReset}>
              <sphereGeometry args={[1, 64, 64]} />
              <meshStandardMaterial map={mapTexture} roughness={0.9} metalness={0.05} />
            </mesh>
            <Atmosphere />
            <GlobeScene
              focused={focused}
              hovering={!!hovered}
              activeName={activeName}
              markerRefs={markerRefs}
              onHover={handleHover}
              onOut={handleOut}
              onPick={handlePick}
            />
          </group>
          <TooltipProbe loc={tooltipLoc} markerRefs={markerRefs} onPos={applyTooltipPos} />
        </Canvas>
        <div className="globe-glow" />
        {tooltipLoc && (
          <div className="globe-tooltip" ref={tooltipRef} style={{ opacity: 0, left: 0, top: 0 }}>
            <div className="globe-tooltip-header">
              <span
                className="globe-tooltip-dot"
                style={{ background: ROLE_CSS[tooltipLoc.role] }}
              />
              <span className="globe-tooltip-city">{tooltipLoc.name}</span>
            </div>
            {tooltipLoc.country && (
              <div className="globe-tooltip-country">{tooltipLoc.country}</div>
            )}
            {tooltipLoc.note && <div className="globe-tooltip-note">{tooltipLoc.note}</div>}
            <div className="globe-tooltip-role">
              {ROLE_LABELS[tooltipLoc.role] || tooltipLoc.role}
              {tooltipLoc.slug && (
                <span className="globe-tooltip-cta"> · Click to view</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="globe-legend">
        {LOCATIONS.map((loc) => (
          <div
            key={loc.name}
            className={`globe-legend-item ${loc.role} ${
              activeName === loc.name ? "is-highlighted" : ""
            }`}
            onMouseEnter={() => setLegendHover(loc)}
            onMouseLeave={() => setLegendHover(null)}
          >
            <span className="globe-legend-dot" style={{ background: ROLE_CSS[loc.role] }} />
            <div>
              <div className="globe-legend-name">{loc.name}</div>
              <div className="globe-legend-note">{loc.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
