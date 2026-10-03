# Progress Log

Newest first. One entry per work session: what was done, verified, and what's
next. **Update this at the end of every session** — it's the cheapest way for
any agent (or human) to resume without re-reading the codebase.

## 2026-09-30 — Unverified-product warning for unknown lots (session 7)

**Done:** visiting `/explorer/TORO-xyz` (or any code missing from
`traceIndex.json`) now renders a caution page instead of the bare
"Product not found": amber warning card with the scanned code, what-to-do
steps (don't trust it as TORO, check with local distributor/retailer,
report tampering), plus a "TORO only vouches for verifiable on-chain
journeys" disclaimer. EN + VI strings in `src/locales/trace.ts`
(`detail.unverified`); phone-sheet layout matches the verified passport.
Buttons: Back to Explorer, Try demo lot TORO-01.

**Fix 2 — dropped `output: "export"` from `ui/next.config.ts`:** static
export can only render the 5 IDs in `generateStaticParams()`, so unknown
scans threw `missing param ... in generateStaticParams()` before ever
reaching the warning. Without it, known lots still pre-render (SSG) and
unknown codes render on demand (`dynamicParams = true` on `[id]/page`).
`distDir: "dist"` kept. Vercel serves this hybrid mode natively.

**Restyle (session 8):** first version looked like generic SaaS (centered
pastel badge, amber box, numbered pills, stacked buttons). Rebuilt in the
landing's voice: dark deep-ocean sheet, ghost ∅ numeral, gold mono kicker
(`Unverified scan · No on-chain record`), Fraunces light headline, mono
ledger rows (scanned code / ○ no record), ghost-numeral step rows, quiet
growing-underline CTAs. No boxes, no badges. New locale keys
`statusLabel` / `noRecord` (en+vi).

**Balance pass (session 8):** page read too dark-blue, so the ledger block
became one crisp white slip (scanned code + ○ no-record in deep navy on
white, ghost ∅ watermark) with a rotated outlined red `UNVERIFIED` /
`Chưa xác thực` void stamp (`voidStamp` key, en+vi). Everything else stays
dark editorial. Later: dropped the `Try demo lot TORO-01` CTA (and its
locale keys); only `Back to Explorer` remains.

**Verified:** `npx tsc --noEmit` clean; `npm run build` green;
`next start` serves both `/explorer/TORO-01` and `/explorer/TORO-xyz`
with HTTP 200, warning strings present in the client chunk, zero
missing-param errors in the server log.

## 2026-09-30 — Re-applied broken hero 3D can fix (session 6)

**Found:** session 5's fix never landed in the working tree —
`ui/components/Can3D.tsx` still had `<Environment preset="city" />` plus the
stale `/trace/TORO-01` QR URL.

**Fix (`ui/components/Can3D.tsx`):**
- Replaced CDN HDR preset with procedural `<Environment resolution={256}>` +
  `<Lightformer>` studio rig (ocean/gold). Zero network requests.
- Wrapped scene in `<Suspense fallback={null}>`.
- Added WebGL-unavailable detection → static `tuna_on_can.png` fallback.
- Fixed QR URL to `/explorer/TORO-01`. Lightformer `scale` uses 3-tuples
  (`[4,2,1]`) to satisfy R3F types.

**Verified:** `npx tsc --noEmit` clean; `npm run build` green (11 pages).

## 2026-09-30 — Fixed broken hero 3D can (session 5)

**Root cause:** `Can3D` used drei's `<Environment preset="city" />`, which
fetches `city.hdr` from `raw.githack.com` at runtime. That CDN now returns
**HTTP 403**, so the env-map suspense rejects and the whole canvas tree
breaks (white dead area in the hero). Nothing to do with the dynamic import
from session 4 — the chunk split is fine.

**Fix (`ui/components/Can3D.tsx`):**
- Replaced the CDN HDR preset with procedural `<Environment resolution>`
  + `<Lightformer>` studio rig in TORO's ocean/gold palette. Zero network
  requests, same metallic reflections.
- Wrapped the scene in `<Suspense fallback={null}>` so any future async
  asset failure can't hang the canvas again.
- Added WebGL-unavailable detection: headless browsers / disabled GPUs now
  get a static `tuna_on_can.png` render instead of a dead canvas.

