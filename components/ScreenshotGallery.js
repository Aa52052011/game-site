"use client";

import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { useLanguage } from "@/components/LanguageProvider";

export default function ScreenshotGallery() {
  const { t } = useLanguage();

  return (
    <section id="screenshots" className="py-16 section-divider">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-2">{t.screenshots.title}</h2>
        <p className="text-gray-500 text-center mb-10">{t.screenshots.subtitle}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {siteConfig.screenshots.map((shot, i) => (
            <div
              key={shot.src}
              className="content-card overflow-hidden hover:border-blue-400/40 transition-colors group"
            >
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={640}
                  height={360}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  priority={i < 2}
                />
              </div>
              {shot.title && (
                <p className="px-3 py-2 text-sm text-gray-300 truncate">
                  {shot.title}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
