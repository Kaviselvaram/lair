"use client";

import { useRef } from "react";
import { gsap, ScrollSmoother, useGSAP } from "@/lib/gsap";
import { state, bindPointer, updateSmooth } from "@/lib/store";

/**
 * GSAP-native smooth scrolling. ScrollSmoother shares ScrollTrigger's ticker,
 * so scroll-linked animations stay perfectly in sync — no Lenis↔ScrollTrigger
 * race, which is what caused the jitter. `effects` enables data-speed /
 * data-lag parallax on any element for cheap, composited depth.
 *
 * Also pumps the smoothed pointer into CSS vars (--mesh-px/--mesh-py) once per
 * frame for the section mesh gradients.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      bindPointer();
      const reduced = state.reducedMotion;

      // QA escape hatch: ?nosmooth renders with native scroll (no fixed+transform
      // wrapper) so screenshot tooling can composite scrolled positions.
      const noSmooth =
        typeof window !== "undefined" &&
        window.location.search.includes("nosmooth");

      let smoother: ScrollSmoother | null = null;
      if (!noSmooth) {
        smoother = ScrollSmoother.create({
          wrapper: wrapper.current!,
          content: content.current!,
          smooth: reduced ? 0 : 1.15,
          smoothTouch: reduced ? 0 : 0.1,
          normalizeScroll: true,
          effects: true,
        });
        (window as WindowWithSmoother).__smoother = smoother;
      }

      // Publish smoothed pointer + scroll progress every frame (no re-render).
      let last = performance.now();
      const tick = () => {
        const now = performance.now();
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        updateSmooth(dt);
        state.scroll = smoother
          ? smoother.progress
          : window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
        const r = document.documentElement.style;
        r.setProperty("--mesh-px", state.smooth.x.toFixed(3));
        r.setProperty("--mesh-py", state.smooth.y.toFixed(3));
      };
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        smoother?.kill();
        (window as WindowWithSmoother).__smoother = undefined;
      };
    },
    { dependencies: [] },
  );

  return (
    <div id="smooth-wrapper" ref={wrapper}>
      <div id="smooth-content" ref={content}>
        {children}
      </div>
    </div>
  );
}

type WindowWithSmoother = Window & { __smoother?: ScrollSmoother | undefined };

/** Smoothly scroll to a selector or offset. */
export function scrollToTarget(target: string | number) {
  const smoother = (window as WindowWithSmoother).__smoother;
  if (smoother) {
    smoother.scrollTo(target, true, "top top");
  } else if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }
}

/** Pause/resume smoothing (used during the preloader). */
export function setScrollPaused(paused: boolean) {
  (window as WindowWithSmoother).__smoother?.paused(paused);
}
