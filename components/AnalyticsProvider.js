"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import {
  trackPageEngagement,
  trackPageView,
  trackScrollDepth,
} from "@/lib/analytics";

const SCROLL_THRESHOLDS = [25, 50, 75, 100];
const TRACKED_PATHS = new Set(["/", "/contact"]);

function AnalyticsTracker() {
  const pathname = usePathname();
  const startRef = useRef(Date.now());
  const scrollFiredRef = useRef(new Set());
  const engagementSentRef = useRef(false);

  useEffect(() => {
    if (!TRACKED_PATHS.has(pathname)) return;

    startRef.current = Date.now();
    scrollFiredRef.current = new Set();
    engagementSentRef.current = false;

    // Fire on route enter. Do not wait for window "load" — in Next.js the load
    // event may have already fired before hydration, and it never fires again on
    // client-side navigations between / and /contact.
    trackPageView(pathname);

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const pct = Math.round((window.scrollY / scrollable) * 100);
      SCROLL_THRESHOLDS.forEach((threshold) => {
        if (pct >= threshold && !scrollFiredRef.current.has(threshold)) {
          scrollFiredRef.current.add(threshold);
          trackScrollDepth(pathname, threshold);
        }
      });
    };

    const sendEngagement = () => {
      if (engagementSentRef.current) return;
      engagementSentRef.current = true;

      const seconds = Math.round((Date.now() - startRef.current) / 1000);
      if (seconds > 0) {
        trackPageEngagement(pathname, seconds);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") sendEngagement();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", sendEngagement);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", sendEngagement);
      sendEngagement();
    };
  }, [pathname]);

  return null;
}

export default function AnalyticsProvider() {
  return (
    <>
      <AnalyticsTracker />
      <Analytics />
    </>
  );
}
