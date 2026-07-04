import { siteConfig } from "@/lib/config";

export default function Features() {
  return (
    <section className="py-16 border-t border-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-2">核心卖点</h2>
        <p className="text-gray-500 text-center mb-10">为什么选择 {siteConfig.name}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.features.map((f) => (
            <div
              key={f.title}
              className="bg-gray-900/60 border border-gray-800 p-6 rounded-xl hover:border-gray-600 transition-colors"
            >
              <span className="text-3xl">{f.icon}</span>
              <h3 className="text-lg font-semibold mt-3">{f.title}</h3>
              <p className="text-gray-400 text-sm mt-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