**Verified:**
- `npx tsc --noEmit` clean; `npm run build` green.
- three.js ships in its own split chunk; the `githack` URL survives only as
  dead bundled string in drei (never called).

## 2026-09-30 — Landing enhancement pass (session 4)

**Done (all 7 review items):**
1. Hero dual CTA: quiet gold "Trace this can →" link next to "Read its
   story" (kept the no-buttons minimalism). New `landing.hero.traceCta`
   key (en+vi).
2. Metadata: OG + Twitter cards (`tuna_on_can.png`), sharper description,
   `metadataBase`, `alternateLocale: vi_VN`.
3. Chapter numbering: Voyage → "Chapter 05", Expansion → "Chapter 06"
   (Your Turn already claimed 04; Epilogue stays unnumbered).
4. Perf: new `LazySection` (IntersectionObserver) + `next/dynamic` for
   `Can3D` (ssr:false, async) and `ExpansionMap` (loads only when scrolled
   near). `/` dropped **313 kB → 17.6 kB page, 478 kB → 184 kB first load**.
5. Voyage mobile/Safari: "YOU ARE HERE" tag now shows on mobile; ship only
   renders where `CSS.supports("offset-path", path(...))` (older iOS Safari
   gets beam + ports + tag, no stranded ship); phase cards are a snap-scroll
   row on phones, 5-col grid on desktop.
6. Reduced motion: global CSS kill-switch for ambient loops
   (marquee/map/ping/pulse/spin) + `useReducedMotion` guard on hero
   parallax (content stays put).

**Verified:**
- `npx tsc --noEmit` clean; `npm run build` green.
- `dist/index.html` contains "Trace this can", Chapters 05/06, OG +
  Twitter meta.

**Next:**
- [ ] Real-device check: ship animation on iOS Safari, hero CTA tap targets
- [ ] Link-unfurl preview check (OG image 1053×496, slightly off 1.91:1)
- [ ] Consider compressing 1.5 MB `Dark_bg.png` hero background

## 2026-09-30 — Route rename /trace → /explorer + themed explorer (session 3)

**Done:**
- Hard-renamed `ui/app/trace/` → `ui/app/explorer/` (user chose no redirect
  shim; old printed `/trace/...` QRs will 404). Updated every reference:
  Navbar links + detail-hide rule, Footer link, FooterWrapper trace-footer
  rule, detail back-link, landing `TRACE_URL` + story CTA, Can3D QR texture
  URL, search-page push. Also wired the previously missed `t.nav.home`.
- Explorer search is no longer a generic tool page: chapter-style kicker +
  Fraunces display headline (same language as the landing), plus demo-lot
  chips (TORO-01..05 from `traceIndex.json`). New dict keys
  `trace.search.kicker` / `demoLabel` (en+vi).
- Detail passport now renders as a glowing phone sheet (`rounded-[32px]` +
  ocean glow + border) on a dark ambient backdrop on tablet/desktop, while
  staying fullscreen on phones for the QR-scan flow.
- Docs: AGENTS.md route map, PROJECT-STATE, LANDING-REDESIGN updated.
- Housekeeping: deleted stale `ui/dist/` + `ui/.next/` caches (both
  gitignored) after the rename left ghost `dist/types/app/trace/*` refs
  that broke `tsc` and the build.

**Verified:**
- `npx tsc --noEmit` clean; `npm run build` green — routes now
  `/explorer`, `/explorer/TORO-01..05`, `/trustgraph`; `dist/explorer.html`
  prerenders English default.

**Next:**
- [ ] Reprint / resticker real cans with `/explorer/...` QRs (old ones 404)
- [ ] Visual pass in `npm run dev`: explorer search + phone-sheet framing,
  VI toggle overflow check
- [ ] Optional: camera QR-scan hero on explorer (needs HTTPS + permission
  UX), on-chain value localization

## 2026-09-30 — EN/VI locale refactor completed (continued from dead agent)

**Done:**
- Resumed the half-finished EN (default) / VI i18n refactor. Infra already
  existed (`ui/src/lib/i18n.tsx` provider + `ui/src/locales/{landing,nav,
  trace,graph,story}.ts`, Navbar toggle, `layout.tsx` wrapped in
  `I18nProvider`, `html lang="en"`).
