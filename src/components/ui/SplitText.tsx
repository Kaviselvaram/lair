"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Props = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** "mount" plays immediately (after `delay`), "scroll" plays on enter. */
  trigger?: "mount" | "scroll";
  delay?: number;
  /** Per-character stagger. */
  stagger?: number;
};

/**
 * Split-text reveal: characters assemble out of atmospheric light —
 * fade + rise + de-blur, never a cheesy typewriter.
 *
 * Deliberately uses pixel `y` (not yPercent) and no clipping wrapper so the
 * text can NEVER be left in a hidden/clipped state regardless of reduced-motion
 * or hot-reload timing.
 */
export default function SplitText({
  text,
  className = "",
  as = "span",
  trigger = "scroll",
  delay = 0,
  stagger = 0.026,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const Tag = as;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const chars = el.querySelectorAll<HTMLElement>("[data-c]");

      // Always land on the visible state; never leave anything clipped.
      const settle = () =>
        gsap.set(chars, { opacity: 1, y: 0 });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        settle();
        return;
      }

      gsap.set(chars, { opacity: 0, y: "0.5em" });
      const tween = gsap.to(chars, {
        opacity: 1,
        y: 0,
        ease: "power3.out",
        duration: 0.85,
        stagger,
        delay,
        overwrite: "auto",
        ...(trigger === "scroll"
          ? { scrollTrigger: { trigger: el, start: "top 88%", once: true } }
          : {}),
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: ref, dependencies: [text] },
  );

  const words = text.split(" ");

  return (
    <Tag className={className}>
      <span ref={ref as React.RefObject<HTMLDivElement>} className="inline">
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap align-top">
            {word.split("").map((ch, ci) => (
              <span key={ci} data-c className="inline-block">
                {ch}
              </span>
            ))}
            {wi < words.length - 1 && (
              <span data-c className="inline-block">
                &nbsp;
              </span>
            )}
          </span>
        ))}
      </span>
    </Tag>
  );
}
