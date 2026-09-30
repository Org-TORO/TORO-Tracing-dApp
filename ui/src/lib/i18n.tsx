"use client";

/* Locale provider: English (default) + Vietnamese, persisted in localStorage.
   Dictionaries live in src/locales/<domain>.ts; each exports `en` and a
   `vi: typeof en`, so TypeScript enforces identical keys across languages.
   Usage: const { t, locale, setLocale } = useT();  →  t.landing.hero.scrollCue */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { en as landingEn, vi as landingVi } from "@/src/locales/landing";
import { en as navEn, vi as navVi } from "@/src/locales/nav";
import { en as traceEn, vi as traceVi } from "@/src/locales/trace";
import { en as graphEn, vi as graphVi } from "@/src/locales/graph";
import { en as storyEn, vi as storyVi } from "@/src/locales/story";

export type Locale = "en" | "vi";

const en = { ...landingEn, ...navEn, ...traceEn, ...graphEn, ...storyEn };
const vi = { ...landingVi, ...navVi, ...traceVi, ...graphVi, ...storyVi };

export type Dict = typeof en;

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dict;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  setLocale: () => {},
  t: en,
});

const STORAGE_KEY = "toro-locale";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // restore preference after mount (avoids hydration mismatch)
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "vi") setLocaleState(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale: setLocaleState, t: locale === "vi" ? vi : en }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  return useContext(I18nContext);
}
