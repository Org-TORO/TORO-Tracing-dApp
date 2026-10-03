"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { fetchProductLot, explorerUrl } from "@/src/lib/trace";
import type { ProductLot, TraceStage } from "@/src/lib/trace";
import { useT } from "@/src/lib/i18n";
import type { Locale } from "@/src/lib/i18n";

function getDetail(traces: TraceStage[], stage: number, key: string): string {
  const t = traces.find((x) => x.stage === stage);
  const v = t?.details?.[key];
  return typeof v === "string" || typeof v === "number" ? String(v) : "…";
}

function fmtDate(ts: number, locale: Locale): string {
  if (!ts) return "…";
  const d = new Date(ts * 1000);
  return d.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US");
}

const STAGE_STYLE = [
  { num: 1, color: "bg-blue-600", icon: "fa-ship" },
  { num: 2, color: "bg-cyan-600", icon: "fa-boxes-stacked" },
  { num: 3, color: "bg-green-600", icon: "fa-industry" },
  { num: 4, color: "bg-orange-500", icon: "fa-warehouse" },
  { num: 5, color: "bg-purple-600", icon: "fa-truck-fast" },
];

const shortSig = (s: string, a = 6, b = 6) =>
  s.length > a + b + 1 ? `${s.slice(0, a)}…${s.slice(-b)}` : s;
const shortKey = (s: string) => shortSig(s, 6, 6);
const withUnit = (v: string, unit: string) => (v === "…" ? v : v + unit);

