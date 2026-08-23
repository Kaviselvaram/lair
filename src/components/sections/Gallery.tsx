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

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const el = track.current!;
        const scrollLen = el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: -scrollLen,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${scrollLen + window.innerHeight * 0.6}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        return () => tween.kill();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="destinations"
      ref={root}
      className="relative z-10 overflow-hidden py-20 md:py-0"
      aria-label="Destinations"
    >
      <SectionMesh veil={0.66} />
      <div className="relative z-10 md:flex md:h-[100svh] md:flex-col md:justify-center md:overflow-hidden">
        <div className="px-5 md:px-10">
          <p className="u-eyebrow mb-4">Destinations</p>
          <h2 className="u-display mb-10 text-[11vw] leading-[0.9] text-paper md:mb-14 md:text-[5vw]">
            <SplitText text="GO WHERE THE LIGHT CHANGES." as="span" />
          </h2>
        </div>

        {/* Track: horizontal on desktop (scrubbed), native swipe on mobile */}
        <div
          ref={track}
          className="flex gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:gap-8 md:overflow-visible md:px-10 md:pb-0"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {destinations.map((d, i) => (
            <article
              key={d.code}
              className="group relative aspect-[3/4] w-[78vw] shrink-0 overflow-hidden rounded-3xl border border-line md:aspect-[4/5] md:h-[62vh] md:w-auto"
              style={{ scrollSnapAlign: "start" }}
            >
              <AtmoImage
                src={d.image}
                alt={`${d.city}, ${d.country} — ${d.imageQuery}`}
                from={HUES[i][0]}
                to={HUES[i][1]}
                className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 78vw, 40vw"
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
