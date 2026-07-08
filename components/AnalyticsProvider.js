"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import {
  resetEngagementGuard,
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
  const maxScrollPctRef = useRef(0);
  const scrollFiredRef = useRef(new Set());
  const engagementSentRef = useRef(false);

  useEffect(() => {
    const path = normalizePath(pathname);
    if (!isTrackedPath(pathname)) return;

    startRef.current = Date.now();
    maxScrollPctRef.current = 0;
    scrollFiredRef.current = new Set();
    engagementSentRef.current = false;
    resetEngagementGuard(path);

    trackPageView(path);

    const recordScrollDepth = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const pct = scrollable <= 0
        ? 100
        : Math.min(100, Math.round((window.scrollY / scrollable) * 100));

      if (pct > maxScrollPctRef.current) {
        maxScrollPctRef.current = pct;
      }

      SCROLL_THRESHOLDS.forEach((threshold) => {
        if (maxScrollPctRef.current >= threshold && !scrollFiredRef.current.has(threshold)) {
          scrollFiredRef.current.add(threshold);
          trackScrollDepth(path, threshold);
        }
      });
    };

    const sendEngagement = () => {
      if (engagementSentRef.current) return;
      engagementSentRef.current = true;

      const seconds = Math.round((Date.now() - startRef.current) / 1000);
      trackPageEngagement(path, Math.max(seconds, 1));
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") sendEngagement();
    };

    recordScrollDepth();
    window.addEventListener("scroll", recordScrollDepth, { passive: true });
    window.addEventListener("resize", recordScrollDepth, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", sendEngagement);

    return () => {
      window.removeEventListener("scroll", recordScrollDepth);
      window.removeEventListener("resize", recordScrollDepth);
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
