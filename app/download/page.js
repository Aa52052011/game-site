"use client";

import DownloadQR from "@/components/DownloadQR";
import { siteConfig } from "@/lib/config";
import { useLanguage } from "@/components/LanguageProvider";

const btnColors = {
  green: "bg-green-600 hover:bg-green-700",
  blue: "bg-blue-600 hover:bg-blue-700",
  purple: "bg-purple-600 hover:bg-purple-700",
};

export default function Download() {
  const { t } = useLanguage();

  const platforms = [
    { key: "android", icon: "📱", ...siteConfig.downloads.android, label: t.download.platforms.android },
    { key: "ios", icon: "🍎", ...siteConfig.downloads.ios, label: t.download.platforms.ios },
    { key: "pc", icon: "💻", ...siteConfig.downloads.pc, label: t.download.platforms.pc },
  ];

  return (
    <main className="min-h-screen py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold">⬇ {t.download.title}</h1>
        <p className="text-gray-400 mt-3">{t.download.subtitle}</p>

        <div className="mt-10 space-y-4">
          {platforms.map((p) => (
            <a
              key={p.key}
              className={`block ${btnColors[p.color]} p-4 rounded-xl transition-colors`}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {p.icon} {p.label}
            </a>
          ))}
        </div>

        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-6 text-center">📱 {t.download.qrTitle}</h2>
          <DownloadQR />
        </div>

        <div className="mt-14 border-t border-gray-800 pt-8">
          <h2 className="text-xl font-semibold mb-4">📋 {t.download.changelog}</h2>
          <ul className="space-y-4">
            {t.download.changelogItems.map((entry) => (
              <li key={entry.version} className="content-card p-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-blue-400">{entry.version}</span>
                  <span className="text-gray-500 text-sm">{entry.date}</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">{entry.notes}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
