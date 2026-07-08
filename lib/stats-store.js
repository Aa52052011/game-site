import { BlobServiceRateLimited, del, get, list, put } from "@vercel/blob";

const EVENT_PREFIX = "analytics/events/";
const EVENT_INDEX_PATH = "analytics/events-index.json";
const LEGACY_STATS_PATH = "analytics/stats.json";
const BLOB_ACCESS = "private";
const MAX_EVENTS = 2000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function requestOptions() {
  const options = {};
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (token) {
    options.token = token;
    return options;
  }

  if (process.env.BLOB_STORE_ID) {
    options.storeId = process.env.BLOB_STORE_ID;
  }

  return options;
}

function blobPutOptions(overwrite = false) {
  return {
    ...requestOptions(),
    access: BLOB_ACCESS,
    addRandomSuffix: false,
    allowOverwrite: overwrite,
    cacheControlMaxAge: 60,
  };
}

function todayKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" });
}

function eventDay(iso) {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" });
}

function emptyToday() {
  return {
    pageViews: 0,
    registerClicks: 0,
    promoCopy: 0,
    navClicks: 0,
    languageSwitch: 0,
    telegramClicks: 0,
    viewScreenshots: 0,
    totalEvents: 0,
    uniqueVisitors: 0,
  };
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
    today: emptyToday(),
    scrollDepth: { 25: 0, 50: 0, 75: 0, 100: 0 },
    pageViews: {},
    recentEvents: [],
    eventCount: 0,
  };
}

export function isStatsStorageConfigured() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN?.trim() ||
    process.env.BLOB_STORE_ID?.trim()
  );
}

export function getStorageDiagnostics() {
  return {
    hasBlobToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim()),
    hasBlobStoreId: Boolean(process.env.BLOB_STORE_ID?.trim()),
    configured: isStatsStorageConfigured(),
    isVercel: process.env.VERCEL === "1",
  };
}

async function readBlobText(pathname) {
  const data = await get(pathname, { ...requestOptions(), access: BLOB_ACCESS });
  if (!data || data.statusCode !== 200 || !data.stream) return null;

  const text = await new Response(data.stream).text();
  return text || null;
}

async function readBlobJson(pathname) {
  const text = await readBlobText(pathname);
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function writeBlobJson(pathname, value) {
  await putWithRetry(pathname, JSON.stringify(value), blobPutOptions(true));
}

async function putWithRetry(pathname, body, options, maxAttempts = 3) {
  let lastError;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      return await put(pathname, body, options);
    } catch (error) {
      lastError = error;

      if (error instanceof BlobServiceRateLimited) {
        await sleep(Math.max(error.retryAfter || 1, 1) * 1000);
        continue;
      }

      if (attempt < maxAttempts - 1) {
        await sleep(250 * (attempt + 1));
      }
    }
  }

  throw lastError;
}

function normalizeEventRecord(record, fallbackAt) {
  if (!record?.event) return null;

  return {
    at: record.at || fallbackAt || new Date().toISOString(),
    event: record.event,
    params: record.params || {},
    visitorId: record.visitorId || null,
    pathname: record.pathname || null,
  };
}

async function loadEventIndex() {
  const raw = await readBlobJson(EVENT_INDEX_PATH);
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => normalizeEventRecord(item))
    .filter(Boolean)
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, MAX_EVENTS);
}

async function saveEventIndex(events) {
  await writeBlobJson(EVENT_INDEX_PATH, events.slice(0, MAX_EVENTS));
}

async function appendEventToIndex(entry) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const current = await loadEventIndex();
      current.unshift(entry);
      await saveEventIndex(current);
      return;
    } catch {
      if (attempt === 2) throw new Error("Failed to update stats event index");
      await sleep(200 * (attempt + 1));
    }
  }
}

