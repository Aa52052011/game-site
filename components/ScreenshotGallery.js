import Image from "next/image";
import { siteConfig } from "@/lib/config";

export default function ScreenshotGallery() {
  return (
    <section id="screenshots" className="py-16 border-t border-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-2">游戏截图</h2>
        <p className="text-gray-500 text-center mb-10">一睹精彩游戏画面</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {siteConfig.screenshots.map((shot, i) => (
            <div
              key={shot.src}
              className="aspect-[9/16] md:aspect-video rounded-xl overflow-hidden border border-gray-800 hover:border-blue-600/50 transition-colors group"
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                width={400}
                height={711}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                priority={i < 2}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
