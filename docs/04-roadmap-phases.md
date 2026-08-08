# MELGARA — Build Roadmap (Phased)

## Phase 1 — Research & Assets ✅ DONE
- [x] Crawl melgara.com (Home, Products, About, Contact, Iron Ore)
- [x] Extract logo (public/logo.jpeg), 4 spec PDFs (public/specs/), social links, full product data
- [x] Compile research dossier → docs/00-research-dossier.md

## Phase 2 — Strategy Docs ✅ DONE
- [x] Vision & Creative Brief → docs/01-vision-brief.md
- [x] Design Specification → docs/02-design-spec.md
- [x] Site Architecture → docs/03-site-architecture.md
- [x] Roadmap → docs/04-roadmap-phases.md

## Phase 3 — Scaffold ✅ DONE
- [x] Vite + React + React Router + Three/R3F + Lenis
- [x] Design tokens (CSS variables), global styles, fonts
- [x] Data layer (products, analyses, contacts)

## Phase 4 — Global System ✅ DONE
- [x] Navbar with logo + dropdown + mobile menu
- [x] Footer with contact + "Developed by Kidus Sofonias" credit
- [x] Overlays (progress bar, grain) + route transitions
- [x] 404 page

## Phase 5 — Home (The Vault) ✅ DONE
- [x] Procedural 3D copper ore hero w/ scroll-driven rotation + inertia
- [x] Live stats bar, ore previews, teasers, industries strip, final CTA

## Phase 6 — Ores ✅ DONE
- [x] Ore Explorer hub with filters
- [x] Copper, Manganese, Chrome, Iron & Metals, Non-Metallic detail pages
- [x] Chemical analysis tables (real data) + spec PDF downloads

## Phase 7 — Company Pages ✅ DONE
- [x] Who We Are (timeline, story)
- [x] Global Reach (animated map)
- [x] Transparency (documentation process, spec library)
- [x] Contact / Request a Quote (smart form)

## Phase 8 — Validation ✅ DONE
- [x] Build + lint/typecheck
- [x] Code review
- [x] Browser test

## Phase 9 — Polish & i18n ✅ DONE
- [x] Photorealistic 3D ores (ridged-noise geometry, vertex-colored veins, procedural studio lighting, bump maps — no CDN assets)
- [x] Full Amharic translation (EN · አማርኛ toggle, persisted, Noto Sans Ethiopic)
- [x] Responsive overhaul for all devices (fluid grids, mobile hero scrim, portrait 3D framing, touch-friendly nav)
- [x] Quote form sends all details to sofoniaskidus@gmail.com (mailto, no backend)

## Phase 10 — Replica & Delivery ✅ DONE
- [x] Real ore specimen photos (Wikimedia Commons) bundled at public/ores/, applied to the 3D rock via triplanar mapping → photoreal "replica" on good connections
- [x] Connection-aware fallback: slow networks / failed loads get the brighter procedural ore
- [x] Lighting pass — hero ores are now bright and well-lit
- [x] Reliable no-backend form: FormSubmit.co POST → sofoniaskidus@gmail.com, with mailto-anchor + copy-message fallbacks
- [x] Responsive refinements (nav overflow, hero spacing, scrim layering, fluid card canvases)

## Post-launch ideas
- Photorealistic ore scans (photogrammetry) upgrade, or client's own ore photos
- Real analytics + CRM integration for quote form
- Full backend/email service if FormSubmit limits are hit
