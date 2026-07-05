import Link from "next/link";
import "./globals.css";
import { siteConfig } from "@/lib/config";
import Logo from "@/components/Logo";

export const metadata = {
  title: `${siteConfig.name} — 官方网站`,
  description: siteConfig.description,
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: "/logo.svg",
  },
};

function Nav() {
  const links = [
    { href: "/", label: "首页" },
    { href: "/download", label: "下载" },
    { href: "/contact", label: "联系" },
  ];

  return (
    <nav className="border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo className="h-8 w-auto" />
        </Link>
        <div className="flex gap-6 text-sm">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-gray-300 hover:text-white transition-colors"
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
    <footer className="section-divider bg-black/60 backdrop-blur-md py-8 text-center text-gray-400 text-sm">
      <p>© {new Date().getFullYear()} {siteConfig.name}. 保留所有权利。</p>
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased text-white">
        <div className="site-overlay" aria-hidden="true" />
        <div className="relative z-10">
          <Nav />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
