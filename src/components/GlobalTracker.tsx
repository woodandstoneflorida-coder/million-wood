"use client";

import { useEffect, useRef } from "react";
import { trackMetaEvent } from "@/lib/metaPixel";

export default function GlobalTracker() {
  const hasTrackedScroll = useRef(false);
  const hasTrackedTime = useRef(false);
  const hasTrackedPageView = useRef(false);

  useEffect(() => {
    // 0. Initial PageView (Deduplicated via CAPI)
    if (!hasTrackedPageView.current) {
      hasTrackedPageView.current = true;
      trackMetaEvent('PageView');
    }

    // 1. Time Tracking (60 seconds)
    const timeTimeout = setTimeout(() => {
      if (!hasTrackedTime.current) {
        hasTrackedTime.current = true;
        trackMetaEvent('TimeOnSite_60s', {}, true);
      }
    }, 60000);

    // 2. Scroll Depth Tracking (75%)
    const handleScroll = () => {
      if (hasTrackedScroll.current) return;
      
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const depth = scrollHeight > 0 ? (scrolled / scrollHeight) : 0;

      if (depth >= 0.75) {
        hasTrackedScroll.current = true;
        trackMetaEvent('ScrollDepth_75', {}, true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timeTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null; // This component is invisible
}
