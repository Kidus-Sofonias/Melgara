# MELGARA — Mining & Manufacturing

Company website for **Melgara Mining and Manufacturing PLC** — mining,
trading and exporting mineral metallic and non-metallic ores (copper,
chrome, manganese, iron, quartz, tantalum and more) from the Horn of
Africa to the world's foundries.

Built with **React 18 + Vite**, **three.js / @react-three/fiber** for the
3D globe and ore scenes, bilingual **English / Amharic**, and a
self-hosted font + image stack (zero third-party network requests).

---

## Quick start

```bash
npm install
npm run dev      # local dev server (http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # preview the production build
```

---

## Tech stack

| Area        | Choice                                                        |
| ----------- | ------------------------------------------------------------- |
| Framework   | React 18 + Vite 5 (ESM, `@vitejs/plugin-react`)               |
| Routing     | `react-router-dom` v6 (lazy route-level code splitting)       |
| 3D / WebGL  | `three` + `@react-three/fiber` + `@react-three/drei`          |
| Carousel    | `embla-carousel-react` + autoplay plugin                      |
| Smoothness  | `lenis` (smooth scrolling, wired to `window.__lenis`)         |
| Fonts       | Self-hosted `@font-face` (Space Grotesk, Inter, Noto Sans Ethiopic) |
| Styling     | Plain CSS design system in `src/styles/global.css`            |

---

## Project structure

```
melgara/
├── index.html                 # entry HTML, favicon (logo.png), theme-color
├── package.json               # scripts + dependencies
├── vite.config.js             # Vite + React plugin config
├── docs/                      # research, design spec, roadmap, image credits
├── scripts/
│   ├── fetch-fonts.mjs        # download self-hosted web fonts
│   └── fetch-hero-photos.mjs  # download free-license mining hero photos
├── public/                    # static assets (served at /)
│   ├── logo.png               # brand logo (navbar, footer, favicon)
│   ├── fonts/                 # self-hosted woff2 font subsets
│   ├── images/                # hero photography
│   ├── ores/                  # real ore specimen photos (copper.jpg, …)
│   ├── textures/              # equirectangular earth map for the globe
│   ├── specs/                 # product spec-sheet PDFs
│   └── models/ores/           # optional GLB models (not currently used)
└── src/
    ├── main.jsx               # React root + Router + LanguageProvider
    ├── App.jsx                # layout: progress, grain, BackToTop, navbar,
    │                          #   lazy routes with Suspense, footer
    ├── components/
    │   ├── Navbar.jsx         # fixed frosted navbar + dropdown + mobile menu
    │   ├── Footer.jsx         # compact single-bar footer
    │   ├── BackToTop.jsx      # floating back-to-top button (Lenis-aware)
    │   ├── ScrollProgress.jsx # top reading-progress bar
    │   ├── GrainOverlay.jsx   # subtle film grain overlay
    │   ├── PageTransition.jsx # route enter/exit animation wrapper
    │   ├── PageLoader.jsx     # branded Suspense fallback loader
    │   ├── Reveal.jsx         # scroll-into-view reveal wrapper
    │   ├── GlobeReach.jsx     # 3D globe (real earth, city labels, arcs,
    │   │                      #   markers, tooltip, click-to-focus)
    │   ├── MiniOreField.jsx   # instanced drifting ore crystals (hero)
    │   ├── OreCanvas3D.jsx    # procedural 3D ore renderer (fallback)
    │   ├── OreCarousel.jsx    # embla ore carousel with photos + progress
    │   ├── OreImage.jsx       # framed ore-specimen photo tile
    │   ├── IndustryStrip.jsx  # compact interactive chip scroller
    │   ├── GradeCounter.jsx   # animated number counter
    │   └── Skeleton.jsx/.css  # loading skeletons
    ├── pages/                 # one file per route
    │   ├── Home.jsx           # hero, stats, ores, about, industries, globe
    │   ├── Ores.jsx           # catalog with metallic/non-metallic filters
    │   ├── OreDetail.jsx      # hero photo, grades, spec tables, applications
    │   ├── About.jsx          # story, pillars, values, timeline
    │   ├── GlobalReach.jsx    # full globe + footprint + logistics
    │   ├── Transparency.jsx   # quality control + spec library
    │   ├── Contact.jsx        # quote-request form (mailto flow)
    │   └── NotFound.jsx       # 404
    ├── data/ores.js           # ALL company/product content (single source)
    ├── i18n/translations.js   # EN + Amharic UI strings
    ├── context/LanguageContext.jsx  # lang state, t(), pick()
    └── styles/
        ├── global.css         # design system + all component styles
        └── fonts.css          # @font-face declarations
```

---

## Key features

- **Photo hero** — open-pit mining photography under a dark readability
  scrim with drifting copper crystals (`MiniOreField`).
- **Ore catalog** — Embla carousel of **real ore specimen photos**
  (`public/ores/*.jpg`) with grade, blurb, progress bar, dots and arrow
  controls; filterable by metallic / non-metallic.
- **Ore detail** — full-width specimen photo hero, available grades,
  chemical-analysis spec tables, interactive "what it powers" chip
  scroller.
- **3D globe** (`GlobeReach`) — real equirectangular earth texture
  (`public/textures/earth-day.jpg`, self-hosted) with procedural
  fallback, atmosphere glow, trade arcs, role-scaled markers with
  **city-name labels**, hover tooltips, click-to-focus zoom and
  reset-on-click. Used on Home and `/global-reach`. Fully responsive
  via `aspect-ratio`.
- **Industries strip** — long lists ("the companies behind the
  companies") collapse into one swipeable chip row with arrows.
- **Compact footer + BackToTop** — the footer is a single bar; a
  floating copper button returns to the top after scrolling.
- **Bilingual EN / አማርኛ** — switch from the navbar; all UI strings live
  in `src/i18n/translations.js`, Amharic typography rules included.
- **Route-level code splitting** — each page is its own lazy chunk
  (`App.jsx`), so the entry bundle stays small and the `three` chunk
  loads only when a 3D page is visited.

---

## Design system

The **"Daylight Copper"** theme lives entirely in `src/styles/global.css`
CSS variables:

| Token            | Hex       |
| ---------------- | --------- |
| `--bg` (ivory)   | `#F7F4EE` |
| `--bg-2`         | `#EFEAE1` |
| `--surface`      | `#FFFFFF` |
| `--copper`       | `#C0561F` |
| `--copper-bright`| `#D9772B` |
| `--brass`        | `#B98A1E` |
| `--steel`        | `#0E8073` |
| `--text`         | `#1A1E22` |

Photo-backed heroes automatically switch to white text + dark scrim via
`.hero:has(.hero-photo)`.

---

## Content & data

All business content (company info, team, ores with chemical analyses,
stats, timeline, process, values, countries, industries) is defined once
in **`src/data/ores.js`**. Localization variants for Amharic live next to
each field (`am: {...}`) or in sibling `*_AM` arrays.

## Scripts

```bash
node scripts/fetch-fonts.mjs        # re-download self-hosted fonts
node scripts/fetch-hero-photos.mjs  # re-scrape free-license hero photos
```

## Deployment

`npm run build` outputs a static site in `dist/` — deployable to any
static host (Netlify, Vercel, GitHub Pages, etc.). Configure SPA
fallback (`/* → /index.html`) on the host.

## Docs

`docs/` contains the original research dossier, vision brief, design
spec, site architecture, roadmap and image credits.