- Fixed **broken build**: `TraceTreeAnimation.tsx` referenced deleted
  `stages`/`branches` vars (prior agent added `buildStoryData` but never
  wired it). Now resolves locale strings via `useT()` + `useMemo`, effect
  re-runs on locale change; ORIGIN/CONSUMERS/legend translated.
- Finished landing: proof body + spec labels + `PartnerStrip` label now from
  `t.landing` (was hardcoded English).
- Wired trace search page (`t.trace.search`) and `TraceDetailClient`
  (`t.trace.detail`: stages, KPIs, labels, certs, custody, not-found;
  `fmtDate` now follows active locale `vi-VN`/`en-US`).
- Wired trustgraph whitepaper page + `TrustGraphSimulator` (`t.graph`,
  `t.graph.sim`); fixed `en.sim` dict which still contained Vietnamese
  strings; fixed VI typos (`rồi khỏi`→`rời khỏi`, `đốI tác`→`đối tác`,
  `ngườI`→`người`, `thờigian`→`thời gian`).
- Left untranslated (proper nouns / non-user text): port names on
  `ExpansionMap`, chain data (species/dates/tx sigs), `StageCard` +
  `TraceTimeline` (unused dead code), static `metadata` in `layout.tsx`.

**Verified:**
- `npx tsc --noEmit` clean; `npm run build` green (11 pages).
- `dist/index.html` prerenders English default ("Every can", `lang="en"`);
  trace detail pages are client-rendered so locale resolves at runtime via
  localStorage (`toro-locale`).

**Next:**
- [ ] Visual pass in `npm run dev`: toggle VI/EN on every route, check for
  overflow (VI strings run longer, esp. simulator buttons + custody rows)
- [ ] Decide whether on-chain data values (species, regions) stay in source
  language or get mapped per locale
- [ ] Remove or revive dead `TraceTreeAnimation` / `StageCard` /
  `TraceTimeline` components

## 2026-09-26 — Landing page story redesign (session 1, continued)

**Done:**
- Rewrote `ui/app/page.tsx` from the SaaS template into 5 story chapters +
  epilogue, all sourced from `traceIndex.json` lot TORO-01 (see
  `docs/LANDING-REDESIGN.md` for the map):
  0. **The Can** — minimal full-screen hero, scroll-parallax can, no buttons
  1. **The Catch** — real catch manifest (species/method/region/weight/HACCP)
     with light-ray ocean visuals
  2. **The Factory** — in→out kg narrative + spec sheet + kept field-app video
  3. **The Proof** — "5 signatures · 1 can" chain-of-custody receipt with
     shortened tx sigs → Solscan
  4. **Your Turn** — QR of the trace URL + CTA
  5. **Epilogue** — partners marquee, awards, crew, one-breath roadmap
- Added Fraunces (display) + JetBrains Mono (chain data) via Google Fonts
  `<link>` in `layout.tsx`; `.font-display` / `.font-mono-data` utilities in
  `globals.css`.
- Removed: stats bar, "Why Toro" card grid, full debut/achievements/timeline
  sections, old can-annotation SVG overlay.

**Verified:**
- `npx tsc --noEmit` clean; `npm run build` green (static export, 11 pages).
- Prerendered `dist/index.html` contains the real TORO-01 data
  (Bình Định, Yellowfin, Longline, 3,900 cans, chain-of-custody block).

**Next:**
- [ ] Visual pass in `npm run dev` (fonts, spacing, motion on real viewport)
- [ ] Hero copy A/B with the team; possibly a chapter transition polish
- [ ] Optional future: pinned can companion, sound design (see redesign doc)

**Polish (same session):** removed the dotted "spec-sheet" row separators
(user feedback: read as AI-generated). `SpecRow` is now a stacked
label-over-value pair; signature rows are borderless hover links. Build re-verified.

