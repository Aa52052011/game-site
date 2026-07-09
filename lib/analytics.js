const VISITOR_KEY = "site_visitor_id";
const PAGE_VIEW_KEY = "site_page_views";
const ENGAGEMENT_KEY = "site_engagement_sent";

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

function sendBeacon(body) {
  if (typeof navigator === "undefined" || typeof navigator.sendBeacon !== "function") {
    return false;
  }

  return navigator.sendBeacon(
    "/api/track",
    new Blob([body], { type: "application/json" })
  );
}

async function deliverFetch(body) {
  return fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
    credentials: "same-origin",
  });
}

function sendImmediate(name, params) {
  const body = buildPayload(name, params);
  if (!sendBeacon(body)) {
    void deliverFetch(body);
  }
}

async function postEvent(name, params) {
  const body = buildPayload(name, params);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const res = await deliverFetch(body);
      if (res.ok) return true;
    } catch {
      /* retry */
    }

    await new Promise((resolve) => setTimeout(resolve, 150 * (attempt + 1)));
  }

  return sendBeacon(body);
}

function sendToStatsBackend(name, params) {
  if (typeof window === "undefined") return;
  void postEvent(name, params);
}

/** @param {string} name @param {Record<string, string | number | boolean>} [params] */
export function trackEvent(name, params = {}) {
  sendToStatsBackend(name, params);
}

/** @param {string} location */
export function trackRegisterClick(location) {
  sendImmediate("register_click", { location, page_path: "/" });
}

/** @param {string} link @param {string} [label] */
export function trackNavClick(link, label) {
  sendToStatsBackend("nav_click", { link, label, page_path: link || "/" });
}

/** @param {string} locale */
export function trackLanguageSwitch(locale) {
  sendToStatsBackend("language_switch", {
    locale,
    page_path: typeof window !== "undefined" ? window.location.pathname : "/",
  });
}

/** @param {string} location */
export function trackPromoCopy(location = "promo_banner") {
  sendImmediate("promo_copy", { location, code: "1x_5224822", page_path: "/" });
}

/** @param {string} type @param {string} location */
export function trackExternalClick(type, location) {
  sendImmediate("external_click", {
    type,
    location,
    page_path: typeof window !== "undefined" ? window.location.pathname : "/",
  });
}

/** @param {string} action @param {string} [location] */
export function trackUserAction(action, location) {
  sendToStatsBackend("user_action", { action, location, page_path: "/" });
}

/** @param {string} pagePath @param {number} seconds */
export function trackPageEngagement(pagePath, seconds) {
  if (typeof window === "undefined") return;

  const key = `${ENGAGEMENT_KEY}:${pagePath}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    /* ignore storage errors */
  }

  sendImmediate("page_engagement", { page_path: pagePath, time_seconds: seconds });
}

/** @param {string} pagePath @param {number} depth */
export function trackScrollDepth(pagePath, depth) {
  sendToStatsBackend("scroll_depth", { page_path: pagePath, depth });
}

/** @param {string} pagePath */
export function trackPageView(pagePath) {
  if (typeof window === "undefined") return;

  const key = `${PAGE_VIEW_KEY}:${pagePath}`;
  try {
    const lastSent = sessionStorage.getItem(key);
    const now = Date.now();
    if (lastSent && now - Number(lastSent) < 1500) return;
    sessionStorage.setItem(key, String(now));
  } catch {
    /* ignore storage errors */
  }

  sendImmediate("page_view", { page_path: pagePath });
}

export function resetEngagementGuard(pagePath) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(`${ENGAGEMENT_KEY}:${pagePath}`);
  } catch {
    /* ignore storage errors */
  }
}
