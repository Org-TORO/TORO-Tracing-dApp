# TORO Solana Program — Technical Documentation

On-chain reference for the `toro` Anchor program (seafood supply-chain
traceability). This is a port of the original EVM `ToroRegistry` contract:
same lifecycle, same role model, same event-only payload convention.

- **Program ID:** `2cbYretd93guxpURxqhq1UedBtwSHzT2NX6MsrBc4FWc`
- **Framework:** Anchor (Rust)
- **Cluster:** devnet (see `Anchor.toml`)
- **Upgrade authority:** deployer wallet (`~/.config/solana/id.json`) — mock only

## 1. Overview

The program tracks seafood products through a two-level lifecycle:

- **Batches** — raw material (a vessel catch or farm harvest). Lifecycle:
  `Source → Inventory → Manufacturing` (stages 1–3).
- **Lots** — finished product. A lot is created atomically by merging
  **1 to 16 input batches**, all of which must be at `Manufacturing`. Its
  lifecycle then continues: `Manufacturing → Warehouse → Distribution`
  (stages 3–5).

Rich trace data (temperature readings, locations, certificates, etc.) is
**never stored on-chain**. Only opaque `Vec<u8>` payloads are emitted inside
events. The payload format is the familiar EVM
`abi.encode(uint256[] codes, bytes32[] values)` blob, decoded off-chain via
`data/CODE_REGISTRY.md`.

## 2. Account Model

All state lives in PDAs. There is no token program usage — the program
only manages its own data accounts plus the system program for rent.

### `Config` — program singleton

| Field | Type | Description |
|-------|------|-------------|
| `authority` | `Pubkey` | Program authority; can do everything roles can, plus role management |
| `batch_count` | `u64` | Total batches minted (monotonic counter) |
| `lot_count` | `u64` | Total lots created (monotonic counter) |
| `bump` | `u8` | PDA bump |

- Seeds: `["config"]`
- Size: `Config::LEN = 8 + 32 + 8 + 8 + 1 = 57` bytes

### `Role` — authorization marker

| Field | Type | Description |
|-------|------|-------------|
| `wallet` | `Pubkey` | The wallet this role grants |
| `bump` | `u8` | PDA bump |

The account is a **marker**: its mere existence authorizes the wallet.
There are two flavors, distinguished by seed prefix:

- Factory signer — seeds `["factory", wallet]`. Can mint batches and create lots.
- Station — seeds `["station", wallet]`. Can record stage transitions for batches and lots.

- Size: `Role::LEN = 8 + 32 + 1 = 41` bytes
- Revocation = closing the account (lamports refunded to the authority).

### `Batch` — raw-material batch

| Field | Type | Description |
|-------|------|-------------|
| `batch_id` | `[u8; 32]` | Unique batch identifier (32 bytes, not a string) |
| `stage` | `u8` | Current stage: 1 = Source, 2 = Inventory, 3 = Manufacturing |
| `created_at` | `i64` | Unix timestamp of `mint_batch` |
| `updated_at` | `i64` | Unix timestamp of the last stage transition |
| `bump` | `u8` | PDA bump |

- Seeds: `["batch", batch_id]`
- Size: `Batch::LEN = 8 + 32 + 1 + 8 + 8 + 1 = 58` bytes

### `Lot` — finished-product lot

| Field | Type | Description |
|-------|------|-------------|
| `lot_code` | `[u8; 32]` | Unique lot identifier |
| `stage` | `u8` | Current stage: 3 = Manufacturing, 4 = Warehouse, 5 = Distribution |
| `total_cans` | `u64` | Number of cans produced in this lot |
| `input_batches` | `[Pubkey; 16]` | PDA addresses of the input batches (fixed array, zero-padded) |
| `input_count` | `u8` | How many entries of `input_batches` are valid (1–16) |
| `created_at` | `i64` | Unix timestamp of lot creation |
| `updated_at` | `i64` | Unix timestamp of the last stage transition |
| `bump` | `u8` | PDA bump |

- Seeds: `["lot", lot_code]`
- Size: `Lot::LEN = 8 + 32 + 1 + 8 + (32 × 16) + 1 + 8 + 8 + 1 = 587` bytes

## 3. Access Control

