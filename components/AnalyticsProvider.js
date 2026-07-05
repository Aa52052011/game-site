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

function AnalyticsTracker() {
  const pathname = usePathname();
  const startRef = useRef(Date.now());
  const scrollFiredRef = useRef(new Set());

  useEffect(() => {
    startRef.current = Date.now();
    scrollFiredRef.current = new Set();
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
      const seconds = Math.round((Date.now() - startRef.current) / 1000);
      if (seconds > 0) {
        trackPageEngagement(pathname, seconds);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") sendEngagement();
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
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
