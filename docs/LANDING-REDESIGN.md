# Landing Page Redesign — Design Brief

**Status:** chapter map implemented (2026-09-26) — pending visual pass
**Scope:** `ui/app/page.tsx` (+ minor `layout.tsx` font links, `globals.css`)

## Problem

The old landing followed the default SaaS formula: hero + stats bar + 4
feature cards + field-app video + debut video + awards + roadmap timeline +
team circles. Generic patterns (glassmorphism cards, glow borders, gradient
blobs, fade-in-every-block) make it read as "template UI" regardless of polish.
No narrative — nothing the visitor can *follow*.

## Core idea

**One can, one journey.** TORO-01 is a real, on-chain trace with a beginning
(catch off Bình Định), middle (factory), and end (shipment). The can is the
protagonist; the blockchain is the plot device, not the headline.

## Chapter map

| # | Chapter | Content | Data source |
|---|---------|---------|-------------|
| 0 | **The Can** | Full-screen hero: 3D can, one story line ("Every can remembers the ocean"), scroll cue. Can drifts/rotates subtly as you scroll away. | — |
| 1 | **The Catch** | Real source data: Yellowfin, Longline, Bình Định, Pacific Ocean, 800 kg, HACCP. Editorial spec-sheet rows + ocean visual. | `traceIndex.json` → TORO-01 batch stage 1 |
| 2 | **The Factory** | 1,950 kg in → 3,900 cans out; facility footage (kept). | batch stages 2–3 |
| 3 | **The Proof** | Cold storage 2 °C, warehouse, shipment — then the reveal: every step is a signed tx on Solana. Show real tx hash / recorder key / Solscan link in mono. | lot stages 4–5 |
| 4 | **Your Turn** | "Scan it yourself." QR of the trace URL + CTA to `/trace/TORO-01`. | generated client-side |
| 5 | **Epilogue** | Compressed: partners marquee, awards (3 items), team (4 avatars), roadmap link, footer as usual. | static |

Post-brief addition: **Expansion** chapter (between Voyage and Epilogue),
`ui/components/ExpansionMap.tsx` — react-simple-maps dark nautical map, Quy
Nhơn home port with dotted lanes to Busan, Tokyo, Rotterdam; pilot-partner
call to action.

## Design principles

- **Editorial, not component-library.** Big display serif (Fraunces) for
  headlines; monospace (JetBrains Mono) for on-chain data as texture; dotted
  spec-sheet rows instead of cards.
- **Real data only.** Every number on the page comes from `traceIndex.json`
  (TORO-01) so re-indexing after a re-seed never makes the story false.
- **Scroll-driven motion** (framer-motion `useScroll`) over per-block
  `whileInView` fades. The page should feel like a descent through water.
- **Restraint.** No stats bar, no feature-card grid, no glassmorphism. One
  material metaphor: ocean depth.
- Vietnamese locale (`lang="vi"`) stays; dates render `vi-VN` like the rest
  of the app.

## Removed from the old page

- Stats bar (fold key facts into chapters)
- "Why Toro" 4-card grid
- Full DEBUT/achievements/timeline/team sections → compressed epilogue
- Old SVG annotation overlay on the can hover (replaced by minimal hero)

## Implementation checklist

All items implemented 2026-09-26; pending a visual pass in `npm run dev`.

- [x] `layout.tsx`: Google Fonts links (Fraunces, JetBrains Mono)
- [x] `globals.css`: font-family vars / utility classes
- [x] `page.tsx` chapters 0–5 wired to TORO-01 data
- [x] Hero scroll-away parallax on the can
- [x] Ocean chapter visual (depth gradient + light rays)
- [x] Proof chapter: tx hashes + Solscan links
- [x] Your Turn: QR (qrcode lib, already a dep)
- [x] Epilogue: partners + awards + team
- [x] `npm run build` green; real-data render verified in exported HTML

## Future ideas (not in scope now)

- Pinned can that follows the scroll through all chapters (sticky + chapter
  transforms)
- Sound design (subtle ocean ambience)
- GSAP ScrollTrigger-level choreography
- Horizontal-scroll factory chapter with facility photography
