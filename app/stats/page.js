"use client";

import { useCallback, useEffect, useState } from "react";

function StatCard({ label, value, hint }) {
  return (
    <div className="content-card p-5">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      {hint ? <p className="text-gray-500 text-xs mt-2">{hint}</p> : null}
    </div>
  );
}

function eventLabel(name) {
  const map = {
    page_view: "页面访问",
    register_click: "注册点击",
    promo_copy: "复制促销码",
    nav_click: "导航点击",
    language_switch: "切换语言",
    external_click: "外链点击",
    user_action: "用户操作",
    page_engagement: "页面停留",
    scroll_depth: "滚动深度",
  };
  return map[name] || name;
}

export default function StatsPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = useCallback(async () => {
    const res = await fetch("/api/stats", { cache: "no-store" });
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    const json = await res.json();
    if (json.ok) {
      setAuthed(true);
      setData(json.data);
    }
  }, []);

  useEffect(() => {
    loadStats().finally(() => setLoading(false));
    const timer = setInterval(loadStats, 5000);
    return () => clearInterval(timer);
  }, [loadStats]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/stats/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "登录失败");
      return;
    }
    setPassword("");
    await loadStats();
  };

  const handleLogout = async () => {
    await fetch("/api/stats/login", { method: "DELETE" });
    setAuthed(false);
    setData(null);
  };

  const handleReset = async () => {
    if (!window.confirm("确定要清空所有统计数据吗？此操作不可恢复。")) return;

    const res = await fetch("/api/stats/reset", { method: "POST" });
    const json = await res.json();
    if (!res.ok) {
      window.alert(json.error || "清空失败");
      return;
    }
    await loadStats();
  };

  if (loading) {
    return (
      <main className="min-h-screen py-16 px-6">
        <div className="max-w-5xl mx-auto text-center text-gray-400">加载中…</div>
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="min-h-screen py-16 px-6">
        <div className="max-w-md mx-auto content-card p-8">
          <h1 className="text-2xl font-bold">数据统计</h1>
          <p className="text-gray-400 text-sm mt-2">请输入管理密码查看访问与点击数据</p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="管理密码"
              className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 outline-none focus:border-blue-400"
            />
            {error ? <p className="text-red-400 text-sm">{error}</p> : null}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 rounded-xl py-3 font-medium transition-colors"
            >
              登录
            </button>
          </form>
        </div>
      </main>
    );
  }

  const t = data?.totals || {};
  const today = data?.today || {};

  return (
    <main className="min-h-screen py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">数据统计</h1>
            <p className="text-gray-400 text-sm mt-1">
              每 5 秒自动刷新
              {data?.updatedAt
                ? ` · 最后更新 ${new Date(data.updatedAt).toLocaleTimeString("zh-TW")}`
                : ""}
              {data?.eventCount !== undefined ? ` · 已记录 ${data.eventCount} 条事件` : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-sm text-blue-300 hover:text-blue-200 border border-blue-400/30 rounded-lg px-4 py-2 disabled:opacity-50"
            >
              {refreshing ? "刷新中…" : "立即刷新"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-red-300 hover:text-red-200 border border-red-400/30 rounded-lg px-4 py-2"
            >
              清空数据
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-white border border-white/15 rounded-lg px-4 py-2"
            >
              退出登录
            </button>
          </div>
        </div>

        {!data?.configured ? (
          <div className="content-card p-4 text-amber-300 text-sm">
            尚未配置 Vercel Blob 存储，数据暂时无法持久保存。请在 Vercel 项目中创建 Blob Store 并重新部署。
          </div>
        ) : null}

        <section>
          <h2 className="text-lg font-semibold mb-4">今日概览</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="今日访问" value={today.pageViews ?? 0} />
            <StatCard label="今日独立访客" value={today.uniqueVisitors ?? 0} />
            <StatCard label="今日注册点击" value={today.registerClicks ?? 0} />
            <StatCard label="今日促销码复制" value={today.promoCopy ?? 0} />
            <StatCard label="今日总事件" value={today.totalEvents ?? 0} hint="含访问、点击、滚动等" />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">累计数据</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="总访问量" value={t.pageViews ?? 0} />
            <StatCard label="注册点击" value={t.registerClicks ?? 0} hint={`Hero ${t.registerHero ?? 0} · CTA ${t.registerCta ?? 0}`} />
            <StatCard label="促销码复制" value={t.promoCopy ?? 0} />
            <StatCard label="平均停留 (秒)" value={t.avgEngagementSeconds ?? 0} />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">用户行为</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="导航点击" value={t.navClicks ?? 0} />
            <StatCard label="查看截图" value={t.viewScreenshots ?? 0} />
            <StatCard label="语言切换" value={t.languageSwitch ?? 0} />
            <StatCard label="Telegram 点击" value={t.telegramClicks ?? 0} />
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">滚动深度（累计触发次数）</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[25, 50, 75, 100].map((depth) => (
              <StatCard
                key={depth}
                label={`${depth}%`}
                value={data?.scrollDepth?.[depth] ?? 0}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">各页面访问</h2>
          <div className="content-card divide-y divide-white/10">
            {Object.entries(data?.pageViews || {}).map(([path, count]) => (
              <div key={path} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="text-gray-300">{path}</span>
                <span className="font-mono text-blue-300">{count}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">最近事件</h2>
          <div className="content-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="text-left px-4 py-3 font-medium">时间</th>
                  <th className="text-left px-4 py-3 font-medium">事件</th>
                  <th className="text-left px-4 py-3 font-medium">详情</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentEvents || []).slice(0, 30).map((item, index) => (
                  <tr key={`${item.at}-${index}`} className="border-b border-white/5">
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                      {new Date(item.at).toLocaleString("zh-TW")}
                    </td>
                    <td className="px-4 py-3">{eventLabel(item.event)}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                      {JSON.stringify(item.params || {})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
