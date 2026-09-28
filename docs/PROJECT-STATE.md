# Project State — as of 2026-09-26

## Vision

TORO tells the true story of a seafood product: catch → cold storage → factory →
warehouse → shipment, every step signed on-chain. Two audiences:
- **Consumers/exporters** scan a QR on a can and see the verified journey.
- **Factories** use a mobile app to record stages by scanning (no blockchain UX).

## Architecture (how the pieces fit)

```
Factory field app (future) / seed script (now)
        │  signed txs
        ▼
Solana devnet — toro program (2cbYretd...4FWc)
        │  events only (BatchMinted, TraceRecorded, LotCreated)
        ▼
ui/scripts/indexer-solana.ts  (crawls logs, decodes abi payloads)
        │
        ▼
ui/src/data/traceIndex.json   (static snapshot — the UI's ONLY data source)
        │
        ▼
Next.js UI: /trace/[id] detail pages, /trustgraph, landing page
```

- **Two-level lifecycle:** Batches (raw material, stages 1→2→3) are merged into
  Lots (finished product, stages 3→4→5) via `create_product_lot` (1–16 inputs,
  all must be at Manufacturing). See `contracts/solana/docs/toro-program.md`.
- **Access control:** authority (super-user) > factory signers (mint/create
  lots) > stations (record stage transitions). Roles are existence-marker PDAs.

## What works today

- ✅ Anchor program deployed on devnet, seeded with TORO-01..TORO-05 demo lots
  (via `yarn seed`, idempotent/resumable).
- ✅ 14 mocha tests pass locally (`anchor test`).
- ✅ Indexer rebuilds `traceIndex.json` from devnet; UI trace pages render
  per-stage detail + Solscan links.
- ✅ Landing page (being redesigned — see LANDING-REDESIGN.md), trust graph
  simulator, 3D can hero.

## Known gaps / tech debt

- **No backend API.** UI reads a static JSON snapshot. A live indexer service
  is future work (noted in `src/lib/trace.ts`). Devnet RPC 429s mean the
  indexer script is slow; it has backoff but crawls every tx one by one.
- **Upgrade authority is the deployer's local wallet** — explicitly "mock only";
  needs multisig/mainnet planning before real use.
- **Program allows authority to bypass roles** (mirrors EVM design) — fine for
  demo, revisit for production.
- **Hardcoded bits:** Can3D QR points at
  `https://toro-dapp.vercel.app/trace/TORO-01`; landing page pulls TORO-01 as
  the story lot.
- **Old EVM origins** still visible: abi-encoded payloads, CODE_REGISTRY, seed
  script mirrors Solidity scripts. Keep EVM parity unless deliberately breaking.
- `ui/dist/` contains stale build artifacts; real build output dir is configured
  in `next.config.ts` (check before cleaning anything).

## Content/design direction

Landing page is being converted from a generic SaaS template into a
**scroll-driven story of one can (TORO-01)**. Principles and chapter map:
see `docs/LANDING-REDESIGN.md`. Avoid: feature-card grids, stats bars,
glassmorphism, per-block fade-ins. Prefer: editorial type (Fraunces + mono),
real trace data, scroll-driven motion, restraint.

## Team / external

- Team: Tron (chain), Chow (BA), Hoang (graph), Duy (web app).
- Partners: BK START, IEC, NExus, SPT, Superteam (logos in `ui/public/partner/`).
- Achievements: Top 5 @ THE NEXGEN 2026, Bronze @ Design & Fabrication 2026,
  2nd Runner Up @ SuperteamVN "Bring Your Web2 Ideas Onchain" bounty.
