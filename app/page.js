"use client";

import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ScreenshotGallery from "@/components/ScreenshotGallery";
import { siteConfig } from "@/lib/config";
import { useLanguage } from "@/components/LanguageProvider";

export default function Home() {
  const { t, tf } = useLanguage();

  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <ScreenshotGallery />

      <section className="py-16 section-divider">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">{t.cta.title}</h2>
          <p className="text-gray-500 mt-2">{t.cta.subtitle}</p>
          <a
            href={siteConfig.registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-blue-500 hover:bg-blue-600 px-10 py-4 rounded-xl text-lg font-medium transition-colors"
          >
            {tf(t.cta.button)}
          </a>
        </div>
      </section>
    </main>
  );
}
