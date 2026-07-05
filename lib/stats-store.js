import { get, head, put, BlobPreconditionFailedError } from "@vercel/blob";

const BLOB_PATH = "analytics/stats.json";
const BLOB_ACCESS = "private";
const MAX_WRITE_RETRIES = 5;

function todayKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" });
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
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

async function readStatsWithEtag() {
  if (!isStatsStorageConfigured()) {
    return { stats: emptyStats(), etag: null };
  }

  try {
    const meta = await head(BLOB_PATH);
    const result = await get(BLOB_PATH, { access: BLOB_ACCESS });
    if (!result?.stream) {
      return { stats: emptyStats(), etag: meta.etag ?? null };
    }

    const text = await new Response(result.stream).text();
    if (!text) {
      return { stats: emptyStats(), etag: meta.etag ?? null };
    }

    const data = JSON.parse(text);
    return {
      stats: { ...emptyStats(), ...data },
      etag: meta.etag ?? result.blob.etag ?? null,
    };
  } catch {
    return { stats: emptyStats(), etag: null };
  }
}

async function writeStats(stats, etag) {
  const putOptions = {
    access: BLOB_ACCESS,
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    ...(etag ? { ifMatch: etag } : {}),
  };

  await put(BLOB_PATH, JSON.stringify(stats), putOptions);
}

async function updateStats(mutator) {
  for (let attempt = 0; attempt < MAX_WRITE_RETRIES; attempt += 1) {
    const { stats, etag } = await readStatsWithEtag();
    const next = mutator(stats);

    try {
      await writeStats(next, etag);
      return next;
    } catch (error) {
      if (error instanceof BlobPreconditionFailedError) continue;
      throw error;
    }
  }

  throw new Error("Failed to update stats after concurrent writes.");
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

function applyEvent(stats, event, params, visitorId) {
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
      if (seconds > 0 && seconds <= 3600) {
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
  return stats;
}

/** @param {string} event @param {Record<string, string | number | boolean>} params @param {string | null} visitorId */
export async function recordEvent(event, params = {}, visitorId = null) {
  return updateStats((stats) => applyEvent(stats, event, params, visitorId));
}

export async function getStatsSummary() {
  const { stats } = await readStatsWithEtag();
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
