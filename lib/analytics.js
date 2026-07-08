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

function postEvent(name, params, { useBeacon = false } = {}) {
  const body = JSON.stringify({
    event: name,
    params,
    visitorId: getVisitorId(),
  });

  if (
    useBeacon &&
    typeof navigator !== "undefined" &&
    typeof navigator.sendBeacon === "function"
  ) {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon("/api/track", blob)) return;
  }

  void (async () => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const res = await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
          credentials: "same-origin",
        });
        if (res.ok) return;
      } catch {
        /* retry */
      }
    }
  })();
}

function sendToStatsBackend(name, params, options) {
  if (typeof window === "undefined") return;
  postEvent(name, params, options);
}

/** @param {string} name @param {Record<string, string | number | boolean>} [params] */
export function trackEvent(name, params = {}, options) {
  vercelTrack(name, params);
  sendToStatsBackend(name, params, options);
}

/** @param {string} location */
export function trackRegisterClick(location) {
  trackEvent("register_click", { location }, { useBeacon: true });
}

/** @param {string} link @param {string} [label] */
export function trackNavClick(link, label) {
  trackEvent("nav_click", { link, label }, { useBeacon: true });
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
  trackEvent("external_click", { type, location }, { useBeacon: true });
}

/** @param {string} action @param {string} [location] */
export function trackUserAction(action, location) {
  trackEvent("user_action", { action, location }, { useBeacon: true });
}

/** @param {string} pagePath @param {number} seconds */
export function trackPageEngagement(pagePath, seconds) {
  trackEvent(
    "page_engagement",
    { page_path: pagePath, time_seconds: seconds },
    { useBeacon: true }
  );
}

/** @param {string} pagePath @param {number} depth */
export function trackScrollDepth(pagePath, depth) {
  trackEvent("scroll_depth", { page_path: pagePath, depth });
}

/** @param {string} pagePath */
export function trackPageView(pagePath) {
  trackEvent("page_view", { page_path: pagePath });
}
