# Progress Log

Newest first. One entry per work session: what was done, verified, and what's
next. **Update this at the end of every session** — it's the cheapest way for
any agent (or human) to resume without re-reading the codebase.

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
