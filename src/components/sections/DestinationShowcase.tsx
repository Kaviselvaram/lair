"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { state } from "@/lib/store";
import { destinations, HUB, regions, type Region } from "@/data/destinations";
import Icon from "@/components/ui/Icon";

function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLon = ((bLon - aLon) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) *
      Math.cos((bLat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(s)));
}

export default function DestinationShowcase() {
  const root = useRef<HTMLDivElement>(null);
  const [region, setRegion] = useState<Region | "ALL">("ALL");
  const [selected, setSelected] = useState(0);
  const kmRef = useRef<HTMLSpanElement>(null);
  const hrRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const list =
    region === "ALL" ? destinations : destinations.filter((d) => d.region === region);
  const d = destinations[selected];
  const km = haversineKm(HUB.lat, HUB.lon, d.lat, d.lon);
  const hours = km / 850; // private-jet cruise

  // Animate the figures + redraw the route whenever the selection changes.
  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const kmObj = { v: 0 };
      const hrObj = { v: 0 };
      const setKm = () => kmRef.current && (kmRef.current.textContent = Math.round(kmObj.v).toLocaleString());
      const setHr = () => hrRef.current && (hrRef.current.textContent = hrObj.v.toFixed(1));
      gsap.to(kmObj, { v: km, duration: reduced ? 0 : 1, ease: "power2.out", onUpdate: setKm });
      gsap.to(hrObj, { v: hours, duration: reduced ? 0 : 1, ease: "power2.out", onUpdate: setHr });

      const path = pathRef.current;
      if (path && !reduced) {
        const len = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" },
        );
      }
    },
    { dependencies: [selected], scope: root },
  );

  // Subtle pointer parallax on the imagery.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      let raf = 0;
      const loop = () => {
        const el = root.current?.querySelector<HTMLElement>(".dshow-media");
        if (el) {
          el.style.transform = `scale(1.06) translate(${state.smooth.x * -1.4}%, ${state.smooth.y * -1.4}%)`;
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(raf);
    },
    { scope: root },
  );

  const go = (dir: number) => {
    const idx = destinations.indexOf(d);
    const next = (idx + dir + destinations.length) % destinations.length;
    setSelected(next);
    // keep region filter in sync-ish: reset to ALL when arrowing
    setRegion("ALL");
  };

  return (
    <section
      id="journeys"
      ref={root}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden py-24 md:py-28"
      aria-label="Journeys — choose a destination"
    >
      {/* Cinematic media that morphs between cities */}
      <div className="dshow-media absolute inset-0 z-[1] will-change-transform">
        {destinations.map((dd, i) => (
          <div
            key={dd.code}
            className="absolute inset-0"
            style={{
              opacity: i === selected ? 1 : 0,
              transform: i === selected ? "scale(1)" : "scale(1.06)",
              transition: "opacity 0.9s ease, transform 1.2s ease",
              willChange: "opacity, transform",
            }}
          >
            <Image
              src={dd.image!}
              alt={`${dd.city}, ${dd.country}`}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/10 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-5 md:px-10">
        <div className="flex items-center justify-between">
          <p className="u-eyebrow flex items-center gap-3">
            <Icon name="route" size={16} className="text-cyan" /> The world, with no middle
          </p>
          <div className="hidden gap-3 md:flex">
            {(["ALL", ...regions] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRegion(r);
                  const first = r === "ALL" ? destinations[0] : destinations.find((x) => x.region === r);
                  if (first) setSelected(destinations.indexOf(first));
                }}
                className={`font-mono text-[0.62rem] uppercase tracking-[0.2em] transition-colors ${
                  region === r ? "text-cyan" : "text-paper-faint hover:text-paper"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Centre: the place */}
      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-5 md:px-10">
        <div className="grid items-end gap-8 md:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="u-eyebrow mb-3 text-cyan">
              {d.code} · {d.region}
            </p>
            <h2 className="u-display text-[15vw] leading-[0.85] text-paper u-scrim-text md:text-[8.5vw]">
              {d.city}
            </h2>
            <p className="mt-4 max-w-md text-balance text-lg text-paper-dim u-scrim-text">
              {d.note}
            </p>
          </div>

          {/* Flight data + route */}
          <div className="glass rounded-3xl p-6 md:p-7">
            <div className="mb-5 grid grid-cols-2 gap-4">
              <div>
                <div className="font-display text-3xl font-light text-paper md:text-4xl">
                  <span ref={kmRef}>0</span>
                  <span className="text-lg text-paper-faint"> km</span>
                </div>
                <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-paper-faint">
                  Great-circle distance
                </div>
              </div>
              <div>
                <div className="font-display text-3xl font-light text-paper md:text-4xl">
                  <span ref={hrRef}>0</span>
                  <span className="text-lg text-paper-faint"> h</span>
                </div>
                <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-paper-faint">
                  Est. flight time
                </div>
              </div>
            </div>
            {/* Animated route arc */}
            <svg viewBox="0 0 300 70" className="w-full" aria-hidden>
              <defs>
                <linearGradient id="routeg" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="var(--electric)" />
                  <stop offset="1" stopColor="var(--aurora)" />
                </linearGradient>
              </defs>
              <path
                ref={pathRef}
                d="M12 58 C 90 -6, 210 -6, 288 58"
                fill="none"
                stroke="url(#routeg)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="12" cy="58" r="4" fill="var(--electric)" />
              <circle cx="288" cy="58" r="4" fill="var(--aurora)" />
              <text x="12" y="70" className="fill-[var(--paper-faint)] font-mono" fontSize="8" textAnchor="start">LONDON</text>
              <text x="288" y="70" className="fill-[var(--paper-faint)] font-mono" fontSize="8" textAnchor="end">
                {d.city.toUpperCase()}
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Selector rail */}
      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-5 md:px-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => go(-1)}
            aria-label="Previous destination"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-paper transition-colors hover:border-cyan"
          >
            <Icon name="arrow-left" size={18} />
          </button>
          <div className="flex flex-1 gap-2 overflow-x-auto [scrollbar-width:none]" style={{ scrollbarWidth: "none" }}>
            {list.map((dd) => {
              const idx = destinations.indexOf(dd);
              return (
                <button
                  key={dd.code}
                  onClick={() => setSelected(idx)}
                  className={`shrink-0 rounded-full border px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] transition-all ${
                    idx === selected
                      ? "border-cyan bg-white/[0.06] text-paper glow-cyan"
                      : "border-line text-paper-dim hover:border-line-strong hover:text-paper"
                  }`}
                >
                  {dd.city}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="Next destination"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-paper transition-colors hover:border-cyan"
          >
            <Icon name="arrow-right" size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
