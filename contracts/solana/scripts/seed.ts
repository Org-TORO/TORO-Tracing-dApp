/**
 * Devnet seed script: ports the original EVM DeployAndDemo + SeedLot05 scripts.
 * Initializes the program, grants roles to the deployer, and records the demo
 * traces with the exact same code/value payloads as EVM. Two waves:
 *   TORO-01..05 — original 2024-era demo traces
 *   TORO-06..10 — October 2026 refresh wave (keeps the explorer looking recent)
 *
 * Usage: yarn seed   (from contracts/solana)
 */

import * as anchor from "@anchor-lang/core";
import { encodeAbiParameters, parseAbiParameters, toHex, pad } from "viem";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const { PublicKey, Keypair, Connection } = anchor.web3;

// ───────── Setup ─────────

const RPC_URL = process.env.ANCHOR_PROVIDER_URL ?? "https://api.devnet.solana.com";
const WALLET_PATH =
  process.env.ANCHOR_WALLET ?? path.join(os.homedir(), ".config/solana/id.json");

const keypair = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(fs.readFileSync(WALLET_PATH, "utf-8")))
);
const connection = new Connection(RPC_URL, "confirmed");
const wallet = new anchor.Wallet(keypair);
const provider = new anchor.AnchorProvider(connection, wallet, { commitment: "confirmed" });

const idl = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../target/idl/toro.json"), "utf-8")
);
const program = new anchor.Program(idl as any, provider) as any;
const PROGRAM_ID: InstanceType<typeof PublicKey> = program.programId;

// ───────── PDA helpers ─────────

const idToBytes32 = (id: string): Buffer => {
  const buf = Buffer.alloc(32);
  buf.write(id, "utf-8");
  return buf;
};

const pda = (seeds: Buffer[]) =>
  PublicKey.findProgramAddressSync(seeds, PROGRAM_ID)[0];

const configPDA = () => pda([Buffer.from("config")]);
const batchPDA = (id: Buffer) => pda([Buffer.from("batch"), id]);
const lotPDA = (code: Buffer) => pda([Buffer.from("lot"), code]);
const rolePDA = (kind: "factory" | "station", w: anchor.web3.PublicKey) =>
  pda([Buffer.from(kind), w.toBuffer()]);

// ───────── Data builders (mirror the Solidity _str32 / abi.encode payloads) ─────────

type Hex = `0x${string}`;

const u256 = (n: number | bigint): Hex => pad(toHex(n), { size: 32 });
const i256 = (n: number): Hex =>
  pad(toHex(n < 0 ? BigInt(2) ** BigInt(256) + BigInt(n) : BigInt(n)), { size: 32 });
const str32 = (s: string): Hex =>
  ("0x" + Buffer.from(s, "utf-8").toString("hex").padEnd(64, "0")) as Hex;

function encodeData(codes: number[], values: Hex[]): Buffer {
  const hex = encodeAbiParameters(parseAbiParameters("uint256[] codes, bytes32[] values"), [
    codes.map(BigInt),
    values,
  ]);
  return Buffer.from(hex.slice(2), "hex");
}

const sourceData = (
  sourceType: number, species: number, region: string,
  catchDate: number, method: number, area: number, weightKg: number
) =>
  encodeData(
    [0x100, 0x101, 0x102, 0x103, 0x104, 0x105, 0x106, 0x600],
    [u256(sourceType), u256(species), str32(region), u256(catchDate), u256(method), u256(area), u256(weightKg), u256(1)]
  );

const inventoryData = (receivedDate: number, locationId: number) =>
  encodeData([0x110, 0x111], [u256(receivedDate), u256(locationId)]);

const manufData = (
  factoryName: string, prodDate: number, packDate: number,
  inputKg: number, outputCans: number, wastageKg: number
) =>
  encodeData(
    [0x200, 0x204, 0x205, 0x208, 0x209, 0x20a],
    [str32(factoryName), u256(prodDate), u256(packDate), u256(inputKg), u256(outputCans), u256(wastageKg)]
  );

