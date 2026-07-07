"use client";

import { localeLabels, locales } from "@/lib/i18n/translations";
import { useLanguage } from "@/components/LanguageProvider";
import { trackLanguageSwitch } from "@/lib/analytics";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <label className="relative shrink-0">
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(event) => {
          const next = event.target.value;
          setLocale(next);
          trackLanguageSwitch(next);
        }}
        className="appearance-none rounded-lg border border-white/15 bg-black/30 pl-2.5 pr-7 py-1.5 text-xs text-gray-200 cursor-pointer hover:border-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50 max-w-[9.5rem] sm:max-w-none truncate"
        aria-label="Select language"
      >
        {locales.map((code) => (
          <option key={code} value={code} className="bg-gray-900 text-white">
            {localeLabels[code]}
          </option>
        ))}
      </select>
      <span
        className="pointer-events-none absolute inset-y-0 end-2 flex items-center text-gray-400"
        aria-hidden="true"
      >
        ▾
      </span>
    </label>
  );
}
