"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Anchor, Snowflake, Boxes, Trophy } from "lucide-react";
import QRCode from "qrcode";
import dynamic from "next/dynamic";
import LazySection from "@/components/LazySection";

/* Heavy visuals split into their own chunks: three.js (hero can) loads
   async without blocking hero copy; the expansion map (d3 + topo data)
   loads only when scrolled near, via LazySection. */
const Can3D = dynamic(() => import("@/components/Can3D"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      className="w-full h-full rounded-full bg-ocean/5 blur-2xl animate-pulse"
    />
  ),
});
const ExpansionMap = dynamic(() => import("@/components/ExpansionMap"), {
  loading: () => (
    <div aria-hidden className="w-full h-64 bg-white/[0.02] rounded-2xl animate-pulse" />
  ),
});
import StampButton from "@/components/StampButton";
import { useT } from "@/src/lib/i18n";
import traceIndex from "@/src/data/traceIndex.json";
import { explorerUrl } from "@/src/lib/trace";

/* ════════════════════════════════════════════════════════════════════
   ONE CAN, ONE JOURNEY · the landing page tells the true story of
   lot TORO-01 straight from the on-chain index. If the demo data is
   re-seeded and re-indexed, this page updates itself.
   Design brief: docs/LANDING-REDESIGN.md
   ════════════════════════════════════════════════════════════════════ */

const STORY_LOT_CODE = "TORO-01";
const TRACE_URL = "https://toro-dapp.vercel.app/explorer/TORO-01";
const PROGRAM_URL =
  "https://solscan.io/account/2cbYretd93guxpURxqhq1UedBtwSHzT2NX6MsrBc4FWc?cluster=devnet";

const index = traceIndex as unknown as {
  lots: Record<string, any>;
};

const lot = index.lots[STORY_LOT_CODE];
const batch = lot?.batches?.[0];

const stageOf = (traces: any[] | undefined, stage: number) =>
  traces?.find((t) => t.stage === stage);

const source = stageOf(batch?.trace, 1);
const inventory = stageOf(batch?.trace, 2);
const manufacturing = stageOf(batch?.trace, 3);
const warehouse = stageOf(lot?.lotTraces, 4);
const distribution = stageOf(lot?.lotTraces, 5);

const d = (trace: any, key: string) =>
  (trace?.details?.[key] as string | number | undefined) ?? "…";

const shortSig = (sig: string) => `${sig.slice(0, 8)}…${sig.slice(-8)}`;
const shortKey = (key: string) => `${key.slice(0, 6)}…${key.slice(-6)}`;

/* ─── Chapter heading: ghost number + editorial title ─── */

function ChapterHeading({
  num,
  title,
  kicker,
}: {
  num: string;
  title: React.ReactNode;
  kicker: string;
}) {
  return (
    <div className="relative mb-12 md:mb-16">
      <span
        aria-hidden
        className="font-display italic text-[7rem] md:text-[10rem] leading-none text-white/[0.04] absolute -top-10 md:-top-16 -left-2 select-none"
      >
        {num}
      </span>
      <div className="relative">
        <p className="font-mono-data text-xs tracking-[0.35em] uppercase text-ocean mb-3">
          {kicker}
        </p>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[1.05]">
          {title}
        </h2>
      </div>
    </div>
  );
}

/* ─── Spec-sheet row: quiet label over value, no rules ─── */

