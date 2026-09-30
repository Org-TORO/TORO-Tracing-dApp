"use client";

import { usePathname } from "next/navigation";
import { useT } from "@/src/lib/i18n";
import Footer from "./Footer";

function TraceFooter() {
  const { t } = useT();
  return (
    <footer className="bg-[#0a1628] border-t border-white/[0.06]">
      <div className="sm:max-w-[540px] sm:mx-auto px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <img src="/Logo_darkbg2.png" alt="TORO" className="h-6 w-auto object-contain" />
          <span className="text-sm font-semibold text-white">TORO</span>
        </div>
        <p className="text-white/40 text-xs mb-2">{t.footer.traceTagline}</p>
        <p className="text-white/30 text-[10px]">© {new Date().getFullYear()} TORO. {t.footer.rights}</p>
      </div>
    </footer>
  );
}

export default function FooterWrapper() {
  const pathname = usePathname();
  const isTrace = pathname?.startsWith("/explorer");
  if (isTrace) return <TraceFooter />;
  return <Footer />;
}