**Copy pass (same session):** removed every prose em-dash per user feedback
("too AI-sounding"). Rewrote affected sentences with commas/colons ("caught off
Bình Định, and every step since…"; "Top 5 Startup, THE NEXGEN 2026"). Empty-data
markers changed "—" → "…"; comment separators → "·". Fixed an unclosed curly
quote in the Catch chapter. Build re-verified.

**Epilogue rework (same session):** partners marquee is now its own full-bleed
strip with edge fade masks (`mask-image` gradient) and a seamless two-copy
loop; removed from the epilogue grid. Roadmap rebuilt as `Voyage`: mission-log
headline ("The voyage so far."), scroll-driven gradient beam (ocean→gold) that
lights 28% of the track and stops at the active phase with a glowing head +
"YOU ARE HERE" tag; phase nodes/cards with ghost numerals and status colors.
Build re-verified.

**Voyage v2 (same session):** straight track replaced with a nautical chart —
hand-drawn-style swirly SVG route (`ROUTE` bezier path) through 5 ports, dotted
planned course + glowing ocean→gold traveled line (scroll-driven `pathLength`),
a little gold ship that sails via CSS `offset-path` with `offset-rotate: auto`,
compass rose + wave decorations, "YOU ARE HERE" at the active port. Ship stop
fraction measured by sampling the path (`getPointAtLength`); route coordinates
rescaled to rendered width so the ship tracks the drawn line at any size.
Status verbs nautified ("Made port / Underway / Next port / Charted"). Build
re-verified.

**Expansion map (same session):** new chapter between Voyage and Epilogue —
`ui/components/ExpansionMap.tsx` (react-simple-maps v5 + d3-geo, React-19
compatible). Dark nautical map framed on Quy Nhơn (gold pulsing home port)
with dotted great-circle lanes flowing to Busan, Tokyo, Rotterdam; mono port
labels; minimal geography fill so nothing feels crowded. Copy frames it as a
pilot-partner call ("built for real supply chains, not demos"); CTA links to
the crew's X (swap href when a proper contact exists). Map data:
world-atlas countries-110m copied to `ui/public/maps/` (bundled with the
static export, no CDN). New CSS: `.map-route-flow` (flowing dots),
`.map-port-ping`. Build + static-serve smoke test verified.

**Expansion map v2 (same session):** switched from zoomed-in mercator to
full-world `geoNaturalEarth1` (whole globe visible like the user's reference),
added ocean `Sphere` + faint `Graticule` grid, map framed as an instrument
panel (header with legend `● home port ● pilot market ┄ demo lane`, footer
caption). Port screen positions verified numerically against the viewBox; Busan
label moved above its node to avoid the arc. Build re-verified.

**Expansion map v3 (same session):** user clarified the reference was for the
global feel only. Removed the instrument-panel chrome (border/header/footer)
so the map blends into the section. Ports are now plain dots with invisible
18px hit areas; name/sub labels fade in on hover as floating text (no tooltip
box, `.map-port-label`). Caption under the map hints "hover a port". Build
re-verified.

**StampButton (same session):** new reusable `ui/components/StampButton.tsx`,
TORO's primary-CTA theme — double-ring border like a passport/custody stamp,
mono uppercase tracking-wide gold type, hand-stamped -1deg tilt that presses
straight + glows on hover. Replaces the generic gold pill on the Expansion
CTA; reuse for any primary action. Build re-verified. User pass: dropped the
glow shadow + trailing arrow, label now "Become a partner". Build re-verified.

**Trace page enhancement (same session):** four agreed upgrades to
`ui/app/trace/[id]/TraceDetailClient.tsx`, keeping the light mobile
product-passport style:
1. **Chain-of-custody receipt** replaces the weak "XÁC THỰC BLOCKCHAIN" shield
   card — dark evidence block at the end: all 5 records (incl. Inventory,
   which the timeline skipped) with shortened tx sigs → Solscan, live
   signature count ("N chữ ký · 1 sản phẩm"), recorder key, program id,
   cluster.
2. **Multi-batch support** — batch chips under the section title; KPIs,
   stage 1/2/3 details, and certs follow the selected batch (was silently
   hardcoded to batches[0]).
3. **Pending states** — missing fields render "Chưa ghi nhận" with a clock
   icon instead of "…" (Detail component + custody rows).
4. **Removed hardcoded distributor card** ("Tokyo Distributor").
Also: Inventory stage added to the timeline (stage 2, batch-level tx link fix:
stages ≤3 resolve from batch trace), share/copy-link button under the QR.
Build re-verified.

**Trace page fixes (same session):** removed "N chữ ký · 1 sản phẩm" counter
from the custody receipt; added "Explorer" nav link → /trace (Navbar, with
active state); `fetchProductLot` is now case-insensitive + trims input. Build
re-verified.

## 2026-09-26 — Codebase audit + project memory (session 1)
