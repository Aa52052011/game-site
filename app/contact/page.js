import { siteConfig } from "@/lib/config";

export const metadata = {
  title: `联系我们 — ${siteConfig.name}`,
  description: `联系 ${siteConfig.name} 团队，获取支持与商务合作信息`,
};

export default function Contact() {
  const { contact } = siteConfig;

  return (
    <main className="min-h-screen py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold">📩 联系我们</h1>
        <p className="text-gray-400 mt-3">
          有问题、反馈或商务合作需求？欢迎随时联系我们。
        </p>

        <div className="mt-8 space-y-4">
          <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-xl">
            <p className="text-gray-400 text-sm">邮箱</p>
            <a href={`mailto:${contact.email}`} className="mt-1 block hover:text-blue-400 transition-colors">
              {contact.email}
            </a>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-xl">
            <p className="text-gray-400 text-sm">Telegram</p>
            <p className="mt-1">{contact.telegram}</p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 p-5 rounded-xl">
            <p className="text-gray-400 text-sm">Discord</p>
            <a
              href={contact.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block hover:text-blue-400 transition-colors"
            >
              {contact.discord}
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-8">
          <h2 className="text-xl font-semibold mb-2">🤝 商务合作</h2>
          <p className="text-gray-400 text-sm">
            媒体采访、渠道合作、授权洽谈，请发送邮件至{" "}
            <a href={`mailto:${contact.business}`} className="text-white hover:text-blue-400">
              {contact.business}
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
