"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Minimal, refined preloader: the wordmark, a count to 100, and a mask that
 * lifts to reveal the atmosphere. No spinner. Hands off `entered` so the hero
 * choreography begins as the curtain rises.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  const done = useRef(false);
  const finish = () => {
    if (done.current) return;
    done.current = true;
    onDone();
  };

  // Real-time safety net: rAF (and therefore GSAP) is throttled while a tab is
  // backgrounded, which would otherwise trap the visitor on the preloader.
  useEffect(() => {
    const t = setTimeout(finish, 4200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGSAP(
    () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const counter = { v: 0 };
      const tl = gsap.timeline({ onComplete: finish });

      tl.to(counter, {
        v: 100,
        duration: reduced ? 0.3 : 1.9,
        ease: "power2.inOut",
        onUpdate: () => setPct(Math.round(counter.v)),
      });

      // Curtain lift + wordmark exit.
      tl.to(
        ".pl-word, .pl-pct",
        { opacity: 0, y: -18, duration: 0.6, ease: "power3.inOut", stagger: 0.04 },
        "-=0.15",
      );
      tl.to(
        root.current,
        {
          yPercent: -100,
          duration: reduced ? 0.2 : 1.0,
          ease: "power4.inOut",
        },
        "-=0.2",
      );
      tl.set(root.current, { display: "none" });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex items-end justify-between bg-ink px-6 pb-8 md:px-12 md:pb-12"
      aria-hidden
    >
      <div className="pl-word font-display text-[15vw] leading-none tracking-tight text-paper md:text-[8vw]">
        L<span className="text-cyan">/</span>Air
      </div>
      <div className="pl-pct font-display text-2xl tabular-nums text-paper-dim md:text-4xl">
        {String(pct).padStart(3, "0")}
      </div>
    </div>
  );
}