const lotData = (productLabel: string, packagingDate: number) =>
  encodeData([0x501, 0x504], [str32(productLabel), u256(packagingDate)]);

const warehouseData = (name: string, start: number, end: number, tempC: number) =>
  encodeData([0x300, 0x304, 0x305, 0x306], [str32(name), u256(start), u256(end), i256(tempC)]);

const distData = (shipmentCode: string, departure: number, arrival: number) =>
  encodeData([0x400, 0x404, 0x405], [str32(shipmentCode), u256(departure), u256(arrival)]);

// ───────── Chain ops ─────────

async function exists(addr: anchor.web3.PublicKey): Promise<boolean> {
  return (await connection.getAccountInfo(addr)) !== null;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Retry an RPC call on 429 rate-limit with backoff, then pause to stay under the limit. */
async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      const result = await fn();
      await sleep(400); // pacing between txs
      return result;
    } catch (e: any) {
      if (attempt >= 6 || !String(e).includes("429")) throw e;
      const wait = 2000 * attempt;
      console.log(`  rate limited, retrying in ${wait}ms...`);
      await sleep(wait);
    }
  }
}

async function fetchBatchStage(id: string): Promise<number | null> {
  const batch = await program.account.batch.fetchNullable(batchPDA(idToBytes32(id)));
  return batch ? batch.stage : null;
}

async function fetchLotStage(code: string): Promise<number | null> {
  const lot = await program.account.lot.fetchNullable(lotPDA(idToBytes32(code)));
  return lot ? lot.stage : null;
}

async function initializeIfNeeded() {
  if (await exists(configPDA())) {
    console.log("Config already initialized, skipping");
    return;
  }
  await program.methods.initialize().rpc();
  console.log("Initialized config");
}

async function grantRoleIfNeeded(kind: "factory" | "station") {
  const role = rolePDA(kind, keypair.publicKey);
  if (await exists(role)) {
    console.log(`Role ${kind} already granted, skipping`);
    return;
  }
  if (kind === "factory") {
    await program.methods.addFactorySigner(keypair.publicKey).accounts({ role }).rpc();
  } else {
    await program.methods.authorizeStation(keypair.publicKey).accounts({ role }).rpc();
  }
  console.log(`Granted ${kind} role to deployer`);
}

async function mintBatch(id: string, data: Buffer) {
  const batchId = idToBytes32(id);
  if ((await fetchBatchStage(id)) !== null) {
    console.log(`  batch ${id} already exists, skipping mint`);
    return;
  }
  await withRetry(() =>
    program.methods
      .mintBatch(Array.from(batchId), data)
      .accounts({
        recorder: keypair.publicKey,
        role: rolePDA("factory", keypair.publicKey),
        batch: batchPDA(batchId),
      })
      .rpc()
  );
  console.log(`  minted batch ${id}`);
}

async function recordBatchStage(method: "recordInventory" | "recordManufacturing", id: string, data: Buffer) {
  const targetStage = method === "recordInventory" ? 2 : 3;
  const current = await fetchBatchStage(id);
  if (current !== null && current >= targetStage) {
    console.log(`  ${method} ${id} already done, skipping`);
    return;
  }
  const batchId = idToBytes32(id);
  await withRetry(() =>
    program.methods[method](data)
      .accounts({
        recorder: keypair.publicKey,
        role: rolePDA("station", keypair.publicKey),
        batch: batchPDA(batchId),
      })
      .rpc()
  );
  console.log(`  ${method} ${id}`);
}

