import Link from "next/link";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import ScreenshotGallery from "@/components/ScreenshotGallery";
import { siteConfig } from "@/lib/config";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <ScreenshotGallery />

      <section className="py-16 border-t border-gray-900">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">准备好开始了吗？</h2>
          <p className="text-gray-500 mt-2">免费下载，即刻畅玩</p>
          <Link
            href="/download"
            className="inline-block mt-6 bg-blue-500 hover:bg-blue-600 px-10 py-4 rounded-xl text-lg font-medium transition-colors"
          >
            ⬇ 立即下载 {siteConfig.name}
          </Link>
        </div>
      </section>
    </main>
  );
}
