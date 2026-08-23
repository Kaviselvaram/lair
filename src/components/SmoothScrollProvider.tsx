"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { state, bindPointer, updateSmooth } from "@/lib/store";

let globalLenis: Lenis | null = null;

/**
 * Butter-smooth 120 FPS momentum scrolling with Lenis + GSAP ScrollTrigger.
 * Synchronized through the GSAP ticker for zero-latency scroll-linked animations
 * without DOM hijacking or synthetic matrix transform lag.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bindPointer();
    const reduced = state.reducedMotion;

    const noSmooth =
      typeof window !== "undefined" &&
      window.location.search.includes("nosmooth");

    if (!noSmooth && !reduced) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        infinite: false,
      });

      globalLenis = lenis;
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

      // Sync Lenis with GSAP ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      const tickerCallback = (time: number) => {
        lenis.raf(time * 1000);
      };

      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

      // Lightweight pointer & scroll store updater without DOM style invalidations
      let lastTime = performance.now();
      const pointerTick = () => {
        const now = performance.now();
        const dt = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;
        updateSmooth(dt);
        state.scroll =
          window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight || 1);
      };
      gsap.ticker.add(pointerTick);

      return () => {
        gsap.ticker.remove(tickerCallback);
        gsap.ticker.remove(pointerTick);
        lenis.destroy();
        globalLenis = null;
        (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
      };
    } else {
      let lastTime = performance.now();
      const pointerTick = () => {
        const now = performance.now();
        const dt = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;
        updateSmooth(dt);
      };
      gsap.ticker.add(pointerTick);

      return () => {
        gsap.ticker.remove(pointerTick);
      };
    }
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {children}
    </div>
  );
}

/** Smoothly scroll to a selector or offset. */
export function scrollToTarget(target: string | number) {
  if (globalLenis) {
    globalLenis.scrollTo(target, { duration: 1.4 });
  } else if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  } else if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  }
}

/** Pause/resume smoothing (used during the preloader). */
export function setScrollPaused(paused: boolean) {
  if (globalLenis) {
    if (paused) {
      globalLenis.stop();
    } else {
      globalLenis.start();
    }
  }
}