async function createLot(code: string, batchIds: string[], totalCans: number, data: Buffer) {
  if ((await fetchLotStage(code)) !== null) {
    console.log(`  lot ${code} already exists, skipping`);
    return;
  }
  const lotCode = idToBytes32(code);
  await withRetry(() =>
    program.methods
      .createProductLot(Array.from(lotCode), new anchor.BN(totalCans), data)
      .accounts({
        recorder: keypair.publicKey,
        role: rolePDA("factory", keypair.publicKey),
        lot: lotPDA(lotCode),
      })
      .remainingAccounts(
        batchIds.map((id) => ({
          pubkey: batchPDA(idToBytes32(id)),
          isSigner: false,
          isWritable: false,
        }))
      )
      .rpc()
  );
  console.log(`  created lot ${code} from [${batchIds.join(", ")}]`);
}

async function recordLotStage(method: "recordWarehouse" | "recordDistribution", code: string, data: Buffer) {
  const targetStage = method === "recordWarehouse" ? 4 : 5;
  const current = await fetchLotStage(code);
  if (current !== null && current >= targetStage) {
    console.log(`  ${method} ${code} already done, skipping`);
    return;
  }
  const lotCode = idToBytes32(code);
  await withRetry(() =>
    program.methods[method](data)
      .accounts({
        recorder: keypair.publicKey,
        role: rolePDA("station", keypair.publicKey),
        lot: lotPDA(lotCode),
      })
      .rpc()
  );
  console.log(`  ${method} ${code}`);
}

// ───────── Demo traces (identical to the EVM seed scripts) ─────────

