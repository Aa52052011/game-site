"use client";

import { siteConfig } from "@/lib/config";
import { useLanguage } from "@/components/LanguageProvider";
import { trackExternalClick } from "@/lib/analytics";

export default function Contact() {
  const { t } = useLanguage();
  const { contact } = siteConfig;

  return (
    <main className="min-h-screen py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold">📩 {t.contact.title}</h1>
        <p className="text-gray-400 mt-3">{t.contact.subtitle}</p>

        <div className="mt-8">
          <div className="content-card p-5">
            <p className="text-gray-400 text-sm">{t.contact.telegram}</p>
            <a
              href={contact.telegram}
              target="_blank"
              rel="noopener noreferrer"
              onPointerDown={() => trackExternalClick("telegram", "contact")}
              className="mt-1 block hover:text-blue-400 transition-colors"
            >
              {contact.telegram}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
