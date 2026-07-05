import { track as vercelTrack } from "@vercel/analytics";

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

async function postEvent(name, params) {
  const body = JSON.stringify({
    event: name,
    params,
    visitorId: getVisitorId(),
  });

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
      if (res.ok) return;
    } catch {
      /* retry once */
    }
  }
}

function sendToStatsBackend(name, params) {
  if (typeof window === "undefined") return;
  void postEvent(name, params);
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
