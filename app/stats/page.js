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
  const [showPassword, setShowPassword] = useState(false);
  const [configHint, setConfigHint] = useState(null);

  useEffect(() => {
    fetch("/api/stats/login", { cache: "no-store" })
      .then((res) => res.json())
      .then((json) => {
        if (json.ok) setConfigHint(json);
      })
      .catch(() => {});
  }, []);

  const loadStats = useCallback(async () => {
    const res = await fetch(`/api/stats?_=${Date.now()}`, {
      cache: "no-store",
      credentials: "include",
    });
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    if (!res.ok) {
      setError("登录成功，但加载统计数据失败，请点击立即刷新重试。");
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
    const trimmed = password.trim();
    const res = await fetch("/api/stats/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password: trimmed }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "登录失败");
      return;
    }
    setPassword("");
    setAuthed(true);
    await loadStats();
  };

  const handleLogout = async () => {
    await fetch("/api/stats/login", { method: "DELETE", credentials: "include" });
    setAuthed(false);
    setData(null);
  };

  const handleReset = async () => {
    if (!window.confirm("确定要清空所有统计数据吗？此操作不可恢复。")) return;

    const res = await fetch("/api/stats/reset", { method: "POST", credentials: "include" });
    const json = await res.json();
    if (!res.ok) {
      window.alert(json.error || "清空失败");
      return;
    }

    setError("");
    setData((prev) =>
      prev
        ? {
            ...prev,
            totals: {
              pageViews: 0,
              registerClicks: 0,
              registerHero: 0,
              registerCta: 0,
              promoCopy: 0,
              navClicks: 0,
              languageSwitch: 0,
              telegramClicks: 0,
              viewScreenshots: 0,
              avgEngagementSeconds: 0,
            },
            today: {
              pageViews: 0,
              registerClicks: 0,
              promoCopy: 0,
              navClicks: 0,
              languageSwitch: 0,
              telegramClicks: 0,
              viewScreenshots: 0,
              pageEngagement: 0,
              scrollDepth: 0,
              totalEvents: 0,
              uniqueVisitors: 0,
              byEvent: {},
            },
            scrollDepth: { 25: 0, 50: 0, 75: 0, 100: 0 },
            pageViews: {},
            recentEvents: [],
            eventCount: 0,
            updatedAt: new Date().toISOString(),
          }
        : prev
    );
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
          {configHint?.configured ? (
            <p className="text-gray-500 text-xs mt-2">
              服务器端密码长度：{configHint.passwordLength} 个字符
              {!configHint.hasSessionSecret ? "（缺少 STATS_SESSION_SECRET）" : ""}
            </p>
          ) : null}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="管理密码"
                className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-3 pe-16 outline-none focus:border-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 end-3 my-auto px-2 text-xs text-gray-400 hover:text-white transition-colors"
                aria-label={showPassword ? "隐藏密码" : "显示密码"}
              >
                {showPassword ? "隐藏" : "显示"}
              </button>
            </div>
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
            <p className="text-gray-500 text-xs mt-1">
              访问统计仅计入首页 / 与联系页 /contact（本统计页不计入访问）
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
          <div className="content-card p-5 border border-red-400/40 bg-red-950/40 text-red-100 text-sm space-y-3">
            <p className="font-semibold text-base text-red-200">⚠ 数据无法记录：Vercel Blob 存储未配置</p>
            <p>当前网站访问和点击事件无法保存，所以统计始终显示 0。请按以下步骤操作：</p>
            <ol className="list-decimal list-inside space-y-1 text-red-100/90">
              <li>打开 Vercel 项目 → <strong>Storage</strong> → <strong>Create Database</strong> → 选择 <strong>Blob</strong></li>
              <li>创建后连接到本项目（Connect to Project）</li>
              <li>确认 Production 环境有 <code className="text-red-200">BLOB_READ_WRITE_TOKEN</code> 变量</li>
              <li>重新 <strong>Redeploy</strong> 部署</li>
              <li>打开首页 https://get1xplay.com 测试点击，再回到此页刷新</li>
            </ol>
            <p className="text-xs text-red-200/70">
              诊断：Token {data?.storage?.hasBlobToken ? "✓" : "✗"} · Store ID {data?.storage?.hasBlobStoreId ? "✓" : "✗"}
            </p>
          </div>
        ) : null}

        <section>
          <h2 className="text-lg font-semibold mb-4">今日概览</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="今日访问" value={today.pageViews ?? 0} hint="page_view 事件数" />
            <StatCard label="今日独立访客" value={today.uniqueVisitors ?? 0} />
            <StatCard label="今日注册点击" value={today.registerClicks ?? 0} />
            <StatCard label="今日促销码复制" value={today.promoCopy ?? 0} />
            <StatCard label="今日页面停留" value={today.pageEngagement ?? 0} hint="离开页面时上报" />
            <StatCard label="今日滚动触发" value={today.scrollDepth ?? 0} hint="25/50/75/100% 累计" />
            <StatCard label="今日总事件" value={today.totalEvents ?? 0} hint="明细见页面底部" />
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
          <div className="content-card overflow-auto max-h-[420px]">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-black/80 backdrop-blur-sm z-10">
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="text-left px-4 py-3 font-medium">时间</th>
                  <th className="text-left px-4 py-3 font-medium">事件</th>
                  <th className="text-left px-4 py-3 font-medium">详情</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentEvents || []).slice(0, 15).map((item, index) => (
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

        <section>
          <h2 className="text-lg font-semibold mb-4">今日事件明细</h2>
          <div className="content-card divide-y divide-white/10">
            {Object.keys(today.byEvent || {}).length === 0 ? (
              <div className="px-5 py-4 text-sm text-gray-500">今日暂无事件</div>
            ) : (
              Object.entries(today.byEvent || {})
                .sort((a, b) => b[1] - a[1])
                .map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between px-5 py-3 text-sm">
                    <span className="text-gray-300">{eventLabel(name)}</span>
                    <span className="font-mono text-blue-300">{count}</span>
                  </div>
                ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
