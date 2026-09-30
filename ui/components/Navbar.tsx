"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useT } from "@/src/lib/i18n";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { locale, setLocale, t } = useT();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide navbar on explorer detail pages (QR-scan phone view)
  if (pathname.startsWith("/explorer/")) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a1628]/70 backdrop-blur-md border-b border-white/[0.06]"
          : "bg-[#0a1628]/40 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 no-underline">
          <img
            src="/Logo_darkbg2.png"
            alt="TORO"
            className="h-10 w-auto object-contain"
          />
          <span className="text-xl font-semibold tracking-tight text-white hidden sm:inline">
            TORO
          </span>
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link
            href="/"
            className={`transition-colors no-underline font-medium ${
              pathname === "/"
                ? "text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            {t.nav.home}
          </Link>
          <Link
            href="/explorer"
            className={`transition-colors no-underline font-medium ${
              pathname === "/explorer"
                ? "text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            {t.nav.explorer}
          </Link>
          <a
            href="/#docs"
            className="transition-colors no-underline font-medium text-white/50 hover:text-white"
          >
            {t.nav.docs}
          </a>
          <a
            href="/#about"
            className="transition-colors no-underline font-medium text-white/50 hover:text-white"
          >
            {t.nav.about}
          </a>
          <a
            href="/#team"
            className="transition-colors no-underline font-medium text-white/50 hover:text-white"
          >
            {t.nav.team}
          </a>
          <Link
            href="/trustgraph"
            className={`transition-colors no-underline font-medium ${
              pathname === "/trustgraph"
                ? "text-white"
                : "text-white/50 hover:text-white"
            }`}
          >
            {t.nav.reviewGraph}
          </Link>
        </div>

        {/* Right CTAs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLocale(locale === "en" ? "vi" : "en")}
            className="font-mono-data text-xs tracking-[0.2em] text-white/50 hover:text-white border border-white/[0.08] hover:border-white/20 rounded-lg px-3 py-2 transition-all"
            aria-label="Switch language"
          >
            {locale === "en" ? "VI" : "EN"}
          </button>
          <a
            href="https://solscan.io/account/2cbYretd93guxpURxqhq1UedBtwSHzT2NX6MsrBc4FWc?cluster=devnet"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex px-4 py-2 rounded-lg border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20 transition-all text-sm font-medium no-underline"
          >
            {t.nav.contracts}
          </a>
          <Link
            href="/explorer"
            className="px-5 py-2 rounded-lg bg-ocean text-white font-medium text-sm hover:bg-ocean/80 transition-colors no-underline"
          >
            {t.nav.startTracing}
          </Link>
        </div>
      </div>
    </nav>
  );
}
