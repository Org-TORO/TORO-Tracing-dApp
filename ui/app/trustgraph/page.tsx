"use client";

import { motion } from "framer-motion";
import {
  Gift,
  Gavel,
  Wallet,
  Network,
} from "lucide-react";
import TrustGraphSimulator from "@/components/TrustGraphSimulator";
import { useT } from "@/src/lib/i18n";

const Math = ({ children }: { children: React.ReactNode }) => (
  <span className="font-serif italic font-semibold text-ocean">{children}</span>
);

export default function TrustGraphPage() {
  const { t } = useT();
  const g = t.graph;
  return (
    <div className="flex flex-col min-h-full bg-[#0a1628]">
      {/* ─── HERO ─── */}
      <section className="relative px-6 py-16 md:py-20 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-ocean/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <p className="mb-4 text-sm md:text-base text-gold/90 font-medium tracking-wide uppercase">
            {g.hero.notice}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            <span className="text-ocean">T</span>rust
            <span className="text-ocean">G</span>raph{" "}
            <span className="text-gold">Protocol 2.0</span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-3xl mx-auto leading-relaxed">
            {g.hero.subtitle}
          </p>
        </motion.div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT: Interactive Simulator */}
        <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24 self-start">
          <TrustGraphSimulator />
        </div>

        {/* RIGHT: Whitepaper Content */}
        <div className="lg:col-span-7">
          {/* ═══ Section I ═══ */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white border-b-2 border-ocean pb-2 mb-5">
              {g.s1.title}
            </h2>
            <p className="text-white/60 mb-4 leading-relaxed">
              {g.s1.p1a}
              <strong className="text-white">
                {g.s1.gigo}
              </strong>{" "}
              {g.s1.p1b}
              <strong className="text-white">{g.s1.zeroTrust}</strong>
              {g.s1.p1c}
            </p>
            <div className="bg-ocean/5 border-l-4 border-ocean p-4 text-white/70 rounded-r-lg">
              {g.s1.q1}
              <em>{g.s1.evidenceLayer}</em>{g.s1.q2}
              <strong className="text-white">{g.s1.graphEngine}</strong>
              {g.s1.q3}
              <strong className="text-white">{g.s1.riskEngine}</strong>
              {g.s1.q4}
            </div>
          </motion.section>

          {/* ═══ Section II ═══ */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white border-b-2 border-ocean pb-2 mb-6">
              {g.s2.title}
            </h2>
            <p className="text-white/60 mb-6 leading-relaxed">
              {g.s2.intro}
            </p>

            {/* Layer 1 */}
            <div className="mb-6 ml-4 relative">
              <div className="absolute -left-8 top-1 w-6 h-6 bg-surface-light text-white rounded-full flex items-center justify-center text-xs font-bold border border-white/10">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {g.s2.l1.heading}
              </h3>
              <p className="text-white/50 mb-2 leading-relaxed">
                {g.s2.l1.intro}
              </p>
              <ul className="list-disc list-inside space-y-1 text-white/60 ml-2 leading-relaxed">
                <li>
                  <strong className="text-white">{g.s2.l1.poaLabel}</strong>
                  {g.s2.l1.poa}
                </li>
                <li>
                  <strong className="text-white">{g.s2.l1.ruleLabel}</strong>
                  {g.s2.l1.rule}
                </li>
                <li>
                  <strong className="text-white">{g.s2.l1.dagLabel}</strong>
                  {g.s2.l1.dag}
                </li>
              </ul>
            </div>

            {/* Layer 2 */}
            <div className="mb-6 ml-4 relative bg-ocean/5 p-5 rounded-xl border border-ocean/20">
              <div className="absolute -left-4 -top-3 w-8 h-8 bg-ocean text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                2
              </div>
              <h3 className="text-lg font-bold text-ocean mb-2">
                {g.s2.l2.heading}
              </h3>
              <p className="text-white/50 mb-2 leading-relaxed">
                {g.s2.l2.intro}
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/60 ml-2 leading-relaxed">
                <li>
                  <span className="text-amber-400 font-semibold">
                    {g.s2.l2.collusionLabel}
                  </span>
                  {g.s2.l2.collusion}
                </li>
                <li>
                  <span className="text-amber-400 font-semibold">
                    {g.s2.l2.pairLabel}
                  </span>
                  {g.s2.l2.pair}
                </li>
                <li>
                  <span className="text-amber-400 font-semibold">
                    {g.s2.l2.linkLabel}
                  </span>
                  {g.s2.l2.link}
                </li>
              </ul>
            </div>

            {/* Layer 3 */}
            <div className="mb-6 ml-4 relative bg-purple-500/5 p-5 rounded-xl border border-purple-500/20">
              <div className="absolute -left-4 -top-3 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                3
              </div>
              <h3 className="text-lg font-bold text-purple-400 mb-2">
                {g.s2.l3.heading}
              </h3>
              <p className="text-white/50 mb-2 leading-relaxed">
                {g.s2.l3.intro}
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/60 ml-2 leading-relaxed">
                <li>
                  <strong className="text-white">{g.s2.l3.weightsLabel}</strong>
                  {g.s2.l3.weights}
                </li>
                <li>
                  <strong className="text-white">
                    {g.s2.l3.riskLabel}<Math>R<sub>i</sub></Math>{g.s2.l3.riskSuffix}
                  </strong>{" "}
                  {g.s2.l3.riskDesc}
                </li>
                <li>
                  <strong className="text-white">
                    {g.s2.l3.trustLabel}<Math>T<sub>i</sub></Math>{g.s2.l3.trustSuffix}
                  </strong>{" "}
                  {g.s2.l3.trustDesc}
                </li>
                <li>
                  <strong className="text-white">{g.s2.l3.killLabel}</strong>{" "}
                  {g.s2.l3.killDesc1}
                  <Math>R<sub>i</sub> = MAX</Math>
                  {g.s2.l3.killDesc2}
                </li>
              </ul>
            </div>

            {/* Layer 4 */}
            <div className="mb-6 ml-4 relative">
              <div className="absolute -left-8 top-1 w-6 h-6 bg-surface-light text-white rounded-full flex items-center justify-center text-xs font-bold border border-white/10">
                4
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {g.s2.l4.heading}
              </h3>
              <p className="text-white/50 mb-3 leading-relaxed">
                {g.s2.l4.intro}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-lg">
                  <div className="font-bold text-emerald-400 mb-1 text-sm">
                    {g.s2.l4.greenTitle}
                  </div>
                  <div className="text-xs text-white/50 leading-relaxed">
                    {g.s2.l4.greenD1}<Math>R<sub>i</sub></Math>{g.s2.l4.greenD2}
                    <Math>T<sub>i</sub></Math>{g.s2.l4.greenD3}
                  </div>
                </div>
                <div className="bg-amber-500/5 border border-amber-500/20 p-3 rounded-lg">
                  <div className="font-bold text-amber-400 mb-1 text-sm">
                    {g.s2.l4.yellowTitle}
                  </div>
                  <div className="text-xs text-white/50 leading-relaxed">
                    {g.s2.l4.yellowD1}<Math>R<sub>i</sub></Math>{g.s2.l4.yellowD2}
                  </div>
                </div>
                <div className="bg-red-500/5 border border-red-500/20 p-3 rounded-lg">
                  <div className="font-bold text-red-400 mb-1 text-sm">
                    {g.s2.l4.redTitle}
                  </div>
                  <div className="text-xs text-white/50 leading-relaxed">
                    {g.s2.l4.redD1}<Math>T<sub>i</sub></Math>{g.s2.l4.redD2}
                  </div>
                </div>
              </div>
            </div>

            {/* Layer 5 */}
            <div className="mb-6 ml-4 relative">
              <div className="absolute -left-8 top-1 w-6 h-6 bg-surface-light text-white rounded-full flex items-center justify-center text-xs font-bold border border-white/10">
                5
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {g.s2.l5.heading}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-white/60 ml-2 leading-relaxed">
                <li>
                  {g.s2.l5.li1}
                </li>
                <li>
                  <strong className="text-white">{g.s2.l5.oracleLabel}</strong>
                  {g.s2.l5.li2}
                </li>
              </ul>
            </div>
          </motion.section>

          {/* ═══ Section III ═══ */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white border-b-2 border-ocean pb-2 mb-4">
              {g.s3.title}
            </h2>
            <p className="text-white/60 mb-3 leading-relaxed">
              {g.s3.intro}
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <Gift className="w-5 h-5 text-emerald-400 mt-1 mr-3 flex-shrink-0" />
                <div className="text-white/60 leading-relaxed">
                  <strong className="text-white">{g.s3.rewardsLabel}</strong>
                  {g.s3.rewards1}
                  <Math>T<sub>i</sub></Math>
                  {g.s3.rewards2}
                </div>
              </div>
              <div className="flex items-start">
                <Gavel className="w-5 h-5 text-red-400 mt-1 mr-3 flex-shrink-0" />
                <div className="text-white/60 leading-relaxed">
                  <strong className="text-white">{g.s3.slashLabel}</strong>
                  {g.s3.slash}
                </div>
              </div>
            </div>
          </motion.section>

          {/* ═══ Section IV ═══ */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white border-b-2 border-ocean pb-2 mb-4">
              {g.s4.title}
            </h2>
            <p className="text-white/60 mb-4 leading-relaxed">
              {g.s4.intro}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:border-ocean/30 transition-all duration-300">
                <div className="text-center mb-4">
                  <div className="w-14 h-14 bg-ocean/10 text-ocean rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                    <Network className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-white">
                    {g.s4.b2b.title}
                  </h3>
                </div>
                <ul className="list-disc list-inside text-sm text-white/50 space-y-2 leading-relaxed">
                  <li>
                    {g.s4.b2b.li1}
                  </li>
                  <li>
                    {g.s4.b2b.li2a}
                    <em>
                      {g.s4.b2b.quote}
                    </em>
                  </li>
                </ul>
              </div>

              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 hover:border-gold/30 transition-all duration-300">
                <div className="text-center mb-4">
                  <div className="w-14 h-14 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-white">
                    {g.s4.defi.title}
                  </h3>
                </div>
                <ul className="list-disc list-inside text-sm text-white/50 space-y-2 leading-relaxed">
                  <li>
                    {g.s4.defi.li1}
                  </li>
                  <li>
                    {g.s4.defi.li2a}<Math>T<sub>i</sub></Math>{g.s4.defi.li2b}
                  </li>
                  <li>
                    {g.s4.defi.li3}
                  </li>
                </ul>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
