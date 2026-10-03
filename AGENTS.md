# TORO — Agent Orientation

**TORO (Trustless Oceanic Record of Origin)** is a seafood supply-chain
traceability platform. Every tuna can is traced "from ocean to shelf" with
immutable records on **Solana devnet**. Built by a Vietnamese student team
(incubated at VNU-HCM / New Energy Nexus Vietnam). Live demo:
https://toro-dapp.vercel.app

## Repo layout

```
ui/                Next.js 15 (App Router) marketing + traceability site
  app/             Routes: / (landing), /explorer, /explorer/[id], /trustgraph
  components/      Can3D (react-three-fiber), TrustGraphSimulator, TraceTreeAnimation, etc.
  src/lib/trace.ts Types + fetchProductLot() over the static JSON index
  src/data/traceIndex.json  GENERATED FILE — do not hand-edit (see Indexer)
  scripts/indexer-solana.ts Crawls devnet events → regenerates traceIndex.json
contracts/solana/  Anchor (Rust) program — port of the original EVM ToroRegistry
  programs/toro/src/  All on-chain code (~730 lines, fully documented)
  scripts/seed.ts     Idempotent devnet seeder (TORO-01..TORO-05 demo traces)
  docs/toro-program.md  Authoritative on-chain reference — READ THIS FIRST
  data/CODE_REGISTRY.md Trace-data field codes (0x100..0x600)
docs/              Project memory: PROJECT-STATE.md, DECISIONS.md, PROGRESS.md
```

## Key commands

```bash
# UI (from ui/)
npm run dev                          # dev server
npm run build                        # production build (output: .next, hybrid SSG + dynamic)
npx tsx scripts/indexer-solana.ts    # rebuild src/data/traceIndex.json from devnet

# Solana program (from contracts/solana — needs Anchor + Solana toolchain)
anchor build / anchor test           # compile / 14 mocha tests (local validator)
anchor deploy --provider.cluster devnet
yarn seed                            # seed/resume demo traces (idempotent)
```

## Non-negotiable conventions

- **On-chain program:** event-only rich data. Chain stores only stages/counters;
  all trace details live in event payload blobs
  (`abi.encode(uint256[] codes, bytes32[] values)`). Never add rich data to
  accounts without updating DECISIONS.md, the indexer, and seed script together.
- **UI data source:** `ui/src/data/traceIndex.json` is generated. After
  re-seeding devnet, re-run the indexer.
- **Program ID:** `2cbYretd93guxpURxqhq1UedBtwSHzT2NX6MsrBc4FWc` (devnet).
- **Styling:** Tailwind 4, theme colors in `ui/app/globals.css` (`@theme`:
  ocean #3e96cc, deep #0a1628, gold #ffc354). Dark navy "deep ocean" identity.
- **Minimal changes:** follow existing code style; don't refactor unrelated code.

## Before doing anything

1. Read `docs/PROJECT-STATE.md` (current state + known gaps)
2. Read `docs/PROGRESS.md` (what was done, what's next — dated log)
3. Read `docs/DECISIONS.md` if you might contradict an earlier decision
4. Read `contracts/solana/docs/toro-program.md` before touching on-chain code

Update PROGRESS.md (and this file, if structure/commands change) as you work.
