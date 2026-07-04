"use client";

import { QRCodeSVG } from "qrcode.react";
import { siteConfig } from "@/lib/config";

const colorMap = {
  green: "border-green-800/50 bg-green-950/20",
  blue: "border-blue-800/50 bg-blue-950/20",
  purple: "border-purple-800/50 bg-purple-950/20",
};

export default function DownloadQR() {
  const platforms = [
    { key: "android", ...siteConfig.downloads.android },
    { key: "ios", ...siteConfig.downloads.ios },
    { key: "pc", ...siteConfig.downloads.pc },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {platforms.map((p) => (
        <div
          key={p.key}
          className={`border rounded-xl p-6 flex flex-col items-center ${colorMap[p.color]}`}
        >
          <div className="bg-white p-3 rounded-lg">
            <QRCodeSVG value={p.url} size={140} level="M" />
          </div>
          <p className="mt-4 font-medium text-center">{p.label}</p>
          <p className="text-gray-500 text-xs mt-1 text-center break-all">
            扫码或点击下载
          </p>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-sm text-blue-400 hover:text-blue-300 underline"
          >
            直接下载 →
          </a>
        </div>
      ))}
    </div>
  );
}