function SpecRow({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="py-3">
      <p className="text-[11px] font-mono-data tracking-[0.2em] uppercase text-white/35 mb-1">
        {label}
      </p>
      <p
        className={`text-white leading-snug ${
          mono ? "font-mono-data text-sm" : "font-display text-xl font-light"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ─── On-chain signature line: tx hash + Solscan link ─── */

function Signature({ trace, label }: { trace: any; label: string }) {
  if (!trace?.txHash) return null;
  return (
    <a
      href={explorerUrl(trace.txHash)}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-baseline justify-between gap-4 py-2.5"
    >
      <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors">
        {label}
      </span>
      <span className="font-mono-data text-xs text-ocean group-hover:text-white transition-colors inline-flex items-center gap-1.5">
        {shortSig(trace.txHash)}
        <ArrowUpRight className="w-3.5 h-3.5" />
      </span>
    </a>
  );
}

/* ═══ CHAPTER 0 · THE CAN ═══ */

function Hero() {
  const { t } = useT();
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const canY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -120]);
  const canOpacity = useTransform(scrollYProgress, [0, 0.8], [1, reduceMotion ? 1 : 0.15]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, reduceMotion ? 1 : 0]);

  return (
    <section
      ref={ref}
      className="relative flex flex-col justify-center overflow-hidden"
      style={{
        backgroundImage: "url(/Dark_bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100svh",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/60 via-transparent to-[#0a1628] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-28 pb-24 flex-1 flex flex-col lg:flex-row items-center gap-8 lg:gap-4">
        {/* Story */}
        <motion.div style={{ y: textY, opacity: textOpacity }} className="flex-1 lg:max-w-2xl">
          <p className="font-mono-data text-xs tracking-[0.35em] uppercase text-ocean mb-6">
            {t.landing.hero.kicker(STORY_LOT_CODE)}
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[5.2rem] font-light text-white leading-[1.02] mb-8">
            {t.landing.hero.line1}
            <br />
            <em className="italic text-ocean">{t.landing.hero.em}</em>{" "}
            {t.landing.hero.line2}
          </h1>
          <p className="text-lg text-white/55 max-w-md leading-relaxed mb-4">
            {t.landing.hero.body(d(source, "Region").toString())}
          </p>
        </motion.div>

        {/* The can */}
        <motion.div
          style={{ y: canY, opacity: canOpacity }}
          className="flex-shrink-0 w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[460px] h-[380px] sm:h-[460px] lg:h-[560px] relative"
        >
          <div className="absolute inset-0 bg-ocean/10 blur-3xl rounded-full scale-75" />
          <Can3D />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
      >
        <span className="font-mono-data text-[11px] tracking-[0.3em] uppercase text-white/35">
          {t.landing.hero.scrollCue}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4 text-ocean" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══ CHAPTER 1 · THE CATCH ═══ */

function TheCatch() {
  const { t } = useT();
  return (
    <section className="relative px-6 md:px-10 py-28 md:py-40 overflow-hidden bg-gradient-to-b from-[#0a1628] via-[#081226] to-[#0a1628]">
      {/* Light rays from the surface */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-1/4 left-[15%] w-40 h-[120%] rotate-12 opacity-[0.05]"
          style={{
            background: "linear-gradient(to bottom, #7cc4ff, transparent 70%)",
            filter: "blur(24px)",
          }}
        />
        <div
          className="absolute -top-1/4 left-[45%] w-64 h-[120%] rotate-6 opacity-[0.04]"
          style={{
            background: "linear-gradient(to bottom, #7cc4ff, transparent 70%)",
            filter: "blur(32px)",
          }}
        />
        <div
          className="absolute -top-1/4 left-[75%] w-32 h-[120%] rotate-18 opacity-[0.05]"
          style={{
            background: "linear-gradient(to bottom, #7cc4ff, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <ChapterHeading
          num="01"
          kicker={t.landing.catchChapter.kicker(d(source, "Region").toString())}
          title={
            <>
              {t.landing.catchChapter.titleA}
              <br />
              <em className="italic text-ocean">{t.landing.catchChapter.titleB}</em>
            </>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2"
          >
            <p className="text-white/55 text-lg leading-relaxed mb-8">
              {t.landing.catchChapter.body(
                d(source, "Fish Species").toString().toLowerCase(),
                d(source, "Catch Weight (kg)").toString(),
                d(source, "Catch Area").toString()
              )}
            </p>
            <p className="font-display text-3xl md:text-4xl font-light text-white italic leading-snug">
              “{t.landing.catchChapter.quote(d(source, "Catch Weight (kg)").toString(), d(source, "Catch Date").toString())}{" "}
              <span className="text-gold not-italic font-mono-data text-2xl align-middle">
                {d(source, "HACCP Certified")}
              </span>
              ”
            </p>
            <div className="mt-8">
              <Signature trace={source} label={t.landing.catchChapter.sigLabel} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="flex items-center gap-3 mb-4">
              <Anchor className="w-4 h-4 text-ocean" />
              <span className="font-mono-data text-xs tracking-[0.25em] uppercase text-white/40">
                {t.landing.catchChapter.manifest(batch?.batchId ?? STORY_LOT_CODE)}
              </span>
            </div>
            <div className="border-t border-white/10">
              <SpecRow label={t.landing.catchChapter.spec.species} value={d(source, "Fish Species")} />
              <SpecRow label={t.landing.catchChapter.spec.method} value={d(source, "Fishing Method")} />
              <SpecRow label={t.landing.catchChapter.spec.region} value={d(source, "Region")} />
              <SpecRow label={t.landing.catchChapter.spec.area} value={d(source, "Catch Area")} />
              <SpecRow label={t.landing.catchChapter.spec.date} value={d(source, "Catch Date")} />
              <SpecRow label={t.landing.catchChapter.spec.weight} value={<>{d(source, "Catch Weight (kg)")} kg</>} />
              <SpecRow label={t.landing.catchChapter.spec.sourceType} value={d(source, "Source Type")} />
              <SpecRow label={t.landing.catchChapter.spec.foodSafety} value={d(source, "HACCP Certified")} mono />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══ CHAPTER 2 · THE FACTORY ═══ */

function TheFactory() {
  const { t } = useT();
  return (
    <section className="relative px-6 md:px-10 py-28 md:py-40 bg-[#0a1628] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-[32rem] h-72 bg-ocean/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <ChapterHeading
          num="02"
          kicker={t.landing.factoryChapter.kicker}
          title={
            <>
              {t.landing.factoryChapter.titleA(d(manufacturing, "Input Weight (kg)").toString())}
              <br />
              <em className="italic text-gold">{t.landing.factoryChapter.titleB(lot?.totalCans?.toLocaleString("en-US") ?? "")}</em>
            </>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Spec sheet */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Boxes className="w-4 h-4 text-gold" />
              <span className="font-mono-data text-xs tracking-[0.25em] uppercase text-white/40">
                {t.landing.factoryChapter.record}
              </span>
            </div>
            <div className="border-t border-white/10">
              <SpecRow label={t.landing.factoryChapter.spec.factory} value={d(manufacturing, "Factory Name")} />
              <SpecRow label={t.landing.factoryChapter.spec.received} value={d(inventory, "Inventory Received")} />
              <SpecRow label={t.landing.factoryChapter.spec.storedAt} value={d(inventory, "Inventory Location")} />
              <SpecRow label={t.landing.factoryChapter.spec.productionDate} value={d(manufacturing, "Production Date")} />
              <SpecRow label={t.landing.factoryChapter.spec.packagingDate} value={d(manufacturing, "Packaging Date")} />
              <SpecRow label={t.landing.factoryChapter.spec.wastage} value={<>{d(manufacturing, "Wastage (kg)")} kg</>} />
            </div>
            <p className="text-white/45 text-sm leading-relaxed mt-8">
              {t.landing.factoryChapter.body}
            </p>
            <div className="mt-4">
              <Signature trace={manufacturing} label={t.landing.factoryChapter.sigLabel} />
            </div>
          </motion.div>

          {/* Facility footage */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex justify-center"
          >
            <div className="relative w-[280px] sm:w-[300px]">
              <div className="relative rounded-[2.2rem] border border-white/12 bg-[#0c1f3a] p-2 shadow-2xl shadow-black/50">
                <div className="relative rounded-[1.8rem] overflow-hidden bg-black aspect-[9/19.5]">
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/qQQoK-IuPGw?rel=0"
                    title="TORO field app demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
              <p className="font-mono-data text-[11px] tracking-[0.2em] uppercase text-white/30 text-center mt-4">
                {t.landing.factoryChapter.videoCaption}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══ CHAPTER 3 · THE PROOF ═══ */

function TheProof() {
  const { t } = useT();
  const signatures = [
    { trace: source, label: t.landing.proofChapter.sigLabels.catch },
    { trace: inventory, label: t.landing.proofChapter.sigLabels.cold },
    { trace: manufacturing, label: t.landing.proofChapter.sigLabels.production },
    { trace: warehouse, label: t.landing.proofChapter.sigLabels.warehouse },
    { trace: distribution, label: t.landing.proofChapter.sigLabels.shipment },
  ];

  return (
    <section className="relative px-6 md:px-10 py-28 md:py-40 bg-gradient-to-b from-[#0a1628] via-[#0d1c33] to-[#0a1628] overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        <ChapterHeading
          num="03"
          kicker={t.landing.proofChapter.kicker}
          title={
            <>
              {t.landing.proofChapter.titleA}
              <br />
              <em className="italic text-ocean">{t.landing.proofChapter.titleB}</em>
            </>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-white/55 text-lg leading-relaxed mb-10">
              {t.landing.proofChapter.body(
                d(warehouse, "Warehouse Name").toString(),
                d(warehouse, "Storage Temp (°C)").toString(),
                d(distribution, "Shipment Code").toString()
              )}
            </p>

            <div className="border-t border-white/10">
              <SpecRow label={t.landing.proofChapter.spec.warehouse} value={d(warehouse, "Warehouse Name")} />
              <SpecRow
                label={t.landing.proofChapter.spec.temp}
                value={<span className="inline-flex items-center gap-2"><Snowflake className="w-3.5 h-3.5 text-ocean" />{d(warehouse, "Storage Temp (°C)")}°C</span>}
              />
              <SpecRow label={t.landing.proofChapter.spec.stored} value={`${d(warehouse, "Storage Start")} → ${d(warehouse, "Storage End")}`} />
              <SpecRow label={t.landing.proofChapter.spec.shipment} value={d(distribution, "Shipment Code")} />
              <SpecRow label={t.landing.proofChapter.spec.sailed} value={`${d(distribution, "Departure Date")} → ${d(distribution, "Arrival Date")}`} />
            </div>
          </motion.div>

          {/* The receipt */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="bg-black/30 border border-white/10 p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono-data text-xs tracking-[0.25em] uppercase text-white/40">
                {t.landing.proofChapter.receiptLabel}
              </span>
            </div>
            <p className="font-display text-2xl font-light text-white mb-6">
              {t.landing.proofChapter.receiptTitle}
            </p>
            <div className="border-t border-white/10">
              {signatures.map((s) => (
                <Signature key={s.label} trace={s.trace} label={s.label} />
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 font-mono-data text-[11px] text-white/30 space-y-1.5">
              <p>{t.landing.proofChapter.meta.recorder} · {shortKey(source?.recorder ?? "")}</p>
              <p>{t.landing.proofChapter.meta.program} · {shortKey("2cbYretd93guxpURxqhq1UedBtwSHzT2NX6MsrBc4FWc")}</p>
              <p>{t.landing.proofChapter.meta.cluster} · devnet</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══ CHAPTER 4 · YOUR TURN ═══ */

function YourTurn({ onTraceClick }: { onTraceClick: () => void }) {
  const { t } = useT();
  const [qr, setQr] = useState("");

  useEffect(() => {
    QRCode.toDataURL(TRACE_URL, {
      width: 220,
      margin: 1,
      color: { dark: "#0a1628", light: "#ffffff" },
    })
      .then(setQr)
      .catch(() => setQr(""));
  }, []);

  return (
    <section className="relative px-6 md:px-10 py-28 md:py-40 bg-[#0a1628] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-80 bg-ocean/[0.07] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <p className="font-mono-data text-xs tracking-[0.35em] uppercase text-ocean mb-6">
          {t.landing.yourTurn.kicker}
        </p>
        <h2 className="font-display text-4xl md:text-6xl font-light text-white leading-[1.05] mb-6">
          {t.landing.yourTurn.titleA} <em className="italic text-gold">{t.landing.yourTurn.titleEm}</em>
          <br />
          {t.landing.yourTurn.titleB}
        </h2>
        <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed mb-12">
          {t.landing.yourTurn.body}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
          {qr && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-3 rounded-2xl shadow-2xl shadow-black/50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt={`Trace ${STORY_LOT_CODE}`} className="w-40 h-40" />
            </motion.div>
          )}

          <div className="flex flex-col items-center sm:items-start gap-4">
            <button
              onClick={onTraceClick}
              className="px-8 py-4 rounded-xl bg-ocean text-white font-semibold hover:bg-ocean/80 transition-all shadow-lg shadow-ocean/25"
            >
              {t.landing.yourTurn.cta(STORY_LOT_CODE)}
            </button>
            <a
              href={PROGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-data text-xs text-white/40 hover:text-ocean transition-colors inline-flex items-center gap-1.5"
            >
              {t.landing.yourTurn.solscan}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ═══ THE VOYAGE · roadmap as a nautical chart ═══ */

/* The charted course: a winding sea route through five ports.
   Port coordinates must match the phase nodes in the cards below. */
const ROUTE =
  "M 60 210 C 140 70, 230 70, 300 185 C 370 300, 430 50, 520 125 C 610 200, 640 340, 760 265 C 880 190, 890 40, 1000 145 C 1065 215, 1100 160, 1140 185";

const PORTS = [
  { x: 60, y: 210 },
  { x: 300, y: 185 }, // active phase · "you are here"
  { x: 520, y: 125 },
  { x: 760, y: 265 },
  { x: 1000, y: 145 },
];

function Voyage() {
  const { t } = useT();
  const phases = t.landing.voyage.phases;
  const ref = useRef<HTMLElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  // fraction of the route where the ship stops (active port); measured on mount
  const [activeAt, setActiveAt] = useState(0.2);
  // the chart keeps a fixed 1200:400 aspect, so the CSS offset-path for the
  // ship just needs the route coordinates scaled to the rendered width
  const [chartScale, setChartScale] = useState(1);
  // CSS offset-path: path() has spotty support (notably older iOS Safari):
  // the ship only renders where the browser can actually sail it. Beam,
  // ports and the tag still tell the story everywhere.
  const [canSail, setCanSail] = useState(false);

  useEffect(() => {
    try {
      setCanSail(
        typeof CSS !== "undefined" &&
          CSS.supports("offset-path", 'path("M0 0 L10 10")')
      );
    } catch {
      setCanSail(false);
    }
  }, []);

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const update = () => setChartScale(el.clientWidth / 1200);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const scaledRoute = ROUTE.replace(/-?\d+(\.\d+)?/g, (m) =>
    `${parseFloat(m) * chartScale}`
  );

  useEffect(() => {
    const el = routeRef.current;
    if (!el) return;
    const L = el.getTotalLength();
    const target = PORTS[1];
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i <= 400; i++) {
      const f = i / 400;
      const p = el.getPointAtLength(f * L);
      const dd = (p.x - target.x) ** 2 + (p.y - target.y) ** 2;
      if (dd < bestDist) {
        bestDist = dd;
        best = f;
      }
    }
    setActiveAt(best);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "center 55%"],
  });
  const traveled = useTransform(scrollYProgress, [0, 1], [0, 1], {
    clamp: true,
  });
  const beamPathLength = useTransform(traveled, (t) => t * activeAt);
  const shipDistance = useTransform(traveled, (t) => `${t * activeAt * 100}%`);

  return (
    <section
      ref={ref}
      className="relative px-6 md:px-10 py-28 md:py-40 bg-[#081222] overflow-hidden"
    >
      {/* water ambience */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50rem] h-64 bg-ocean/[0.06] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <p className="font-mono-data text-xs tracking-[0.35em] uppercase text-ocean mb-4 text-center">
          {t.landing.voyage.kicker}
        </p>
        <h2 className="font-display text-4xl md:text-6xl font-light text-white text-center leading-[1.05] mb-16 md:mb-10">
          {t.landing.voyage.titleA} <em className="italic text-gold">{t.landing.voyage.titleEm}</em>
        </h2>

        {/* The chart */}
        <div ref={chartRef} className="relative w-full" style={{ aspectRatio: "1200 / 400" }}>
          <svg
            viewBox="0 0 1200 400"
            className="absolute inset-0 w-full h-full"
            fill="none"
            aria-hidden
          >
            {/* decorative waves */}
            <path
              d="M 0 360 C 100 340, 200 380, 300 360 S 500 340, 600 362 S 800 382, 900 360 S 1100 340, 1200 362"
              stroke="#3e96cc"
              strokeOpacity="0.08"
              strokeWidth="2"
            />
            <path
              d="M 0 385 C 120 370, 220 400, 340 385 S 540 368, 660 387 S 880 402, 1000 385 S 1120 370, 1200 388"
              stroke="#3e96cc"
              strokeOpacity="0.05"
              strokeWidth="2"
            />

            {/* compass rose */}
            <g transform="translate(1130 60)" opacity="0.15">
              <circle r="26" stroke="#ffffff" strokeWidth="1" strokeDasharray="2 5" />
              <circle r="2.5" fill="#ffffff" />
              <path d="M 0 -22 L 4 0 L 0 22 L -4 0 Z" fill="#ffffff" />
              <text
                y="-32"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="11"
                fontFamily="JetBrains Mono, monospace"
              >
                N
              </text>
            </g>

            {/* planned course: dotted chart line */}
            <path
              ref={routeRef}
              d={ROUTE}
              stroke="#ffffff"
              strokeOpacity="0.14"
              strokeWidth="2"
              strokeDasharray="1 9"
              strokeLinecap="round"
            />

            {/* traveled course: glowing ocean→gold beam */}
            <motion.path
              d={ROUTE}
              stroke="url(#voyageGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ pathLength: beamPathLength }}
            />
            <defs>
              <linearGradient id="voyageGradient" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#3e96cc" />
                <stop offset="1" stopColor="#ffc354" />
              </linearGradient>
            </defs>

            {/* ports */}
            {PORTS.map((p, i) => {
              const status = phases[i].status;
              return (
                <g key={i} transform={`translate(${p.x} ${p.y})`}>
                  {status === "active" && (
                    <motion.circle
                      r="7"
                      fill="none"
                      stroke="#3e96cc"
                      strokeWidth="1.5"
                      animate={{ r: [7, 16], opacity: [0.7, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}
                  <circle
                    r={status === "active" ? 6 : 5}
                    fill={status === "done" ? "#ffc354" : status === "active" ? "#3e96cc" : "#0f1e36"}
                    stroke={status === "upcoming" || status === "next" ? "rgba(255,255,255,0.25)" : "none"}
                    strokeWidth="1.5"
                  />
                  {status === "done" && (
                    <path
                      d="M -2.5 0 L -0.5 2.5 L 3 -2"
                      stroke="#081222"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* the ship: sails along the route, rotated with the current bearing */}
          {canSail && (
          <motion.div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={
              {
                offsetPath: `path("${scaledRoute}")`,
                offsetDistance: shipDistance,
                offsetRotate: "auto",
              } as unknown as React.CSSProperties
            }
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              <span className="absolute inline-flex w-6 h-6 -left-3 -top-3 rounded-full bg-gold/40 animate-ping" />
              <svg width="22" height="22" viewBox="0 0 22 22" className="relative drop-shadow-[0_0_10px_rgba(255,195,84,0.8)]">
                {/* little ship pointing +x, rides the route tangent */}
                <path d="M 19 11 L 3 4 L 7 11 L 3 18 Z" fill="#ffc354" />
              </svg>
            </div>
          </motion.div>
          )}

          {/* YOU ARE HERE tag at the active port (port 2 = 25% across, 185/400 down) */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="absolute"
            style={{ left: "25%", top: "46.25%", transform: "translate(-50%, -100%)" }}
          >
            <span className="font-mono-data text-[10px] tracking-[0.25em] uppercase text-ocean bg-ocean/10 border border-ocean/25 rounded-full px-3 py-1 whitespace-nowrap">
              {t.landing.voyage.youAreHere}
            </span>
          </motion.div>
        </div>

        {/* Phase cards: snap-scroll row on phones, 5 columns on desktop */}
          <div className="flex md:grid md:grid-cols-5 gap-4 md:gap-4 mt-10 md:mt-16 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {phases.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="relative min-w-[240px] sm:min-w-[280px] md:min-w-0 snap-center shrink-0 md:shrink"
            >
              <span
                aria-hidden
                className={`font-display italic text-6xl leading-none absolute -top-8 left-0 select-none ${
                  p.status === "active"
                    ? "text-ocean/30"
                    : p.status === "done"
                      ? "text-gold/20"
                      : "text-white/[0.06]"
                }`}
              >
                {p.n}
              </span>
              <div className="relative pt-8">
                <p
                  className={`font-semibold text-sm mb-1 ${
                    p.status === "active" ? "text-white" : p.status === "done" ? "text-white/85" : "text-white/40"
                  }`}
                >
                  {p.title}
                </p>
                <p className="font-mono-data text-[11px] text-white/30 mb-3">{p.dates}</p>
                <p
                  className={`font-mono-data text-[11px] tracking-[0.2em] uppercase ${
                    p.status === "done"
                      ? "text-gold"
                      : p.status === "active"
                        ? "text-ocean"
                        : p.status === "next"
                          ? "text-white/40"
                          : "text-white/20"
                  }`}
                >
                  {p.status === "done" && t.landing.voyage.statusLabels.done}
                  {p.status === "active" && t.landing.voyage.statusLabels.active}
                  {p.status === "next" && t.landing.voyage.statusLabels.next}
                  {p.status === "upcoming" && t.landing.voyage.statusLabels.upcoming}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ EXPANSION · where the lanes lead next ═══ */

function Expansion() {
  const { t } = useT();
  return (
    <section className="relative px-6 md:px-10 py-28 md:py-40 bg-[#08101f] overflow-hidden border-t border-white/[0.06]">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-10">
          <p className="font-mono-data text-xs tracking-[0.35em] uppercase text-ocean mb-4">
            {t.landing.expansion.kicker}
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-light text-white leading-[1.05] mb-6">
            {t.landing.expansion.titleA} <em className="italic text-gold">{t.landing.expansion.titleEm}</em>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed">
            {t.landing.expansion.body}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
        >
          <LazySection minHeight={420}>
            <ExpansionMap />
          </LazySection>
        </motion.div>

        <div className="text-center mt-10">
          <StampButton href="https://x.com/Trx_Tra">{t.landing.expansion.cta}</StampButton>
        </div>
      </div>
    </section>
  );
}

/* ═══ PARTNERS · full-bleed marquee with edge fades ═══ */

const partners = [
  "/partner/BK START.png",
  "/partner/IEC.png",
  "/partner/NExus.png",
  "/partner/SPT.png",
  "/partner/superteam-logo-white.svg",
];

function PartnerStrip() {
  const { t } = useT();
  return (
    <div>
      <p className="font-mono-data text-[11px] tracking-[0.3em] uppercase text-white/30 text-center mb-10">
        {t.landing.epilogue.partnersLabel}
      </p>
      <div
        className="overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        }}
      >
        <div className="flex w-max animate-scroll" style={{ animationDuration: "40s" }}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-14 md:gap-20 pr-14 md:pr-20" aria-hidden={copy === 1}>
              {partners.map((logo, i) => (
                <div key={`${copy}-${i}`} className="flex-shrink-0 h-9 md:h-11 flex items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo}
                    alt=""
                    draggable={false}
                    className="h-full w-auto max-w-[140px] object-contain opacity-50 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ EPILOGUE · recognition, crew ═══ */

const team = [
  { name: "Tron", image: "/team-mascot/Blockchain.png", twitter: "https://x.com/Trx_Tra" },
  { name: "Chow", image: "/team-mascot/BA.png", twitter: "https://x.com/ChowThanks" },
  { name: "Hoang", image: "/team-mascot/Graph.png", twitter: "" },
  { name: "Duy", image: "/team-mascot/Web-app.png", twitter: "https://x.com/DanDuy4" },
];

const AWARD_ICONS = [Trophy, Trophy, Trophy];
const AWARD_COLORS = ["text-gold", "text-gold", "text-gold"];

function Epilogue() {
  const { t } = useT();
  return (
    <section className="relative px-6 md:px-10 py-20 bg-[#081222] border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto">
        <PartnerStrip />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20 pt-14 border-t border-white/[0.06]">
          {/* Recognition */}
          <div>
            <p className="font-mono-data text-[11px] tracking-[0.3em] uppercase text-white/30 mb-5">
              {t.landing.epilogue.recognitionLabel}
            </p>
            <div className="space-y-4">
              {t.landing.epilogue.recognition.map((award, i) => {
                const Icon = AWARD_ICONS[i];
                return (
                  <div key={i} className="flex items-start gap-3">
                    <Icon className={`w-4 h-4 mt-1 flex-shrink-0 ${AWARD_COLORS[i]}`} />
                    <div>
                      <p className="text-white font-medium text-sm">{award.title}</p>
                      <p className="text-white/35 text-xs mt-0.5">{award.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team */}
          <div>
            <p className="font-mono-data text-[11px] tracking-[0.3em] uppercase text-white/30 mb-5">
              {t.landing.epilogue.crewLabel}
            </p>
            <div className="flex flex-wrap gap-5">
              {team.map((member) => (
                <div key={member.name} className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full border border-white/10 overflow-hidden bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover scale-125" />
                  </div>
                  {member.twitter ? (
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/50 hover:text-white text-xs transition-colors"
                    >
                      {member.name}
                    </a>
                  ) : (
                    <span className="text-white/50 text-xs">{member.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══ PAGE ═══ */

export default function LandingPage() {
  const router = useRouter();

  const handleTraceClick = () => {
    router.push(`/explorer/${STORY_LOT_CODE}`);
  };

  return (
    <div className="flex flex-col min-h-full">
      <Hero />
      <TheCatch />
      <TheFactory />
      <TheProof />
      <YourTurn onTraceClick={handleTraceClick} />
      <Voyage />
      <Expansion />
      <Epilogue />
    </div>
  );
}
