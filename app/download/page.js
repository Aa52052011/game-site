import DownloadQR from "@/components/DownloadQR";
import { siteConfig } from "@/lib/config";

export const metadata = {
  title: `下载 — ${siteConfig.name}`,
  description: `下载 ${siteConfig.name}，支持 Android、iOS 和 PC 平台`,
};

const btnColors = {
  green: "bg-green-600 hover:bg-green-700",
  blue: "bg-blue-600 hover:bg-blue-700",
  purple: "bg-purple-600 hover:bg-purple-700",
};

export default function Download() {
  const platforms = [
    { key: "android", icon: "📱", ...siteConfig.downloads.android },
    { key: "ios", icon: "🍎", ...siteConfig.downloads.ios },
    { key: "pc", icon: "💻", ...siteConfig.downloads.pc },
  ];

  return (
    <main className="min-h-screen py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold">⬇ 下载游戏</h1>
        <p className="text-gray-400 mt-3">选择你的平台，扫码或点击链接即可下载</p>

        <div className="mt-10 space-y-4">
          {platforms.map((p) => (
            <a
              key={p.key}
              className={`block ${btnColors[p.color]} p-4 rounded-xl transition-colors`}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {p.icon} {p.label}
            </a>
          ))}
        </div>

        <div className="mt-14">
          <h2 className="text-2xl font-semibold mb-6 text-center">📱 扫码下载</h2>
          <DownloadQR />
        </div>

        <div className="mt-14 border-t border-gray-800 pt-8">
          <h2 className="text-xl font-semibold mb-4">📋 更新日志</h2>
          <ul className="space-y-4">
            {siteConfig.changelog.map((entry) => (
              <li key={entry.version} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-blue-400">{entry.version}</span>
                  <span className="text-gray-500 text-sm">{entry.date}</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">{entry.notes}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
