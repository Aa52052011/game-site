import { track as vercelTrack } from "@vercel/analytics";

const VISITOR_KEY = "site_visitor_id";
const PAGE_VIEW_KEY = "site_page_views";

function getVisitorId() {
  if (typeof window === "undefined") return null;
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

function buildPayload(name, params) {
  return JSON.stringify({
    event: name,
    params,
    visitorId: getVisitorId(),
  });
}

async function deliver(body) {
  return fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    credentials: "same-origin",
  });
}

async function postEvent(name, params, { beaconFallback = false } = {}) {
  const body = buildPayload(name, params);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const res = await deliver(body);
      if (res.ok) return true;
    } catch {
      /* retry */
    }

    await new Promise((resolve) => setTimeout(resolve, 150 * (attempt + 1)));
  }

  if (
    beaconFallback &&
    typeof navigator !== "undefined" &&
    typeof navigator.sendBeacon === "function"
  ) {
    const blob = new Blob([body], { type: "application/json" });
    return navigator.sendBeacon("/api/track", blob);
  }

  return false;
}

function sendToStatsBackend(name, params, options) {
  if (typeof window === "undefined") return;
  void postEvent(name, params, options);
}

/** @param {string} name @param {Record<string, string | number | boolean>} [params] */
export function trackEvent(name, params = {}, options) {
  vercelTrack(name, params);
  sendToStatsBackend(name, params, options);
}

/** @param {string} location */
export function trackRegisterClick(location) {
  trackEvent("register_click", { location, page_path: "/" }, { beaconFallback: true });
}

/** @param {string} link @param {string} [label] */
export function trackNavClick(link, label) {
  trackEvent("nav_click", { link, label, page_path: link || "/" });
}

/** @param {string} locale */
export function trackLanguageSwitch(locale) {
  trackEvent("language_switch", { locale, page_path: window.location.pathname });
}

/** @param {string} location */
export function trackPromoCopy(location = "promo_banner") {
  trackEvent("promo_copy", { location, code: "1x_5224822", page_path: "/" });
}

/** @param {string} type @param {string} location */
export function trackExternalClick(type, location) {
  trackEvent(
    "external_click",
    { type, location, page_path: window.location.pathname },
    { beaconFallback: true }
  );
}

/** @param {string} action @param {string} [location] */
export function trackUserAction(action, location) {
  trackEvent("user_action", { action, location, page_path: "/" }, { beaconFallback: true });
}

/** @param {string} pagePath @param {number} seconds */
export function trackPageEngagement(pagePath, seconds) {
  trackEvent(
    "page_engagement",
    { page_path: pagePath, time_seconds: seconds },
    { beaconFallback: true }
  );
}

/** @param {string} pagePath @param {number} depth */
export function trackScrollDepth(pagePath, depth) {
  trackEvent("scroll_depth", { page_path: pagePath, depth });
}

/** @param {string} pagePath */
export function trackPageView(pagePath) {
  if (typeof window === "undefined") return;

  const key = `${PAGE_VIEW_KEY}:${pagePath}`;
  try {
    const lastSent = sessionStorage.getItem(key);
    const now = Date.now();
    if (lastSent && now - Number(lastSent) < 2000) return;
    sessionStorage.setItem(key, String(now));
  } catch {
    /* ignore storage errors */
  }

  trackEvent("page_view", { page_path: pagePath });
}
