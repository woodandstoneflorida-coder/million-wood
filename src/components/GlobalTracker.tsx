"use client";

import { useEffect, useRef } from "react";

export default function GlobalTracker() {
  const hasTrackedScroll = useRef(false);
  const hasTrackedTime = useRef(false);

  useEffect(() => {
    // 1. Time Tracking (60 seconds)
    const timeTimeout = setTimeout(() => {
      if (!hasTrackedTime.current) {
        hasTrackedTime.current = true;
        if (typeof window !== "undefined" && (window as any).fbq) {
          (window as any).fbq('trackCustom', 'TimeOnSite_60s');
        }
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
        if (typeof window !== "undefined" && (window as any).fbq) {
          (window as any).fbq('trackCustom', 'ScrollDepth_75');
        }
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
