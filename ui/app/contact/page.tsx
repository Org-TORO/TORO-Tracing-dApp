"use client";

import { useState } from "react";
import { useT } from "@/src/lib/i18n";

export default function ContactPage() {
  const { t } = useT();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", company: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#0a1628] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-32">
        <div className="w-full max-w-2xl">
          {status === "success" ? (
            <div className="text-center">
              <p className="font-mono-data text-xs tracking-[0.35em] uppercase text-ocean mb-4">
                {t.contact.kicker}
              </p>
              <h1 className="font-display text-4xl md:text-5xl font-light text-white mb-4">
                {t.contact.success.title}
              </h1>
              <p className="text-white/50 text-lg leading-relaxed">
                {t.contact.success.body}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <p className="font-mono-data text-xs tracking-[0.35em] uppercase text-ocean mb-3">
                  {t.contact.kicker}
                </p>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-white leading-[1.05] mb-6">
                  {t.contact.titleA}{" "}
                  <em className="italic text-gold">{t.contact.titleEm}</em>{" "}
                  {t.contact.titleB}
                </h1>
                <p className="text-white/50 text-lg leading-relaxed max-w-lg">
                  {t.contact.body}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-mono-data tracking-[0.2em] uppercase text-white/35 mb-2">
                      {t.contact.labels.name}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={t.contact.form.namePlaceholder}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-ocean/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono-data tracking-[0.2em] uppercase text-white/35 mb-2">
                      {t.contact.labels.email}
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder={t.contact.form.emailPlaceholder}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-ocean/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono-data tracking-[0.2em] uppercase text-white/35 mb-2">
                    {t.contact.labels.company}
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder={t.contact.form.companyPlaceholder}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-ocean/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono-data tracking-[0.2em] uppercase text-white/35 mb-2">
                    {t.contact.labels.message}
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={t.contact.form.messagePlaceholder}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white placeholder-white/25 focus:outline-none focus:border-ocean/50 transition-colors resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-red-400 text-sm">
                    {t.contact.error.body}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group inline-flex -rotate-1 hover:rotate-0 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="border border-gold/50 rounded-lg p-[3px] group-hover:border-gold/80 transition-colors duration-300">
                    <span className="flex items-center gap-3 border border-gold/25 rounded-[5px] px-7 py-3.5 bg-gold/[0.04] group-hover:bg-gold/10 transition-colors duration-300">
                      <span className="font-mono-data text-[13px] tracking-[0.25em] uppercase text-gold">
                        {status === "sending" ? t.contact.form.sending : t.contact.form.submit}
                      </span>
                    </span>
                  </span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
