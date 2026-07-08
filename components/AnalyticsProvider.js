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

function normalizePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  const base = pathname.split("?")[0].replace(/\/+$/, "") || "/";
  return base;
}

function isTrackedPath(pathname) {
  const path = normalizePath(pathname);
  return path === "/" || path === "/contact";
}

function AnalyticsTracker() {
  const pathname = usePathname();
  const startRef = useRef(Date.now());
  const scrollFiredRef = useRef(new Set());
  const engagementSentRef = useRef(false);
  const pageViewSentRef = useRef(false);

  useEffect(() => {
    const path = normalizePath(pathname);
    if (!isTrackedPath(pathname)) return;

    startRef.current = Date.now();
    scrollFiredRef.current = new Set();
    engagementSentRef.current = false;
    pageViewSentRef.current = false;

    const sendPageView = () => {
      if (pageViewSentRef.current) return;
      pageViewSentRef.current = true;
      trackPageView(path);
    };

    sendPageView();
    const retryTimer = window.setTimeout(sendPageView, 1000);

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const pct = Math.round((window.scrollY / scrollable) * 100);
      SCROLL_THRESHOLDS.forEach((threshold) => {
        if (pct >= threshold && !scrollFiredRef.current.has(threshold)) {
          scrollFiredRef.current.add(threshold);
          trackScrollDepth(path, threshold);
        }
      });
    };

    const sendEngagement = () => {
      if (engagementSentRef.current) return;
      engagementSentRef.current = true;

      const seconds = Math.round((Date.now() - startRef.current) / 1000);
      if (seconds >= 0) {
        trackPageEngagement(path, Math.max(seconds, 1));
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") sendEngagement();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", sendEngagement);

    return () => {
      window.clearTimeout(retryTimer);
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
