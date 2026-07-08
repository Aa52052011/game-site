"use client";

import Image from "next/image";
import { siteConfig } from "@/lib/config";
import Logo from "@/components/Logo";
import { useLanguage } from "@/components/LanguageProvider";
import { trackRegisterClick, trackUserAction } from "@/lib/analytics";

export default function Hero() {
  const { t, name } = useLanguage();

  return (
    <section className="relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="mb-2">
              <Logo className="h-12 w-auto md:h-16" />
            </div>
            <h1 className="sr-only">{name}</h1>
            <p className="text-gray-200 mt-4 text-lg md:text-xl drop-shadow">
              {t.hero.tagline}
            </p>
            <p className="text-gray-300 mt-2 drop-shadow">{t.hero.description}</p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
              <a
                href={siteConfig.registerUrl}
                target="_blank"
                rel="noopener noreferrer"
                onPointerDown={() => trackRegisterClick("hero")}
                className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-xl text-lg font-medium transition-colors"
              >
                {t.hero.register}
              </a>
              <a
                href="#screenshots"
                onClick={() => trackUserAction("view_screenshots", "hero")}
                className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-xl text-lg font-medium transition-colors"
              >
                {t.hero.moments}
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl shadow-blue-900/30">
              <Image
                src={siteConfig.cover}
                alt={`${name} ${t.hero.coverAlt}`}
                width={800}
                height={450}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
