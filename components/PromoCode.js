"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/config";
import { useLanguage } from "@/components/LanguageProvider";
import { trackPromoCopy } from "@/lib/analytics";

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export default function PromoCode() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const code = siteConfig.promoCode;

  const handleCopy = async () => {
    try {
      await copyText(code);
      trackPromoCopy("promo_banner");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <section className="py-10 section-divider">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-lg md:text-xl font-semibold text-white drop-shadow">
          {t.promo.label}
        </p>

        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="group flex items-center gap-3 bg-[#1a3a6b] hover:bg-[#1e4280] border border-blue-400/30 rounded-xl px-6 py-3 transition-colors"
            aria-label={t.promo.copy}
          >
            <code className="text-xl md:text-2xl font-mono font-bold text-blue-300 tracking-wide">
              {code}
            </code>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
              {copied ? t.promo.copied : t.promo.copy}
            </span>
          </button>
        </div>

        <p className="text-gray-300 text-sm mt-4 drop-shadow">{t.promo.hint}</p>
      </div>
    </section>
  );
}
