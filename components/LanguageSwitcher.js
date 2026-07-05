"use client";

import { localeLabels, locales } from "@/lib/i18n/translations";
import { useLanguage } from "@/components/LanguageProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-white/15 bg-black/30 p-0.5 text-xs">
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          className={`px-2.5 py-1 rounded-md transition-colors ${
            locale === code
              ? "bg-blue-500 text-white font-medium"
              : "text-gray-400 hover:text-white"
          }`}
          aria-pressed={locale === code}
        >
          {localeLabels[code]}
        </button>
      ))}
    </div>
  );
}
