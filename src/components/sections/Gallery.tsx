"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { destinations } from "@/data/destinations";
import AtmoImage from "@/components/ui/AtmoImage";
import SplitText from "@/components/ui/SplitText";
import SectionMesh from "@/components/ui/SectionMesh";

const HUES: [string, string][] = [
  ["#6d2c6b", "#12123a"], // Tokyo
  ["#8a5a2b", "#1a0f2e"], // Dubai
  ["#b0483f", "#241033"], // Ibiza
  ["#274b8a", "#0a1030"], // Monaco
  ["#1f7d7a", "#04213a"], // Maldives
  ["#3a3f6b", "#0a0a24"], // New York
  ["#7a5a2e", "#141033"], // Cape Town
];

export default function Gallery() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    if (track.current) {
      track.current.scrollBy({ left: dir * 420, behavior: "smooth" });
    }
  };

  return (
    <section
      id="destinations"
      ref={root}
      className="relative z-10 overflow-hidden py-24 md:py-32"
      aria-label="Destinations"
    >
      <SectionMesh veil={0.66} />
      <div className="relative z-10">
        <div className="mx-auto flex max-w-7xl items-end justify-between px-5 md:px-10">
          <div>
            <p className="u-eyebrow mb-4">Destinations</p>
            <h2 className="u-display text-[11vw] leading-[0.9] text-paper md:text-[5vw]">
              <SplitText text="GO WHERE THE LIGHT CHANGES." as="span" />
            </h2>
          </div>
          <div className="hidden gap-3 md:flex">
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-paper transition-colors hover:border-cyan"
            >
              ←
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-paper transition-colors hover:border-cyan"
            >
              →
            </button>
          </div>
        </div>

        {/* Track: fluid horizontal swipe with smooth momentum */}
        <div
          ref={track}
          className="mt-12 flex gap-5 overflow-x-auto px-5 pb-6 [scrollbar-width:none] md:gap-7 md:px-10"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {destinations.map((d, i) => (
            <article
              key={d.code}
              className="group relative aspect-[3/4] w-[75vw] shrink-0 overflow-hidden rounded-3xl border border-line transition-transform duration-500 hover:scale-[1.02] md:aspect-[4/5] md:h-[58vh] md:w-auto"
              style={{ scrollSnapAlign: "start", transform: "translateZ(0)" }}
            >
              <AtmoImage
                src={d.image}
                alt={`${d.city}, ${d.country} — ${d.imageQuery}`}
                from={HUES[i][0]}
                to={HUES[i][1]}
                className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 75vw, 38vw"
              />
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <div className="flex items-start justify-between">
                  <span className="font-display text-[0.7rem] uppercase tracking-[0.24em] text-paper/80">
                    {d.region}
                  </span>
                  <span className="font-display text-[0.7rem] tracking-[0.2em] text-cyan">
                    {d.code}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-4xl leading-none text-paper md:text-5xl">
                    {d.city}
                  </h3>
                  <p className="mt-3 max-w-[24ch] text-sm leading-relaxed text-paper-dim opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {d.note}
                  </p>
                </div>
              </div>
            </article>
          ))}
          <div className="shrink-0 md:w-10" aria-hidden />
        </div>
      </div>
    </section>
  );
}
