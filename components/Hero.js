import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import Logo from "@/components/Logo";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block text-sm text-blue-300 content-card px-3 py-1 mb-4">
              现已开放下载
            </span>
            <div className="mb-2">
              <Logo className="h-12 md:h-16 w-auto" />
            </div>
            <h1 className="sr-only">{siteConfig.name}</h1>
            <p className="text-gray-200 mt-4 text-lg md:text-xl drop-shadow">
              {siteConfig.tagline}
            </p>
            <p className="text-gray-300 mt-2 drop-shadow">{siteConfig.description}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/download"
                className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-xl text-lg font-medium transition-colors"
              >
                ⬇ 立即下载
              </Link>
              <a
                href="#screenshots"
                className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-xl text-lg font-medium transition-colors"
              >
                精彩瞬间
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl shadow-blue-900/30">
              <Image
                src={siteConfig.cover}
                alt={`${siteConfig.name} 游戏封面`}
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
