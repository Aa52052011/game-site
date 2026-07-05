import { track as vercelTrack } from "@vercel/analytics";

const DEDUPE_MS = 3000;

function getVisitorId() {
  if (typeof window === "undefined") return null;
  try {
    let id = localStorage.getItem("site_visitor_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("site_visitor_id", id);
    }
    return id;
  } catch {
    return null;
  }
}

function shouldSendEvent(name, params) {
  if (typeof window === "undefined") return true;

  const alwaysSend = new Set([
    "register_click",
    "promo_copy",
    "nav_click",
    "language_switch",
    "external_click",
    "user_action",
  ]);
  if (alwaysSend.has(name)) return true;

  try {
    const parts = [name];
    if (params.page_path) parts.push(String(params.page_path));
    if (params.depth !== undefined) parts.push(String(params.depth));
    if (params.location) parts.push(String(params.location));

    const key = `stats_dedupe:${parts.join(":")}`;
    const last = sessionStorage.getItem(key);
    const now = Date.now();

    if (last && now - Number(last) < DEDUPE_MS) return false;

    sessionStorage.setItem(key, String(now));
    return true;
  } catch {
    return true;
  }
}

function sendToStatsBackend(name, params) {
  if (typeof window === "undefined") return;
  if (!shouldSendEvent(name, params)) return;

  const body = JSON.stringify({
    event: name,
    params,
    visitorId: getVisitorId(),
  });

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/track", blob);
    return;
  }

  fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

/** @param {string} name @param {Record<string, string | number | boolean>} [params] */
export function trackEvent(name, params = {}) {
  vercelTrack(name, params);
  sendToStatsBackend(name, params);
}

/** @param {string} location */
export function trackRegisterClick(location) {
  trackEvent("register_click", { location });
}

/** @param {string} link @param {string} [label] */
export function trackNavClick(link, label) {
  trackEvent("nav_click", { link, label });
}

/** @param {string} locale */
export function trackLanguageSwitch(locale) {
  trackEvent("language_switch", { locale });
}

/** @param {string} location */
export function trackPromoCopy(location = "promo_banner") {
  trackEvent("promo_copy", { location, code: "1x_5224822" });
}

/** @param {string} location */
export function trackExternalClick(type, location) {
  trackEvent("external_click", { type, location });
}

/** @param {string} action @param {string} [location] */
export function trackUserAction(action, location) {
  trackEvent("user_action", { action, location });
}

/** @param {string} pagePath @param {number} seconds */
export function trackPageEngagement(pagePath, seconds) {
  trackEvent("page_engagement", {
    page_path: pagePath,
    time_seconds: seconds,
  });
}

/** @param {string} pagePath @param {number} depth */
export function trackScrollDepth(pagePath, depth) {
  trackEvent("scroll_depth", { page_path: pagePath, depth });
}

/** @param {string} pagePath */
export function trackPageView(pagePath) {
  trackEvent("page_view", { page_path: pagePath });
}
