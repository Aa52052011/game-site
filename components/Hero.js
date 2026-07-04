import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-black to-purple-950/30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block text-sm text-blue-400 bg-blue-950/50 border border-blue-800/50 px-3 py-1 rounded-full mb-4">
              现已开放下载
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              🎮 {siteConfig.name}
            </h1>
            <p className="text-gray-400 mt-4 text-lg md:text-xl">
              {siteConfig.tagline}
            </p>
            <p className="text-gray-500 mt-2">{siteConfig.description}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/download"
                className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-xl text-lg font-medium transition-colors"
              >
                ⬇ 立即下载
              </Link>
              <a
                href="#screenshots"
                className="border border-gray-700 hover:border-gray-500 px-8 py-3 rounded-xl text-lg transition-colors"
              >
                查看截图
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden border border-gray-800 shadow-2xl shadow-blue-900/20">
              <iframe
                src={siteConfig.video.embedUrl}
                title={`${siteConfig.name} 宣传视频`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-700 hidden md:block">
              <Image
                src={siteConfig.video.poster}
                alt="游戏封面"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
