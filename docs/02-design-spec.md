# MELGARA — Design Specification v1.0

## Design World: Dark Premium Industrial

| Token | Value |
|---|---|
| Background | `#0C0B0A` (near-black) |
| Surface | `#16130F` |
| Panel | `#1F1A14` |
| Copper accent | `#C8793E` → `#B87333` |
| Brass/gold | `#C9A227` |
| Text | `#F2EDE4` |
| Muted text | `#9A9184` |
| Font (display) | Space Grotesk / Archivo (industrial grotesque) |
| Font (body) | Inter |

## The Vault — Hero Concept (locked)

A colossal procedural copper ore rests on a black plinth in darkness. One cinematic light source rakes across its jagged surface, glinting off copper veins. Scroll = full revolution per page-length; pause = heavy dampened inertia auto-spin. Behind: topographic contour map of the Horn of Africa in parallax. Floating mineral dust catches the light.

## Per-Page 3D Specimens

| Page | Specimen | Character |
|---|---|---|
| Home | Copper ore | Metallic copper, teal oxidation patches, high metalness |
| Copper | Copper variants | Oxide (green) + sulfide (bronze) |
| Manganese | Manganese mass | Dark, matte, near-black grey veins |
| Chrome | Chrome ore | Silver-grey, bright specular |
| About | Core sample slab | Cut cylinder, strata layers |
| Contact | Crystal cluster | Small, subtle |

## Animation Bible

| Zone | Effect | Trigger |
|---|---|---|
| Global | Lenis smooth scroll (weighted, inertial) | Always |
| Global | Copper progress bar | Scroll |
| Global | Route transitions — fade + copper sweep | Page change |
| Global | Film grain overlay | Always |
| Hero | Ore revolves w/ scroll + inertia + dust | Scroll / idle |
| Buttons | Magnetic hover + copper glow | Cursor |
| Numbers | Grade counters count up | Into view |
| Headlines | SplitText letter/line reveals | Into view |
| Map | Shipping routes draw themselves (SVG) | Into view |
| Section breaks | Light beam sweeps | Scroll |
| Data panels | Scanline shimmer | Always |
| Product cards | Mini 3D previews rotate | Hover |

## Tech Stack

```
React 18 + Vite
React Router DOM 6
React Three Fiber + @react-three/drei + Three.js
GSAP (ScrollTrigger) + Lenis smooth scroll
Procedural ore: noise-displaced icosahedron, unique seed per ore
meshPhysicalMaterial + HDRI environment
```

## Performance Contract

- Canvas `dpr [1,2]` capped; lazy-mount near viewport
- `prefers-reduced-motion` → static renders, no auto-spin
- Mobile: post-processing off, lower geometry; WebGL-fail → static fallback
- Procedural = zero asset downloads

## Site Architecture (routes)

```
/                  → Home (The Vault)
/ores              → Ore Explorer hub
/ores/copper       → Copper detail
/ores/manganese    → Manganese detail
/ores/chrome       → Chrome detail
/ores/iron-metals  → Iron & Metals detail
/ores/non-metallic → Non-Metallic Minerals detail
/about             → Who We Are
/global-reach      → Global Reach
/transparency      → Transparency
/contact           → Contact / Request a Quote
*                  → 404
```
