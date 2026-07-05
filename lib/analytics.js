import { track as vercelTrack } from "@vercel/analytics";

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** @param {string} name @param {Record<string, string | number | boolean>} [params] */
export function trackEvent(name, params = {}) {
  if (typeof window !== "undefined" && window.gtag && GA_ID) {
    window.gtag("event", name, params);
  }

  try {
    vercelTrack(name, params);
  } catch {
    /* ignore when analytics unavailable */
  }
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
  if (typeof window !== "undefined" && window.gtag && GA_ID) {
    window.gtag("config", GA_ID, { page_path: pagePath });
  }
  trackEvent("page_view", { page_path: pagePath });
}
