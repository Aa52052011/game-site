import "./globals.css";
import { siteConfig } from "@/lib/config";
import { getSiteUrl } from "@/lib/site-url";
import { translations, defaultLocale } from "@/lib/i18n/translations";
import { LanguageProvider } from "@/components/LanguageProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const defaultT = translations[defaultLocale];
const siteUrl = getSiteUrl();

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: `${siteConfig.name} — ${defaultT.meta.title}`,
  description: defaultT.meta.description,
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: "/logo.svg",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant" suppressHydrationWarning>
      <body className="antialiased text-white">
        <LanguageProvider>
          <div className="site-overlay" aria-hidden="true" />
          <div className="relative z-10">
            <Nav />
            {children}
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
