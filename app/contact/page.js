import { siteConfig } from "@/lib/config";

export const metadata = {
  title: `联系我们 — ${siteConfig.name}`,
  description: `通过 Telegram 联系 ${siteConfig.name} 团队`,
};

export default function Contact() {
  const { contact } = siteConfig;

  return (
    <main className="min-h-screen py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold">📩 联系我们</h1>
        <p className="text-gray-400 mt-3">
          有问题、反馈或合作需求？欢迎通过 Telegram 联系我们。
        </p>

        <div className="mt-8">
          <div className="content-card p-5">
            <p className="text-gray-400 text-sm">Telegram</p>
            <a
              href={contact.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block hover:text-blue-400 transition-colors"
            >
              {contact.telegram}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