export default function TraceDetailClient() {
  const params = useParams();
  const id = params.id as string;
  const { t, locale } = useT();
  const td = t.trace.detail;

  const [product, setProduct] = useState<ProductLot | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrUrl, setQrUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeBatchIdx, setActiveBatchIdx] = useState(0);

  useEffect(() => {
    document.title = `TORO Trace · ${id}`;
    loadProduct();
    if (typeof window !== "undefined") {
      QRCode.toDataURL(window.location.href, { width: 164, margin: 2, color: { dark: "#0f2a5f", light: "#ffffff" } })
        .then(setQrUrl)
        .catch(() => setQrUrl(""));
    }
  }, [id]);

  async function loadProduct() {
    setLoading(true);
    try {
      const lot = await fetchProductLot(id);
      setProduct(lot);
    } catch (e) {
      console.error("Failed to load product:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setActiveBatchIdx(0);
    setCopied(false);
  }, [id]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="w-10 h-10 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    const uv = td.unverified;
    return (
      <div className="relative min-h-screen bg-[#0a1628] sm:py-10">
        {/* ambient ocean glow behind the phone sheet */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[640px] h-[640px] bg-ocean/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold/[0.06] rounded-full blur-3xl" />
        </div>
        <div className="relative sm:max-w-[540px] sm:mx-auto sm:rounded-[32px] sm:overflow-hidden sm:border sm:border-white/10 sm:shadow-[0_0_90px_rgba(62,150,204,0.18)] min-h-screen sm:min-h-0 bg-[#0a1628]">
          {/* Header */}
          <div className="sticky top-0 z-40 px-4 py-4 border-b border-white/[0.06] bg-[#0a1628]/80 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <a href="/explorer" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
                <i className="fa-solid fa-arrow-left" />
                {td.back}
              </a>
              <span className="text-white/40 text-xs font-mono-data">{id}</span>
            </div>
          </div>

          {/* Light content area */}
          <div className="bg-[#e9eef5] px-4 pb-12 pt-8">
            <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-xl text-center">
              <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-2xl">
                <i className="fa-solid fa-triangle-exclamation" />
              </div>
              <p className="text-amber-600 text-[11px] tracking-[2px] font-bold mb-2">
                {uv.kicker}
              </p>
              <h1 className="text-[#0f172a] text-xl sm:text-2xl font-extrabold leading-snug mb-4">
                {uv.title}
              </h1>
              <p className="text-slate-500 text-[11px] font-bold tracking-wide mb-1">
                {uv.scannedCode}
              </p>
              <p className="font-mono-data text-[#0f172a] text-lg font-bold break-words mb-4">
                {id}
              </p>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {uv.body(id)}
              </p>

              <div className="text-left bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
                <p className="text-[#0f172a] text-sm font-extrabold mb-3">
                  {uv.cautionTitle}
                </p>
                <ul className="space-y-2.5">
                  {uv.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-slate-600 text-sm leading-relaxed">
                      <span className="w-5 h-5 mt-0.5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-slate-400 text-[11px] leading-relaxed mb-6">
                {uv.disclaimer}
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href="/explorer"
                  className="w-full py-3 rounded-xl bg-[#0f2a5f] text-white text-sm font-bold hover:bg-[#0f2a5f]/90 transition-colors"
                >
                  {uv.backToExplorer}
                </a>
                <a
                  href="/explorer/TORO-01"
                  className="w-full py-3 rounded-xl bg-white text-[#0f2a5f] text-sm font-bold border border-slate-200 hover:border-[#0f2a5f]/40 transition-colors"
                >
                  {uv.tryDemo}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stageMeta = STAGE_STYLE.map((s, i) => ({ ...s, ...td.stages[i] }));

  const batch = product.batches[Math.min(activeBatchIdx, product.batches.length - 1)];
  const batchTrace = batch?.trace || [];
  const lotTrace = product.lotTraces || [];

  const custody = td.custodyLabels.map((label, i) => ({
    label,
    trace: (i < 3 ? batchTrace : lotTrace).find((x) => x.stage === i + 1),
  }));
  const recorder = custody.map((c) => c.trace?.recorder).find(Boolean);

  const kpi = [
    { icon: "fa-regular fa-calendar", title: td.kpi.departure, value: fmtDate(product.packagingDate, locale) },
    { icon: "fa-solid fa-fish", title: td.kpi.productType, value: td.kpi.cannedTuna },
    { icon: "fa-solid fa-water", title: td.kpi.species, value: getDetail(batchTrace, 1, "Fish Species") },
    { icon: "fa-solid fa-location-dot", title: td.kpi.region, value: getDetail(batchTrace, 1, "Region") },
  ];

  const certs = [
    { key: "HACCP Certified", label: "HACCP", icon: "fa-circle-check" },
    { key: "FDA Approved", label: "FDA", icon: "fa-shield" },
    { key: "Lab Test Passed", label: "LAB TEST", icon: "fa-vial-circle-check" },
  ].filter((c) => (batchTrace[0]?.details?.[c.key] as string)?.includes("✓"));

  return (
    <div className="relative min-h-screen bg-[#0a1628] sm:py-10">
      {/* ambient ocean glow behind the phone sheet (tablet/desktop only;
          on phones the passport stays fullscreen for the QR-scan flow) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[640px] h-[640px] bg-ocean/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold/[0.06] rounded-full blur-3xl" />
      </div>
      <div className="relative sm:max-w-[540px] sm:mx-auto sm:rounded-[32px] sm:overflow-hidden sm:border sm:border-white/10 sm:shadow-[0_0_90px_rgba(62,150,204,0.18)] min-h-screen sm:min-h-0 bg-[#0a1628]">
        {/* Header */}
        <div className="sticky top-0 z-40 px-4 py-4 border-b border-white/[0.06] bg-[#0a1628]/80 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <a href="/explorer" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
              <i className="fa-solid fa-arrow-left" />
              {td.back}
            </a>
            <span className="text-white/40 text-xs">{id}</span>
          </div>
        </div>

        {/* Light content area */}
        <div className="bg-[#e9eef5]">
          {/* Hero */}
          <section className="relative bg-gradient-to-b from-[#001f5c] via-[#01296f] to-[#01337e] pt-10 pb-32 px-6 text-center overflow-hidden">
            <div className="absolute w-80 h-80 rounded-full bg-white/[0.04] -top-44 -right-28" />
            <div className="absolute w-60 h-60 rounded-full bg-white/[0.03] -bottom-36 -left-28" />
            <div className="relative z-10">
              <img src="/Logo_darkbg.png" alt="TORO" className="w-16 h-auto mx-auto mb-4 opacity-90" />
              <p className="text-[#c7d2fe] text-[11px] tracking-[2px] font-medium mb-2">{td.heroEyebrow}</p>
              <h1 className="text-white text-xl font-extrabold leading-relaxed">
                {td.heroTitle[0]}<br />{td.heroTitle[1]}
              </h1>
            </div>
          </section>

          {/* Content */}
          <div className="px-4 pb-12 -mt-24">

          {/* Floating Card */}
          <div className="relative z-20 bg-white rounded-[28px] p-6 shadow-xl">
            <div className="flex items-center gap-2.5 mb-5 text-green-600 text-sm font-bold">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs">
                <i className="fa-solid fa-check" />
              </div>
              {td.verified}
            </div>
            <div className="flex justify-between items-start gap-6">
              <div className="flex-1 min-w-0">
                <p className="text-slate-500 text-xs font-bold tracking-wide mb-2">{td.traceCode}</p>
                <p className="text-[#0f172a] text-2xl font-extrabold leading-tight mb-5 break-words">
                  {id}
                </p>
                {qrUrl && (
                  <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-white">
                    <img src={qrUrl} alt="QR" className="w-full h-full" />
                  </div>
                )}
                <button
                  onClick={copyLink}
                  className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <i className={`fa-regular ${copied ? "fa-circle-check" : "fa-copy"}`} />
                  {copied ? td.copiedLink : td.copyLink}
                </button>
              </div>
              <div className="w-36 h-28 rounded-[22px] overflow-hidden shadow-lg border-4 border-white flex-shrink-0 bg-white flex items-center justify-center">
                <img src="/tuna_on_can.png" alt="Tuna" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 mb-8">
            {kpi.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 min-h-[120px] text-center shadow-sm flex flex-col justify-center">
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-base">
                  <i className={item.icon} />
                </div>
                <p className="text-slate-400 text-[10px] leading-relaxed mb-1">{item.title}</p>
                <p className="text-[#0f172a] text-sm leading-relaxed font-bold">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Section Title */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2a5f]">{td.journeyTitle}</h2>
            {/* Batch selector */}
            {product.batches.length > 1 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {product.batches.map((b, i) => (
                    <button
                      key={b.batchId}
                      onClick={() => setActiveBatchIdx(i)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                        i === activeBatchIdx
                          ? "bg-[#0f2a5f] text-white shadow-sm"
                          : "bg-white text-[#0f2a5f] border border-slate-200 hover:border-[#0f2a5f]/40"
                      }`}
                    >
                      {b.batchId}
                    </button>
                  ))}
                </div>
                <p className="text-slate-400 text-[11px] mt-2">
                  {td.batchHint(product.batches.length)}
                </p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="relative pl-16 pr-0 sm:pl-20 pb-4">
            <div className="absolute left-[38px] sm:left-[46px] top-0 bottom-0 w-0.5 bg-[#d7dee8]" />

            {stageMeta.map((stage, idx) => {
              const trace =
                stage.num <= 3
                  ? batchTrace.find((t) => t.stage === stage.num)
                  : lotTrace.find((t) => t.stage === stage.num);

              return (
                <div key={idx} className="relative mb-6">
                  <div
                    className={`absolute left-[-50px] sm:left-[-58px] top-4 w-11 h-11 sm:w-12 sm:h-12 rounded-full ${stage.color} flex items-center justify-center text-white text-lg border-4 border-[#e9eef5] shadow-md z-10`}
                  >
                    <i className={`fa-solid ${stage.icon}`} />
                  </div>
                  <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <h3 className="text-base sm:text-lg font-extrabold text-[#0f2a5f] mb-5">
                      {idx + 1}. {stage.title} <span className="text-slate-500">({stage.en})</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {stage.num === 1 && (
                        <>
                          <Detail label={td.labels.sourceType} value={getDetail(batchTrace, 1, "Source Type")} t={td} />
                          <Detail label={td.labels.fishSpecies} value={getDetail(batchTrace, 1, "Fish Species")} t={td} />
                          <Detail label={td.labels.catchDate} value={getDetail(batchTrace, 1, "Catch Date")} t={td} />
                          <Detail label={td.labels.fishingMethod} value={getDetail(batchTrace, 1, "Fishing Method")} t={td} />
                          <Detail label={td.labels.catchArea} value={getDetail(batchTrace, 1, "Catch Area")} t={td} />
                          <Detail label={td.labels.catchWeight} value={withUnit(getDetail(batchTrace, 1, "Catch Weight (kg)"), " kg")} t={td} />
                        </>
                      )}
                      {stage.num === 2 && (
                        <>
                          <Detail label={td.labels.receivedDate} value={getDetail(batchTrace, 2, "Inventory Received")} t={td} />
                          <Detail label={td.labels.storageLocation} value={getDetail(batchTrace, 2, "Inventory Location")} t={td} />
                        </>
                      )}
                      {stage.num === 3 && (
                        <>
                          <Detail label={td.labels.factory} value={getDetail(batchTrace, 3, "Factory Name")} t={td} />
                          <Detail label={td.labels.batchCode} value={batch?.batchId || "…"} t={td} />
                          <Detail label={td.labels.productionDate} value={getDetail(batchTrace, 3, "Production Date")} t={td} />
                          <Detail label={td.labels.packagingDate} value={getDetail(lotTrace, 3, "Packaging Date")} t={td} />
                          <Detail label={td.labels.inputWeight} value={withUnit(getDetail(batchTrace, 3, "Input Weight (kg)"), " kg")} t={td} />
                          <Detail label={td.labels.outputCans} value={getDetail(batchTrace, 3, "Output Cans")} t={td} />
                        </>
                      )}
                      {stage.num === 4 && (
                        <>
                          <Detail label={td.labels.coldStorage} value={getDetail(lotTrace, 4, "Warehouse Name")} t={td} />
                          <Detail label={td.labels.storageStart} value={getDetail(lotTrace, 4, "Storage Start")} t={td} />
                          <Detail label={td.labels.storageEnd} value={getDetail(lotTrace, 4, "Storage End")} t={td} />
                          <Detail label={td.labels.temperature} value={withUnit(getDetail(lotTrace, 4, "Storage Temp (°C)"), "°C")} t={td} />
                        </>
                      )}
                      {stage.num === 5 && (
                        <>
                          <Detail label={td.labels.shipmentCode} value={getDetail(lotTrace, 5, "Shipment Code")} t={td} />
                          <Detail label={td.labels.departure} value={getDetail(lotTrace, 5, "Departure Date")} t={td} />
                          <Detail label={td.labels.arrival} value={getDetail(lotTrace, 5, "Arrival Date")} t={td} />
                        </>
                      )}
                    </div>

                    {stage.num === 3 && certs.length > 0 && (
                      <div className="mt-6 pt-5 border-t border-gray-200">
                        <p className="text-center text-sm font-extrabold text-[#0f2a5f] mb-4">{td.certsTitle}</p>
                        <div className="flex flex-wrap justify-center gap-3">
                          {certs.map((c, ci) => (
                            <div key={c.key} className="bg-slate-50 rounded-xl py-3 px-2 text-center">
                              <i className={`fa-solid ${c.icon} text-green-600 text-base mb-2`} />
                              <div className="text-green-600 text-xs font-bold">{td.certLabels[ci] ?? c.label}</div>
                              <small className="block mt-1 text-slate-400 text-[10px]">{td.certified}</small>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {trace?.txHash && (
                      <a
                        href={explorerUrl(trace.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-4 text-xs text-blue-600 font-semibold hover:underline"
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                        {td.viewTx}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}

          </div>

          {/* Chain of custody */}
          <div className="bg-[#0a1628] rounded-3xl p-6 shadow-sm">
              <div className="mb-1">
                <p className="text-[10px] tracking-[2px] font-bold text-white/40">{td.custodyTitle}</p>
              </div>
              <p className="font-display italic text-xl text-white mb-5">{td.custodySubtitle}</p>
              <div className="border-t border-white/10">
                {custody.map((c) =>
                  c.trace?.txHash ? (
                    <a
                      key={c.label}
                      href={explorerUrl(c.trace.txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 py-3 border-b border-white/[0.07]"
                    >
                      <span className="text-xs text-white/55 group-hover:text-white/85 transition-colors">
                        {c.label}
                      </span>
                      <span className="font-mono-data text-[11px] text-ocean inline-flex items-center gap-1.5">
                        {shortSig(c.trace.txHash)}
                        <i className="fa-solid fa-arrow-up-right-from-square text-[9px]" />
                      </span>
                    </a>
                  ) : (
                    <div
                      key={c.label}
                      className="flex items-center justify-between gap-3 py-3 border-b border-white/[0.07]"
                    >
                      <span className="text-xs text-white/55">{c.label}</span>
                      <span className="text-[11px] text-white/25">{td.notRecorded}</span>
                    </div>
                  )
                )}
              </div>
              <div className="mt-5 font-mono-data text-[10px] text-white/30 space-y-1.5">
                <p>{td.recorderLabel} · {recorder ? shortKey(recorder) : "…"}</p>
                <p>{td.programLabel} · {shortKey("2cbYretd93guxpURxqhq1UedBtwSHzT2NX6MsrBc4FWc")}</p>
                <p>{td.networkLabel} · {td.networkValue}</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

function Detail({ label, value, t }: { label: string; value: string; t: { notRecorded: string } }) {
  if (value === "…") {
    return (
      <div>
        <p className="text-slate-500 text-xs mb-1 font-semibold">{label}</p>
        <p className="text-slate-400 text-xs leading-relaxed font-medium">
          <i className="fa-regular fa-clock mr-1" />
          {t.notRecorded}
        </p>
      </div>
    );
  }
  return (
    <div>
      <p className="text-slate-500 text-xs mb-1 font-semibold">{label}</p>
      <p className="text-[#0f172a] text-sm leading-relaxed font-bold">{value}</p>
    </div>
  );
}
