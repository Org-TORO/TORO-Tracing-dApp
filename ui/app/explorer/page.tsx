"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useT } from "@/src/lib/i18n";
import traceIndex from "@/src/data/traceIndex.json";

const DEMO_LOTS = Object.keys(traceIndex.lots).slice(0, 5);

export default function ExplorerPage() {
  const { t } = useT();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/explorer/${searchQuery.trim()}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col bg-[#0a1628] pt-20">
      <section className="relative px-6 md:px-10 py-24 md:py-32 bg-gradient-to-b from-[#0c1f3a] to-[#0a1628]">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-0 w-96 h-96 bg-ocean/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-mono-data text-xs tracking-[0.35em] uppercase text-ocean mb-6">
              {t.trace.search.kicker}
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 leading-[1.05]">
              {t.trace.search.title}
            </h1>
            <p className="text-lg md:text-xl text-white/50 mb-12">
              {t.trace.search.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              className={`relative max-w-2xl mx-auto transition-all duration-300 ${
                isFocused ? "scale-105" : "scale-100"
              }`}
            >
              <div className="relative flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.1] hover:border-white/[0.2] transition-all duration-300 backdrop-blur-sm">
                <button
                  onClick={handleSearch}
                  className="flex-shrink-0 text-ocean hover:text-white transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder={t.trace.search.placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none text-lg"
                />
              </div>
            </div>

            {DEMO_LOTS.length > 0 && (
              <div className="mt-8">
                <p className="font-mono-data text-[11px] tracking-[0.25em] uppercase text-white/30 mb-3">
                  {t.trace.search.demoLabel}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {DEMO_LOTS.map((code) => (
                    <button
                      key={code}
                      onClick={() => router.push(`/explorer/${code}`)}
                      className="font-mono-data text-xs px-4 py-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-ocean/50 hover:bg-ocean/10 transition-all"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
