import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ---- Location data for Melgara's global footprint ---- */
const LOCATIONS = [
  { name: "Addis Ababa", country: "Ethiopia", lat: 9.0192, lng: 38.7525, role: "hq", note: "Headquarters · Mining & Manufacturing", slug: "about" },
  { name: "Khartoum", country: "Sudan", lat: 15.5007, lng: 32.5599, role: "operations", note: "Mineral sourcing & operations" },
  { name: "Asmara", country: "Eritrea", lat: 15.3389, lng: 38.9318, role: "operations", note: "Mineral sourcing & operations" },
  { name: "Mogadishu", country: "Somalia", lat: 2.0469, lng: 45.3182, role: "operations", note: "Mineral sourcing & operations" },
  { name: "Kampala", country: "Uganda", lat: 0.3476, lng: 32.5825, role: "operations", note: "Mineral sourcing & operations" },
  { name: "Nairobi", country: "Kenya", lat: -1.2921, lng: 36.8219, role: "logistics", note: "Regional trade & logistics" },
  { name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, role: "hub", note: "International trading hub", slug: "contact" },
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

const ROLE_COLORS = { hq: "var(--copper-bright)", hub: "var(--brass)", operations: "var(--text-dim)", logistics: "var(--muted)", global: "var(--faint)" };
const ROLE_LABELS = { hq: "Headquarters", hub: "Trading Hub", operations: "Operations", logistics: "Logistics", global: "Market" };

/* ---- 3D projection helpers for tooltips ---- */
function latLngToVector3(lat, lng, radius) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return {
    x: -(radius * Math.sin(phi) * Math.cos(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
}

function projectToScreen(point3D, phi, theta, size) {
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);
  let x = point3D.x * cosPhi - point3D.z * sinPhi;
  let z = point3D.x * sinPhi + point3D.z * cosPhi;
  let y = point3D.y;
  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);
  const y2 = y * cosTheta - z * sinTheta;
  const z2 = y * sinTheta + z * cosTheta;
  const fov = 2.5;
  const scale = fov / (fov + z2);
  const halfSize = size / 2;
  return { x: halfSize + x * scale * halfSize * 0.8, y: halfSize - y2 * scale * halfSize * 0.8, z: z2 };
}

export default function GlobeReach() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const phiRef = useRef(0);
  const [tooltip, setTooltip] = useState(null);
  const [highlighted, setHighlighted] = useState(null);
  const [globeReady, setGlobeReady] = useState(false);
  const navigate = useNavigate();

  const handleMouseMove = useCallback((e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const size = Math.min(rect.width, 520);
    const halfSize = size / 2;
    const dx = mouseX - halfSize;
    const dy = mouseY - halfSize;
    const distFromCenter = Math.sqrt(dx * dx + dy * dy);
    if (distFromCenter > halfSize * 0.85) { setTooltip(null); setHighlighted(null); return; }
    const phi = phiRef.current;
    let closest = null, closestDist = Infinity;
    for (const loc of ALL_POINTS) {
      const point3D = latLngToVector3(loc.lat, loc.lng, 1);
      const screen = projectToScreen(point3D, phi, 0.15, size);
      if (screen.z > 0.3) continue;
      const dist = Math.sqrt((mouseX - screen.x) ** 2 + (mouseY - screen.y) ** 2);
      const hitRadius = loc.role === "hq" ? 32 : loc.role === "hub" ? 26 : loc.role === "global" ? 16 : 20;
      if (dist < hitRadius && dist < closestDist) { closestDist = dist; closest = { ...loc, screenX: e.clientX, screenY: e.clientY }; }
    }
    setTooltip(closest);
    setHighlighted(closest ? closest.name : null);
  }, []);

  const handleMouseLeave = useCallback(() => { setTooltip(null); setHighlighted(null); }, []);
  const handleClick = useCallback(() => { if (tooltip?.slug) navigate(`/${tooltip.slug}`); }, [tooltip, navigate]);

  /* ---- Initialize globe ---- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let destroyed = false;
    let globeInstance = null;

    const initGlobe = async () => {
      // Dynamic import cobe to avoid bundling issues
      const { default: createGlobe } = await import("cobe");
      if (destroyed) return;

      const GLOBE_SIZE = 520;
      const dpr = Math.min(window.devicePixelRatio, 2);

      // Set explicit canvas dimensions
      canvas.width = GLOBE_SIZE * dpr;
      canvas.height = GLOBE_SIZE * dpr;
      canvas.style.width = "100%";
      canvas.style.height = "100%";

      const cobeMarkers = ALL_POINTS.map((p) => ({
        location: [p.lat, p.lng],
        size: p.role === "hq" ? 0.12 : p.role === "hub" ? 0.1 : p.role === "global" ? 0.04 : 0.06,
      }));

      const cobeArcs = ARCS.map((a) => {
        const from = LOC_MAP[a.from];
        const to = LOC_MAP[a.to];
        if (!from || !to) return null;
        return {
          from: [from.lat, from.lng],
          to: [to.lat, to.lng],
          color: from.role === "hq" || to.role === "hq" ? [0.78, 0.47, 0.24]
            : from.role === "hub" || to.role === "hub" ? [0.79, 0.64, 0.15]
            : [0.6, 0.57, 0.52],
        };
      }).filter(Boolean);

      let currentPhi = 0;

      try {
        globeInstance = createGlobe(canvas, {
          devicePixelRatio: dpr,
          width: GLOBE_SIZE * dpr,
          height: GLOBE_SIZE * dpr,
          phi: 0,
          theta: 0.15,
          dark: 1,
          diffuse: 1.4,
          mapSamples: 14000,
          mapBrightness: 6,
          baseColor: [0.32, 0.32, 0.32],
          markerColor: [0.78, 0.47, 0.24],
          glowColor: [0.15, 0.13, 0.11],
          markers: cobeMarkers,
          arcs: cobeArcs,
          onRender: (state) => {
            state.phi = currentPhi;
            currentPhi += 0.003;
            phiRef.current = currentPhi;
          },
        });
        setGlobeReady(true);
      } catch (err) {
        console.warn("Globe init failed:", err);
      }
    };

    // Delay init to let DOM settle
    const timer = setTimeout(initGlobe, 150);

    return () => {
      destroyed = true;
      clearTimeout(timer);
      if (globeInstance) { try { globeInstance.destroy(); } catch {} }
    };
  }, []);

  return (
    <div className="globe-reach">
      {!globeReady && (
        <div className="sk-globe-wrap" style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <div className="sk-globe">
            <div className="sk" style={{ width: "100%", paddingBottom: "100%", borderRadius: "50%" }} />
            <div className="sk-globe-pulse" />
          </div>
          <div className="sk-globe-legend">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="sk-globe-legend-item">
                <span className="sk" style={{ width: 10, height: 10, borderRadius: "50%" }} />
                <div className="sk-globe-legend-text">
                  <span className="sk" style={{ width: 120, height: 14 }} />
                  <span className="sk" style={{ width: 160, height: 11 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div
        className="globe-canvas-wrap"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ cursor: tooltip?.slug ? "pointer" : "default" }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
        <div className="globe-glow" />
        {tooltip && (
          <div
            className="globe-tooltip"
            style={{
              left: `${Math.min(tooltip.screenX - containerRef.current.getBoundingClientRect().left, containerRef.current.clientWidth - 210)}px`,
              top: `${tooltip.screenY - containerRef.current.getBoundingClientRect().top - 90}px`,
            }}
          >
            <div className="globe-tooltip-header">
              <span className="globe-tooltip-dot" style={{ background: ROLE_COLORS[tooltip.role] }} />
              <span className="globe-tooltip-city">{tooltip.name}</span>
            </div>
            {tooltip.country && <div className="globe-tooltip-country">{tooltip.country}</div>}
            {tooltip.note && <div className="globe-tooltip-note">{tooltip.note}</div>}
            <div className="globe-tooltip-role">
              {ROLE_LABELS[tooltip.role] || tooltip.role}
              {tooltip.slug && <span className="globe-tooltip-cta"> · Click to view</span>}
            </div>
          </div>
        )}
      </div>
      <div className="globe-legend">
        {LOCATIONS.map((loc) => (
          <div
            key={loc.name}
            className={`globe-legend-item ${loc.role} ${highlighted === loc.name ? "is-highlighted" : ""}`}
            onMouseEnter={() => setHighlighted(loc.name)}
            onMouseLeave={() => setHighlighted(null)}
          >
            <span className="globe-legend-dot" style={{
              background: loc.role === "hq" ? "var(--copper-bright)" : loc.role === "hub" ? "var(--brass)" : "var(--muted)",
            }} />
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