async function main() {
  console.log(`Program:  ${PROGRAM_ID.toBase58()}`);
  console.log(`Deployer: ${keypair.publicKey.toBase58()}`);
  console.log(`Cluster:  ${RPC_URL}`);

  await initializeIfNeeded();
  await grantRoleIfNeeded("factory");
  await grantRoleIfNeeded("station");

  console.log("=== TRACE 1: WILD-CATCH-001 -> TORO-01 ===");
  await mintBatch("WILD-CATCH-001", sourceData(1, 1, "Bình Định", 1715731200, 1, 1, 800));
  await recordBatchStage("recordInventory", "WILD-CATCH-001", inventoryData(1716000000, 1));
  await recordBatchStage("recordManufacturing", "WILD-CATCH-001", manufData("TORO-Seafood Processing 1", 1717200000, 1718400000, 1950, 3900, 50));
  await createLot("TORO-01", ["WILD-CATCH-001"], 3900, lotData("cá ngừ đóng hộp", 1719800000));
  await recordLotStage("recordWarehouse", "TORO-01", warehouseData("TORO-Cold Storage 1", 1719000000, 1719700000, 2));
  await recordLotStage("recordDistribution", "TORO-01", distData("TORO-Shipping 1", 1719500000, 1719700000));

  console.log("=== TRACE 2: WILD-CATCH-002 + FARM-001 -> TORO-02 ===");
  await mintBatch("WILD-CATCH-002", sourceData(1, 1, "Phú Yên", 1715800000, 1, 1, 850));
  await recordBatchStage("recordInventory", "WILD-CATCH-002", inventoryData(1716100000, 1));
  await recordBatchStage("recordManufacturing", "WILD-CATCH-002", manufData("TORO-Seafood Processing 1", 1717300000, 1718500000, 2000, 4000, 60));
  await mintBatch("FARM-001", sourceData(2, 1, "Khánh Hòa", 1715900000, 5, 1, 2500));
  await recordBatchStage("recordInventory", "FARM-001", inventoryData(1716200000, 2));
  await recordBatchStage("recordManufacturing", "FARM-001", manufData("TORO-Seafood Processing 2", 1717400000, 1718600000, 2400, 4800, 80));
  await createLot("TORO-02", ["WILD-CATCH-002", "FARM-001"], 8800, lotData("cá ngừ đóng hộp", 1720000000));
  await recordLotStage("recordWarehouse", "TORO-02", warehouseData("TORO-Cold Storage 2", 1719100000, 1719800000, 2));
  await recordLotStage("recordDistribution", "TORO-02", distData("TORO-Shipping 2", 1719600000, 1719800000));

  console.log("=== TRACE 3: FARM-002 -> TORO-03 ===");
  await mintBatch("FARM-002", sourceData(2, 2, "Bình Định", 1716000000, 5, 2, 3000));
  await recordBatchStage("recordInventory", "FARM-002", inventoryData(1716300000, 2));
  await recordBatchStage("recordManufacturing", "FARM-002", manufData("TORO-Seafood Processing 3", 1717500000, 1718700000, 2900, 5800, 100));
  await createLot("TORO-03", ["FARM-002"], 5800, lotData("cá ngừ đóng hộp", 1720100000));
  await recordLotStage("recordWarehouse", "TORO-03", warehouseData("TORO-Cold Storage 1", 1719300000, 1720000000, 1));
  await recordLotStage("recordDistribution", "TORO-03", distData("TORO-Shipping 3", 1719800000, 1720000000));

  console.log("=== TRACE 4: WILD-CATCH-003 -> TORO-04 ===");
  await mintBatch("WILD-CATCH-003", sourceData(1, 3, "Phú Yên", 1716100000, 2, 1, 1200));
  await recordBatchStage("recordInventory", "WILD-CATCH-003", inventoryData(1716400000, 1));
  await recordBatchStage("recordManufacturing", "WILD-CATCH-003", manufData("TORO-Seafood Processing 1", 1717600000, 1718800000, 1150, 2300, 40));
  await createLot("TORO-04", ["WILD-CATCH-003"], 2300, lotData("cá ngừ", 1720200000));
  await recordLotStage("recordWarehouse", "TORO-04", warehouseData("TORO-Cold Storage 3", 1719400000, 1719900000, 3));
  await recordLotStage("recordDistribution", "TORO-04", distData("TORO-Shipping 1", 1719900000, 1720100000));

  console.log("=== TRACE 5: WILD-CATCH-005 -> TORO-05 ===");
  await mintBatch("WILD-CATCH-005", sourceData(1, 1, "Bình Định", 1716336000, 1, 1, 1500));
  await recordBatchStage("recordInventory", "WILD-CATCH-005", inventoryData(1716595200, 1));
  await recordBatchStage("recordManufacturing", "WILD-CATCH-005", manufData("TORO-Seafood Processing 1", 1717977600, 1718841600, 1450, 2900, 45));
  await createLot("TORO-05", ["WILD-CATCH-005"], 2900, lotData("cá ngừ đóng hộp", 1719273600));
  await recordLotStage("recordWarehouse", "TORO-05", warehouseData("TORO-Cold Storage 2", 1718841600, 1719532800, -2));
  await recordLotStage("recordDistribution", "TORO-05", distData("TORO-Shipping 2", 1719532800, 1719705600));

  console.log("=== TRACE 6: WILD-CATCH-006 -> TORO-06 ===");
  await mintBatch("WILD-CATCH-006", sourceData(1, 1, "Bình Định", 1790899200, 1, 1, 900));
  await recordBatchStage("recordInventory", "WILD-CATCH-006", inventoryData(1791072000, 1));
  await recordBatchStage("recordManufacturing", "WILD-CATCH-006", manufData("TORO-Seafood Processing 1", 1791504000, 1791676800, 2200, 4400, 60));
  await createLot("TORO-06", ["WILD-CATCH-006"], 4400, lotData("cá ngừ đóng hộp", 1791763200));
  await recordLotStage("recordWarehouse", "TORO-06", warehouseData("TORO-Cold Storage 1", 1791849600, 1791936000, 2));
  await recordLotStage("recordDistribution", "TORO-06", distData("TORO-Shipping 1", 1792022400, 1792108800));

  console.log("=== TRACE 7: WILD-CATCH-007 + FARM-003 -> TORO-07 ===");
  await mintBatch("WILD-CATCH-007", sourceData(1, 1, "Phú Yên", 1790985600, 1, 1, 950));
  await recordBatchStage("recordInventory", "WILD-CATCH-007", inventoryData(1791158400, 1));
  await recordBatchStage("recordManufacturing", "WILD-CATCH-007", manufData("TORO-Seafood Processing 1", 1791590400, 1791763200, 2100, 4200, 55));
  await mintBatch("FARM-003", sourceData(2, 1, "Khánh Hòa", 1791072000, 5, 1, 2600));
  await recordBatchStage("recordInventory", "FARM-003", inventoryData(1791244800, 2));
  await recordBatchStage("recordManufacturing", "FARM-003", manufData("TORO-Seafood Processing 2", 1791676800, 1791849600, 2500, 5000, 70));
  await createLot("TORO-07", ["WILD-CATCH-007", "FARM-003"], 9200, lotData("cá ngừ đóng hộp", 1792022400));
  await recordLotStage("recordWarehouse", "TORO-07", warehouseData("TORO-Cold Storage 2", 1792108800, 1792195200, 2));
  await recordLotStage("recordDistribution", "TORO-07", distData("TORO-Shipping 2", 1792281600, 1792368000));

  console.log("=== TRACE 8: FARM-004 -> TORO-08 ===");
  await mintBatch("FARM-004", sourceData(2, 2, "Bình Định", 1791244800, 5, 2, 3200));
  await recordBatchStage("recordInventory", "FARM-004", inventoryData(1791417600, 2));
  await recordBatchStage("recordManufacturing", "FARM-004", manufData("TORO-Seafood Processing 3", 1791849600, 1792022400, 3100, 6200, 90));
  await createLot("TORO-08", ["FARM-004"], 6200, lotData("cá ngừ đóng hộp", 1792195200));
  await recordLotStage("recordWarehouse", "TORO-08", warehouseData("TORO-Cold Storage 3", 1792281600, 1792368000, 1));
  await recordLotStage("recordDistribution", "TORO-08", distData("TORO-Shipping 3", 1792454400, 1792540800));

  console.log("=== TRACE 9: WILD-CATCH-008 -> TORO-09 ===");
  await mintBatch("WILD-CATCH-008", sourceData(1, 3, "Phú Yên", 1791417600, 2, 1, 1300));
  await recordBatchStage("recordInventory", "WILD-CATCH-008", inventoryData(1791590400, 1));
  await recordBatchStage("recordManufacturing", "WILD-CATCH-008", manufData("TORO-Seafood Processing 1", 1792022400, 1792195200, 1250, 2500, 42));
  await createLot("TORO-09", ["WILD-CATCH-008"], 2500, lotData("cá ngừ", 1792368000));
  await recordLotStage("recordWarehouse", "TORO-09", warehouseData("TORO-Cold Storage 1", 1792454400, 1792540800, 3));
  await recordLotStage("recordDistribution", "TORO-09", distData("TORO-Shipping 1", 1792627200, 1792713600));

  console.log("=== TRACE 10: WILD-CATCH-010 -> TORO-10 ===");
  await mintBatch("WILD-CATCH-010", sourceData(1, 1, "Bình Định", 1791763200, 1, 1, 1600));
  await recordBatchStage("recordInventory", "WILD-CATCH-010", inventoryData(1791936000, 1));
  await recordBatchStage("recordManufacturing", "WILD-CATCH-010", manufData("TORO-Seafood Processing 1", 1792368000, 1792540800, 1550, 3100, 48));
  await createLot("TORO-10", ["WILD-CATCH-010"], 3100, lotData("cá ngừ đóng hộp", 1792627200));
  await recordLotStage("recordWarehouse", "TORO-10", warehouseData("TORO-Cold Storage 2", 1792713600, 1792800000, -2));
  await recordLotStage("recordDistribution", "TORO-10", distData("TORO-Shipping 2", 1792800000, 1792886400));

  console.log("========================================");
  console.log("SEED COMPLETE");
  console.log(`Program: ${PROGRAM_ID.toBase58()}`);
  console.log("========================================");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
