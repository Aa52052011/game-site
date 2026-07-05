"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";
import {
  defaultLocale,
  interpolate,
  locales,
  translations,
} from "@/lib/i18n/translations";

const STORAGE_KEY = "site-locale";

const LanguageContext = createContext(null);

function getPageTitle(pathname, t, name) {
  if (pathname === "/contact") return `${t.contact.metaTitle} — ${name}`;
  return `${name} — ${t.meta.title}`;
}

function getPageDescription(pathname, t, name) {
  if (pathname === "/contact") return interpolate(t.contact.metaDescription, { name });
  return t.meta.description;
}

export function LanguageProvider({ children }) {
  const pathname = usePathname();
  const [locale, setLocaleState] = useState(defaultLocale);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && locales.includes(saved)) {
      setLocaleState(saved);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale === "zh-TW" ? "zh-Hant" : "en";

    const t = translations[locale];
    const name = siteConfig.name;
    document.title = getPageTitle(pathname, t, name);

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", getPageDescription(pathname, t, name));
  }, [locale, ready, pathname]);

  const setLocale = (next) => {
    if (locales.includes(next)) setLocaleState(next);
  };

  const t = translations[locale];

  const value = {
    locale,
    setLocale,
    t,
    ready,
    name: siteConfig.name,
    tf: (text, vars = {}) => interpolate(text, { name: siteConfig.name, ...vars }),
  };

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