async function loadAllEventsFromList() {
  const events = [];
  let cursor;

  do {
    const result = await list({
      prefix: EVENT_PREFIX,
      limit: 1000,
      cursor,
      ...requestOptions(),
    });

    for (const blob of result.blobs) {
      try {
        const text = await readBlobText(blob.pathname);
        if (!text) continue;

        const parsed = JSON.parse(text);
        const uploadedAt = blob.uploadedAt instanceof Date
          ? blob.uploadedAt.toISOString()
          : blob.uploadedAt;

        const record = normalizeEventRecord(parsed, uploadedAt);
        if (record) {
          record.pathname = blob.pathname;
          events.push(record);
        }
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

async function loadAllEvents() {
  if (!isStatsStorageConfigured()) return [];

  try {
    const indexed = await loadEventIndex();
    if (indexed.length > 0) return indexed;

    const listed = await loadAllEventsFromList();
    if (listed.length > 0) {
      try {
        await saveEventIndex(listed);
      } catch {
        /* index rebuild is best-effort */
      }
    }

    return listed;
  } catch (error) {
    console.error("[stats-store] loadAllEvents failed", error);
    return [];
  }
}

function aggregateEvents(events) {
  const summary = emptySummary();
  const day = todayKey();
  const todayVisitors = new Set();
  let engagementSeconds = 0;
  let engagementCount = 0;

  for (const item of events) {
    const { event, params, visitorId, at } = item;
    const isToday = eventDay(at) === day;

    if (isToday) {
      summary.today.totalEvents += 1;
      if (visitorId) todayVisitors.add(visitorId);
    }

    switch (event) {
      case "page_view": {
        summary.totals.pageViews += 1;
        if (isToday) summary.today.pageViews += 1;
        const path = String(params.page_path || "/");
        summary.pageViews[path] = (summary.pageViews[path] || 0) + 1;
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
        if (isToday) summary.today.promoCopy += 1;
        break;
      case "nav_click":
        summary.totals.navClicks += 1;
        if (isToday) summary.today.navClicks += 1;
        break;
      case "language_switch":
        summary.totals.languageSwitch += 1;
        if (isToday) summary.today.languageSwitch += 1;
        break;
      case "external_click":
        if (params.type === "telegram") {
          summary.totals.telegramClicks += 1;
          if (isToday) summary.today.telegramClicks += 1;
        }
        break;
      case "user_action":
        if (params.action === "view_screenshots") {
          summary.totals.viewScreenshots += 1;
          if (isToday) summary.today.viewScreenshots += 1;
        }
        break;
      case "page_engagement": {
        const seconds = Number(params.time_seconds) || 0;
        if (seconds > 0 && seconds <= 3600) {
          engagementSeconds += seconds;
          engagementCount += 1;
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
    engagementCount > 0 ? Math.round(engagementSeconds / engagementCount) : 0;

  summary.recentEvents = events.slice(0, 30).map(({ at, event, params }) => ({
    at,
    event,
    params,
  }));

  summary.eventCount = events.length;
  return summary;
}

/** @param {string} event @param {Record<string, string | number | boolean>} params @param {string | null} visitorId */
export async function recordEvent(event, params = {}, visitorId = null) {
  if (!isStatsStorageConfigured()) {
    return { ok: false, reason: "not_configured" };
  }

  const at = new Date().toISOString();
  const entry = { at, event, params, visitorId };

  try {
    await appendEventToIndex(entry);
  } catch (error) {
    console.error("[stats-store] failed to append event index", error);
    return {
      ok: false,
      reason: "save_failed",
      message: error instanceof Error ? error.message : "index write failed",
    };
  }

  return { ok: true };
}

export async function resetStats() {
  if (!isStatsStorageConfigured()) return false;

  try {
    await del(EVENT_INDEX_PATH, requestOptions());
  } catch {
    /* index may not exist */
  }

  let cursor;
  do {
    const result = await list({
      prefix: EVENT_PREFIX,
      limit: 1000,
      cursor,
      ...requestOptions(),
    });

    if (result.blobs.length > 0) {
      await del(
        result.blobs.map((blob) => blob.pathname),
        requestOptions()
      );
    }

    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  try {
    await del(LEGACY_STATS_PATH, requestOptions());
  } catch {
    /* legacy file may not exist */
  }

  await saveEventIndex([]);

  return true;
}

export async function getStatsSummary() {
  try {
    const events = await loadAllEvents();
    const summary = aggregateEvents(events);

    return {
      configured: isStatsStorageConfigured(),
      storage: getStorageDiagnostics(),
      updatedAt: new Date().toISOString(),
      ...summary,
    };
  } catch (error) {
    console.error("[stats-store] getStatsSummary failed", error);
    return {
      configured: isStatsStorageConfigured(),
      storage: getStorageDiagnostics(),
      updatedAt: new Date().toISOString(),
      ...emptySummary(),
    };
  }
}
