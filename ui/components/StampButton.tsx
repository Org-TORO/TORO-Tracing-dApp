"use client";

/* TORO's signature button: the custody stamp.
   Double-ring border like a passport / chain-of-custody stamp, mono type,
   a hand-stamped tilt that presses straight on hover.
   Reuse anywhere a primary call-to-action appears. */

import { ReactNode } from "react";

export default function StampButton({
  href,
  children,
  external = true,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group inline-flex -rotate-1 hover:rotate-0 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
    >
      {/* outer ring */}
      <span className="border border-gold/50 rounded-lg p-[3px] group-hover:border-gold/80 transition-colors duration-300">
        {/* inner ring */}
        <span className="flex items-center gap-3 border border-gold/25 rounded-[5px] px-7 py-3.5 bg-gold/[0.04] group-hover:bg-gold/10 transition-colors duration-300">
          <span className="font-mono-data text-[13px] tracking-[0.25em] uppercase text-gold">
            {children}
          </span>
        </span>
      </span>
    </a>
  );
}
