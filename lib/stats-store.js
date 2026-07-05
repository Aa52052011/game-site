import { del, get, list, put } from "@vercel/blob";

const EVENT_PREFIX = "analytics/events/";
const LEGACY_STATS_PATH = "analytics/stats.json";
const BLOB_ACCESS = "private";
const MAX_EVENTS = 2000;

function todayKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" });
}

function eventDay(iso) {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" });
}

function emptySummary() {
  return {
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
      uniqueVisitors: 0,
    },
    scrollDepth: { 25: 0, 50: 0, 75: 0, 100: 0 },
    pageViews: {},
    recentEvents: [],
    eventCount: 0,
  };
}

export function isStatsStorageConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

async function loadAllEvents() {
  if (!isStatsStorageConfigured()) return [];

  const events = [];
  let cursor;

  do {
    const result = await list({
      prefix: EVENT_PREFIX,
      limit: 1000,
      cursor,
    });

    for (const blob of result.blobs) {
      try {
        const data = await get(blob.pathname, { access: BLOB_ACCESS });
        if (!data?.stream) continue;

        const text = await new Response(data.stream).text();
        if (!text) continue;

        const parsed = JSON.parse(text);
        events.push({
          at: parsed.at || blob.uploadedAt?.toISOString?.() || new Date().toISOString(),
          event: parsed.event,
          params: parsed.params || {},
          visitorId: parsed.visitorId || null,
        });
      } catch {
        /* skip broken event files */
      }
    }

    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  return events
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, MAX_EVENTS);
}

function aggregateEvents(events) {
  const summary = emptySummary();
  const day = todayKey();
  const todayVisitors = new Set();

  for (const item of events) {
    const { event, params, visitorId, at } = item;
    const isToday = eventDay(at) === day;

    switch (event) {
      case "page_view": {
        summary.totals.pageViews += 1;
        if (isToday) summary.today.pageViews += 1;
        const path = String(params.page_path || "/");
        summary.pageViews[path] = (summary.pageViews[path] || 0) + 1;
        if (isToday && visitorId) todayVisitors.add(visitorId);
        break;
      }
      case "register_click": {
        summary.totals.registerClicks += 1;
        if (isToday) summary.today.registerClicks += 1;
        const location = String(params.location || "");
        if (location === "hero") summary.totals.registerHero += 1;
        if (location === "cta") summary.totals.registerCta += 1;
        break;
      }
      case "promo_copy":
        summary.totals.promoCopy += 1;
        break;
      case "nav_click":
        summary.totals.navClicks += 1;
        break;
      case "language_switch":
        summary.totals.languageSwitch += 1;
        break;
      case "external_click":
        if (params.type === "telegram") summary.totals.telegramClicks += 1;
        break;
      case "user_action":
        if (params.action === "view_screenshots") summary.totals.viewScreenshots += 1;
        break;
      case "page_engagement": {
        const seconds = Number(params.time_seconds) || 0;
        if (seconds > 0 && seconds <= 3600) {
          summary._engagementSeconds = (summary._engagementSeconds || 0) + seconds;
          summary._engagementCount = (summary._engagementCount || 0) + 1;
        }
        break;
      }
      case "scroll_depth": {
        const depth = Number(params.depth);
        if ([25, 50, 75, 100].includes(depth)) {
          summary.scrollDepth[depth] += 1;
        }
        break;
      }
      default:
        break;
    }
  }

  summary.today.uniqueVisitors = todayVisitors.size;
  summary.totals.avgEngagementSeconds =
    summary._engagementCount > 0
      ? Math.round(summary._engagementSeconds / summary._engagementCount)
      : 0;

  summary.recentEvents = events.slice(0, 30).map(({ at, event, params }) => ({
    at,
    event,
    params,
  }));

  summary.eventCount = events.length;
  delete summary._engagementSeconds;
  delete summary._engagementCount;

  return summary;
}

/** @param {string} event @param {Record<string, string | number | boolean>} params @param {string | null} visitorId */
export async function recordEvent(event, params = {}, visitorId = null) {
  if (!isStatsStorageConfigured()) return false;

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.json`;

  await put(`${EVENT_PREFIX}${filename}`, JSON.stringify({
    at: new Date().toISOString(),
    event,
    params,
    visitorId,
  }), {
    access: BLOB_ACCESS,
    addRandomSuffix: false,
    contentType: "application/json",
  });

  return true;
}

export async function resetStats() {
  if (!isStatsStorageConfigured()) return false;

  let cursor;
  do {
    const result = await list({ prefix: EVENT_PREFIX, limit: 1000, cursor });
    if (result.blobs.length > 0) {
      await del(result.blobs.map((blob) => blob.url));
    }
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  try {
    await del(LEGACY_STATS_PATH);
  } catch {
    /* legacy file may not exist */
  }

  return true;
}

export async function getStatsSummary() {
  const events = await loadAllEvents();
  const summary = aggregateEvents(events);

  return {
    configured: isStatsStorageConfigured(),
    updatedAt: new Date().toISOString(),
    ...summary,
  };
}
