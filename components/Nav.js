"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/LanguageProvider";
import { trackNavClick } from "@/lib/analytics";

export default function Nav() {
  const { t } = useLanguage();

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <nav className="border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link
          href="/"
          onClick={() => trackNavClick("/", "logo")}
          className="flex items-center shrink-0"
        >
          <Logo className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-4 sm:gap-6 text-sm">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => trackNavClick(href, label)}
              className="text-gray-300 hover:text-white transition-colors whitespace-nowrap"
            >
              {label}
            </Link>
          ))}
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