Three privilege levels:

1. **Authority** (the `Config.authority` wallet) — implicit super-user. Always
   allowed to perform any role-gated action, and the *only* account allowed to
   manage roles and transfer authority.
2. **Factory signer** — holds a `Role` PDA under `["factory", wallet]`.
   Can `mint_batch` and `create_product_lot`.
3. **Station** — holds a `Role` PDA under `["station", wallet]`. Can record
   stage transitions (`record_inventory`, `record_manufacturing`,
   `record_warehouse`, `record_distribution`).

Role-gated instructions take an `Option<Account<Role>>` and accept the caller
if either the caller is the authority or the role account resolves to `Some`.
This mirrors the EVM `onlyFactorySigner` / `onlyStation` modifiers.

## 4. Instructions

### `initialize`

Creates the `Config` PDA. One-time setup.

- **Signers:** `payer` (becomes the authority)
- **Accounts:** `config` (init, seeds `["config"]`), `system_program`
- **Args:** none
- Initializes counters to 0, authority = `payer`.

### `add_factory_signer(wallet: Pubkey)` / `remove_factory_signer`

Grant / revoke factory-signer status.

- **Auth:** `authority` signer only (checked via `config.has_one = authority`)
- **Accounts:** `config`, `role` — `init` with seeds `["factory", wallet]` for
  add; `close = authority` with seeds `["factory", role.wallet]` for remove

### `authorize_station(wallet: Pubkey)` / `revoke_station`

Grant / revoke station status. Identical mechanics to factory roles, with the
`["station", wallet]` seed instead.

### `mint_batch(batch_id: [u8; 32], data: Vec<u8>)`

Creates a batch at stage `Source` (1).

- **Auth:** factory signer or authority (`role: Option<Role>`)
- **Accounts:** `recorder` (signer, pays), `config` (mut — increments
  `batch_count`), `role`, `batch` (init, seeds `["batch", batch_id]`),
  `system_program`
- **Effects:** sets stage = 1, timestamps, bump; increments `batch_count`
- **Events:** `BatchMinted`, then `TraceRecorded` (stage = 1)
- **Notes:** re-minting the same `batch_id` fails at the PDA level (account
  already initialized).

### `record_inventory(data: Vec<u8>)` / `record_manufacturing(data: Vec<u8>)`

Advance a batch along its lifecycle:

| Instruction | From → To | Required `batch.stage` |
|-------------|-----------|------------------------|
| `record_inventory` | Source → Inventory | 1 |
| `record_manufacturing` | Inventory → Manufacturing | 2 |

- **Auth:** station or authority
- **Accounts:** `recorder` (signer), `config`, `role`, `batch` (mut, PDA
  re-derived from `batch.batch_id`)
- **Errors:** `InvalidStage` if the batch is not in the expected stage
- **Events:** `TraceRecorded` with the new stage

### `create_product_lot(lot_code: [u8; 32], total_cans: u64, data: Vec<u8>)`

Merges 1–16 manufacturing batches into a new finished-product lot.

- **Auth:** factory signer or authority
- **Accounts:** `recorder` (signer, pays), `config` (mut — increments
  `lot_count`), `role`, `lot` (init, seeds `["lot", lot_code]`),
  `system_program`
- **Remaining accounts:** 1–16 `Batch` PDAs, each verified to:
  1. be owned by this program,
  2. deserialize as a valid `Batch`,
  3. be at stage `Manufacturing` (3),
  4. match the PDA derived from its own `batch_id` (prevents passing a
     crafted account under a foreign address).
- **Effects:** creates the lot at stage 3, records input batch pubkeys and
  count, stores `total_cans`, increments `lot_count`. Input batches are
  **not** consumed or marked — they remain at Manufacturing.
- **Events:** `LotCreated` (includes `input_batch_ids`), then
  `TraceRecorded` (stage = 3)
- **Errors:** `NoInputs` (empty), `TooManyInputs` (> 16),
  `BatchNotAtManufacturing`, `InvalidBatchAccount`

### `record_warehouse(data: Vec<u8>)` / `record_distribution(data: Vec<u8>)`

Advance a lot along its lifecycle:

