"use client";

import { siteConfig } from "@/lib/config";
import { useLanguage } from "@/components/LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="section-divider bg-black/60 backdrop-blur-md py-8 text-center text-gray-400 text-sm">
      <p>
        © {new Date().getFullYear()} {siteConfig.name}. {t.footer.copyright}
      </p>
    </footer>
  );
}
