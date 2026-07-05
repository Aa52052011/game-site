import { head, put } from "@vercel/blob";

const BLOB_PATH = "analytics/stats.json";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function emptyStats() {
  return {
    totals: {
      page_view: 0,
      register_click_hero: 0,
      register_click_cta: 0,
      promo_copy: 0,
      nav_click: 0,
      language_switch: 0,
      external_click_telegram: 0,
      user_action_screenshots: 0,
    },
    engagementSeconds: 0,
    engagementCount: 0,
    scrollDepth: { 25: 0, 50: 0, 75: 0, 100: 0 },
    pageViews: { "/": 0, "/contact": 0 },
    daily: {},
    recentEvents: [],
  };
}

export function isStatsStorageConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readStats() {
  if (!isStatsStorageConfigured()) return emptyStats();

  try {
    const meta = await head(BLOB_PATH);
    const res = await fetch(meta.url, { cache: "no-store" });
    if (!res.ok) return emptyStats();
    const data = await res.json();
    return { ...emptyStats(), ...data };
  } catch {
    return emptyStats();
  }
}

async function writeStats(stats) {
  if (!isStatsStorageConfigured()) return false;

  await put(BLOB_PATH, JSON.stringify(stats), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
  return true;
}

function ensureDaily(stats, day) {
  if (!stats.daily[day]) {
    stats.daily[day] = {
      page_view: 0,
      register_click: 0,
      visitors: {},
    };
  }
  return stats.daily[day];
}

function pushRecentEvent(stats, event) {
  stats.recentEvents.unshift(event);
  stats.recentEvents = stats.recentEvents.slice(0, 100);
}

/** @param {string} event @param {Record<string, string | number | boolean>} params @param {string | null} visitorId */
export async function recordEvent(event, params = {}, visitorId = null) {
  const stats = await readStats();
  const day = todayKey();
  const daily = ensureDaily(stats, day);

  const recent = {
    at: new Date().toISOString(),
    event,
    params,
  };

  switch (event) {
    case "page_view": {
      stats.totals.page_view += 1;
      daily.page_view += 1;
      const path = String(params.page_path || "/");
      stats.pageViews[path] = (stats.pageViews[path] || 0) + 1;
      if (visitorId) daily.visitors[visitorId] = true;
      break;
    }
    case "register_click": {
      const location = String(params.location || "unknown");
      if (location === "hero") stats.totals.register_click_hero += 1;
      if (location === "cta") stats.totals.register_click_cta += 1;
      daily.register_click += 1;
      break;
    }
    case "promo_copy":
      stats.totals.promo_copy += 1;
      break;
    case "nav_click":
      stats.totals.nav_click += 1;
      break;
    case "language_switch":
      stats.totals.language_switch += 1;
      break;
    case "external_click":
      if (params.type === "telegram") stats.totals.external_click_telegram += 1;
      break;
    case "user_action":
      if (params.action === "view_screenshots") stats.totals.user_action_screenshots += 1;
      break;
    case "page_engagement": {
      const seconds = Number(params.time_seconds) || 0;
      if (seconds > 0) {
        stats.engagementSeconds += seconds;
        stats.engagementCount += 1;
      }
      break;
    }
    case "scroll_depth": {
      const depth = Number(params.depth);
      if ([25, 50, 75, 100].includes(depth)) {
        stats.scrollDepth[depth] += 1;
      }
      break;
    }
    default:
      break;
  }

  pushRecentEvent(stats, recent);
  await writeStats(stats);
  return stats;
}

export async function getStatsSummary() {
  const stats = await readStats();
  const day = todayKey();
  const daily = stats.daily[day] || { page_view: 0, register_click: 0, visitors: {} };

  const registerTotal =
    stats.totals.register_click_hero + stats.totals.register_click_cta;

  const avgEngagement =
    stats.engagementCount > 0
      ? Math.round(stats.engagementSeconds / stats.engagementCount)
      : 0;

  return {
    configured: isStatsStorageConfigured(),
    totals: {
      pageViews: stats.totals.page_view,
      registerClicks: registerTotal,
      registerHero: stats.totals.register_click_hero,
      registerCta: stats.totals.register_click_cta,
      promoCopy: stats.totals.promo_copy,
      navClicks: stats.totals.nav_click,
      languageSwitch: stats.totals.language_switch,
      telegramClicks: stats.totals.external_click_telegram,
      viewScreenshots: stats.totals.user_action_screenshots,
      avgEngagementSeconds: avgEngagement,
    },
    today: {
      pageViews: daily.page_view,
      registerClicks: daily.register_click,
      uniqueVisitors: Object.keys(daily.visitors || {}).length,
    },
    scrollDepth: stats.scrollDepth,
    pageViews: stats.pageViews,
    recentEvents: stats.recentEvents,
  };
}