| Instruction | From → To | Required `lot.stage` |
|-------------|-----------|----------------------|
| `record_warehouse` | Manufacturing → Warehouse | 3 |
| `record_distribution` | Warehouse → Distribution | 4 |

- **Auth:** station or authority
- **Accounts:** `recorder` (signer), `config`, `role`, `lot` (mut, PDA
  re-derived from `lot.lot_code`)
- **Errors:** `InvalidStage`
- **Events:** `TraceRecorded` with the new stage

### `transfer_authority(new_authority: Pubkey)`

Re-points `Config.authority`. The old authority loses all privilege
immediately (role management, implicit super-user status).

- **Auth:** current `authority` signer only
- **Accounts:** `config` (mut, seeds `["config"]`)

## 5. Events

All events mirror the EVM contract's events. Off-chain indexers (see
`ui/scripts/indexer-solana.ts`) reconstruct full trace histories from them.

### `BatchMinted`

| Field | Type |
|-------|------|
| `batch_id` | `[u8; 32]` |
| `data` | `Vec<u8>` |
| `timestamp` | `i64` |
| `recorder` | `Pubkey` |

### `TraceRecorded`

Emitted on **every** stage transition of both batches and lots.

| Field | Type | Notes |
|-------|------|-------|
| `id` | `[u8; 32]` | `batch_id` or `lot_code` |
| `stage` | `u8` | The stage *entered* |
| `data` | `Vec<u8>` | abi-encoded payload blob |
| `timestamp` | `i64` | |
| `recorder` | `Pubkey` | |

### `LotCreated`

| Field | Type |
|-------|------|
| `lot_code` | `[u8; 32]` |
| `input_batch_ids` | `Vec<[u8; 32]>` |
| `total_cans` | `u64` |
| `data` | `Vec<u8>` |
| `timestamp` | `i64` |
| `recorder` | `Pubkey` |

### Data payload convention

The `data` blob in every event is the same format used on EVM:
`abi.encode(uint256[] codes, bytes32[] values)` — a list of numeric field
codes paired with 32-byte values. Decoding is defined off-chain in
`data/CODE_REGISTRY.md`.

## 6. Errors

| Code | Name | Message |
|------|------|---------|
| 6000 | `Unauthorized` | Unauthorized caller |
| 6001 | `InvalidStage` | Invalid stage transition |
| 6002 | `BatchNotAtManufacturing` | Batch is not at the manufacturing stage |
| 6003 | `NoInputs` | Lot must have at least one input batch |
| 6004 | `TooManyInputs` | Too many input batches (max 16) |
| 6005 | `InvalidBatchAccount` | Invalid input batch account |

(Anchor error codes start at 6000 for the first `#[error_code]` variant.)

## 7. Source Layout

```
programs/toro/src/
├── lib.rs                          # #[program] module: instruction entrypoints
├── constants.rs                    # PDA seed prefixes, stage constants, MAX_LOT_INPUTS
├── state.rs                        # Config, Role, Batch, Lot accounts
├── error.rs                        # ToroError
├── events.rs                       # BatchMinted, TraceRecorded, LotCreated
├── instructions.rs                 # module re-exports
└── instructions/
    ├── initialize.rs               # initialize
    ├── roles.rs                    # add/remove_factory_signer, authorize/revoke_station
    ├── mint_batch.rs               # mint_batch
    ├── record_batch_stage.rs       # record_inventory, record_manufacturing
    ├── create_product_lot.rs       # create_product_lot
    ├── record_lot_stage.rs         # record_warehouse, record_distribution
    └── transfer_authority.rs       # transfer_authority
```

## 8. Build, Test, Deploy

```bash
anchor build                            # compile program + IDL
anchor test                             # local validator, 14 mocha tests
anchor deploy --provider.cluster devnet

yarn seed                               # seed TORO-01..TORO-05 demo traces (idempotent,
                                        # resumable, retries RPC 429s)
```

The seed script is safe to re-run: it skips steps already recorded on-chain
and paces transactions.

## 9. Indexing

There is no on-chain query interface — rich data is event-only, so history is
reconstructed by crawling program logs:

```bash
cd ../../ui
npx tsx scripts/indexer-solana.ts      # crawls program events → src/data/traceIndex.json
```
