"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Counts up to `value` when scrolled into view (or on mount). */
export default function Counter({
  value,
  suffix = "",
  prefix = "",
  duration = 1.6,
  className = "",
  play = "scroll",
  delay = 0,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  play?: "scroll" | "mount";
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const obj = { v: 0 };
      const set = () => {
        el.textContent = prefix + Math.round(obj.v).toLocaleString() + suffix;
      };
      set();
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        obj.v = value;
        set();
        return;
      }
      gsap.to(obj, {
        v: value,
        duration,
        delay,
        ease: "power2.out",
        onUpdate: set,
        ...(play === "scroll"
          ? { scrollTrigger: { trigger: el, start: "top 88%", once: true } }
          : {}),
      });
    },
    { scope: ref },
  );

  return <span ref={ref} className={className} />;
}
