import Link from "next/link";
import "./globals.css";
import { siteConfig } from "@/lib/config";

export const metadata = {
  title: `${siteConfig.name} — 官方网站`,
  description: siteConfig.description,
};

function Nav() {
  const links = [
    { href: "/", label: "首页" },
    { href: "/download", label: "下载" },
    { href: "/contact", label: "联系" },
  ];

  return (
    <nav className="border-b border-gray-800 bg-black/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-white">
          🎮 {siteConfig.name}
        </Link>
        <div className="flex gap-6 text-sm">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-900 py-8 text-center text-gray-500 text-sm">
      <p>© {new Date().getFullYear()} {siteConfig.name}. 保留所有权利。</p>
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased bg-black text-white">
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
