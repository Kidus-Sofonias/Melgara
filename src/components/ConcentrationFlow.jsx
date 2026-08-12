import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------
   ConcentrationFlow — a fixed, page-wide CANVAS background.

   Painted on ONE <canvas> layer per frame (no per-frame DOM repaints,
   so it stays smooth and flicker-free even with the frosted navbar).

   - A banded mineral wash flows slowly downward like water, tiled so
     it loops seamlessly forever.
   - Soft colour cells ("concentration") rain down very slowly.
   - A steel tint pools toward the bottom of the viewport as the user
     scrolls deeper into the page.
   - A vignette frame concentrates colour around the edges of the
     viewport and deepens subtly with scroll progress.
   A smoothed scroll-linked offset makes the whole flow glide with the
   page content instead of snapping.

   Honors prefers-reduced-motion: scroll-linked only, no animation.
   ------------------------------------------------------------------ */

/* Dissolved-mineral colour cells. `size` is a fraction of viewport
   width, `speed` in vh per second — very slow, laminar flow.
   Colours are darkened ~13% for a deeper, duskier palette. */
const BLOBS = [
  { color: [168, 75, 27], x: 0.14, size: 0.56, speed: 0.8, phase: 0.0, sway: 26, swaySpeed: 0.05, alpha: 0.24 }, // copper
  { color: [190, 144, 38], x: 0.84, size: 0.42, speed: 0.65, phase: 0.55, sway: 38, swaySpeed: 0.04, alpha: 0.18 }, // brass
  { color: [12, 112, 100], x: 0.56, size: 0.6, speed: 1.0, phase: 0.28, sway: 50, swaySpeed: 0.03, alpha: 0.21 }, // steel
  { color: [121, 52, 12], x: 0.3, size: 0.32, speed: 0.55, phase: 0.8, sway: 20, swaySpeed: 0.06, alpha: 0.15 }, // copper-dim
];

/* Banded wash profile — top and bottom edges are both fully
   transparent, so the vertical tiling wraps without a seam. */
const WASH_STOPS = [
  [0.0, 168, 75, 27, 0],
  [0.07, 168, 75, 27, 0.17],
  [0.16, 190, 144, 38, 0.14],
  [0.26, 12, 112, 100, 0],
  [0.36, 12, 112, 100, 0.17],
  [0.5, 23, 30, 36, 0.02],
  [0.64, 168, 75, 27, 0.17],
  [0.73, 190, 144, 38, 0.14],
  [0.83, 12, 112, 100, 0],
  [0.93, 12, 112, 100, 0.17],
  [1.0, 23, 30, 36, 0.01],
];

const TAU = Math.PI * 2;

function ConcentrationFlow() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let wash = null;
    let shift = 0; // smoothed scroll-linked offset

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const period = Math.max(h * 1.8, w * 0.9);
      const g = ctx.createLinearGradient(0, 0, 0, period);
      for (const [t, r, gr, b, a] of WASH_STOPS) {
        g.addColorStop(t, `rgba(${r}, ${gr}, ${b}, ${a})`);
      }
      wash = { period, g };
    };

    const draw = (elapsed, dt) => {
      if (!wash) return;

      const t = reduceMotion ? 0 : elapsed;
      const scroll = window.scrollY || document.documentElement.scrollTop || 0;
      const max = document.documentElement.scrollHeight - h;
      const progress = max > 0 ? Math.min(1, Math.max(0, scroll / max)) : 0;

      /* Smoothed scroll-linked shift: the whole flow glides with the
         page as the user scrolls (a gentle parallax). Lerped with a
         frame-rate-independent factor so even instant scroll inputs
         (scrollbar drag, keyboard jumps, BackToTop) ease in smoothly
         instead of snapping. */
      const k = reduceMotion ? 1 : Math.min(1, dt * 8);
      shift += (scroll * 0.22 - shift) * k;
      const scrollShift = shift;

      ctx.clearRect(0, 0, w, h);

      // 1) Banded wash — tiled and flowing slowly downward, shifted by scroll.
      const washY = (t * h * 0.003 + scrollShift) % wash.period;
      ctx.save();
      ctx.translate(0, -washY);
      ctx.fillStyle = wash.g;
      for (let y = -wash.period; y <= h + wash.period; y += wash.period) {
        ctx.fillRect(0, y, w, wash.period);
      }
      ctx.restore();

      // 2) Colour cells raining down, sliding with the page.
      for (const b of BLOBS) {
        const d = b.size * w;
        const span = h + d;
        const y = (((scrollShift * 1.4 + t * b.speed * h) % span) + span) % span - d / 2;
        const x = b.x * w + Math.sin(t * b.swaySpeed + b.phase * TAU) * b.sway;
        const r = (d / 2) * (1 + 0.04 * Math.sin(t * 0.4 + b.phase * TAU));
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, ${b.alpha})`);
        g.addColorStop(0.55, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, ${b.alpha * 0.45})`);
        g.addColorStop(1, `rgba(${b.color[0]}, ${b.color[1]}, ${b.color[2]}, 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }

      // 3) Steel tint pooling toward the bottom as you scroll deeper.
      if (progress > 0.001) {
        const tg = ctx.createRadialGradient(w / 2, h * 1.25, 0, w / 2, h * 1.25, h * 1.15);
        const a = progress * 0.85;
        tg.addColorStop(0, `rgba(12, 112, 100, ${0.2 * a})`);
        tg.addColorStop(0.55, `rgba(23, 30, 36, ${0.07 * a})`);
        tg.addColorStop(1, "rgba(23, 30, 36, 0)");
        ctx.fillStyle = tg;
        ctx.fillRect(0, 0, w, h);
      }

      // 4) Vignette frame — concentration gathers at the edges of the
      // viewport, deepening gently as the page is scrolled.
      const vk = Math.min(1.2, 0.9 + 0.45 * progress);
      const breathe = 1 + 0.04 * Math.sin(t * 0.06);
      const vg = ctx.createRadialGradient(
        w / 2,
        h / 2,
        Math.min(w, h) * 0.34,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.74
      );
      vg.addColorStop(0, "rgba(23, 30, 36, 0)");
      vg.addColorStop(0.55, `rgba(12, 112, 100, ${0.07 * vk * breathe})`);
      vg.addColorStop(0.82, `rgba(121, 52, 12, ${0.12 * vk * breathe})`);
      vg.addColorStop(1, `rgba(23, 30, 36, ${0.2 * vk * breathe})`);
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      const redraw = () => draw(0, 0);
      window.addEventListener("scroll", redraw, { passive: true });
      redraw();
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", redraw);
      };
    }

    /* Accumulate clamped delta-time (long pauses must not make the
       flow jump) and paint once per frame on the single canvas. */
    let raf = 0;
    let elapsed = 0;
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      elapsed += dt;
      draw(elapsed, dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="flow-bg" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}

export default ConcentrationFlow;
