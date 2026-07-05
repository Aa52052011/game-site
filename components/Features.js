"use client";

import { useLanguage } from "@/components/LanguageProvider";

export default function Features() {
  const { t, tf } = useLanguage();

  return (
    <section className="py-16 section-divider">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-2">{t.features.title}</h2>
        <p className="text-gray-300 text-center mb-10">
          {tf(t.features.subtitle)}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {t.features.items.map((f) => (
            <div
              key={f.title}
              className="bg-[#1a3a6b] rounded-2xl p-6 md:p-8 hover:bg-[#1e4280] transition-colors"
            >
              <h3 className="text-xl font-bold text-white">{f.title}</h3>
              <p className="text-white/90 text-sm md:text-base mt-4 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
