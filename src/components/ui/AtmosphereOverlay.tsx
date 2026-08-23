"use client";

import { useEffect, useRef } from "react";
import { state } from "@/lib/store";

/**
 * THE SIGNATURE, over real photography.
 * A colourful atmospheric light that follows the pointer and grades whatever
 * sits behind it — dawn → violet → magenta → electric → aurora teal. Blended
 * so the photograph stays recognisable (the light enhances, never buries it).
 * "Every flight begins with a different sky."
 */
export default function AtmosphereOverlay({
  intensity = 1,
  className = "",
  blend = "screen",
}: {
  intensity?: number;
  className?: string;
  blend?: React.CSSProperties["mixBlendMode"];
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let mx = 0.5;
    let my = 0.4;

    const stops = [
      [255, 138, 122], // dawn
      [123, 92, 255], // violet
      [255, 79, 216], // magenta
      [58, 107, 255], // electric
      [53, 230, 255], // cyan
      [70, 240, 200], // aurora
    ];
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const spectrum = (t: number) => {
      t = ((t % 1) + 1) % 1;
      const f = t * (stops.length - 1);
      const i = Math.floor(f);
      const k = f - i;
      const a = stops[i];
      const b = stops[Math.min(stops.length - 1, i + 1)];
      return `rgb(${lerp(a[0], b[0], k) | 0}, ${lerp(a[1], b[1], k) | 0}, ${lerp(
        a[2],
        b[2],
        k,
      )})`;
    };

    let lastTx = -999;
    let lastTy = -999;

    const loop = () => {
      const el = ref.current;
      if (el) {
        const tx = state.smooth.x * 0.5 + 0.5;
        const ty = state.smooth.y * 0.5 + 0.5;
        const dx = Math.abs(tx - lastTx);
        const dy = Math.abs(ty - lastTy);

        if (dx > 0.001 || dy > 0.001 || Math.abs(tx - mx) > 0.002 || Math.abs(ty - my) > 0.002) {
          lastTx = tx;
          lastTy = ty;
          mx += (tx - mx) * 0.08;
          my += (ty - my) * 0.08;
          const hue = 0.08 + state.smooth.x * 0.42;
          const c1 = spectrum(hue);
          const c2 = spectrum(hue + 0.35);
          el.style.setProperty("--mx", `${(mx * 100).toFixed(1)}%`);
          el.style.setProperty("--my", `${(my * 100).toFixed(1)}%`);
          el.style.setProperty("--c1", c1);
          el.style.setProperty("--c2", c2);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        opacity: intensity,
        mixBlendMode: blend,
        background:
          "radial-gradient(55% 50% at var(--mx,50%) var(--my,40%), color-mix(in oklab, var(--c1, #7b5cff) 45%, transparent) 0%, transparent 60%)," +
          "radial-gradient(85% 75% at calc(100% - var(--mx,50%)) 88%, color-mix(in oklab, var(--c2, #35e6ff) 30%, transparent) 0%, transparent 62%)",
      }}
    />
  );
}
