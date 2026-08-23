"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import AtmoImage from "@/components/ui/AtmoImage";
import SectionMesh from "@/components/ui/SectionMesh";

const ATTRS = [
  { n: "01", label: "Silence", note: "A cabin engineered below a whisper." },
  { n: "02", label: "Space", note: "Room to think at forty-five thousand feet." },
  { n: "03", label: "Precision", note: "Every surface, considered and re-considered." },
  { n: "04", label: "Privacy", note: "No manifest. No middle. No audience." },
];

export default function Cabin() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      // Slow parallax on the cabin image as it scrolls through.
      gsap.to(".cabin-media", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root },
  );

  return (
    <section
      id="fleet"
      ref={root}
      className="relative z-10 overflow-hidden px-5 py-28 md:px-10 md:py-40"
      aria-label="The cabin"
    >
      <SectionMesh veil={0.55} />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div className="relative">
          <p className="u-eyebrow mb-5">Inside</p>
          <h2 className="u-display text-[13vw] leading-[0.9] text-paper md:text-[8vw] lg:text-[5.4vw]">
            <SplitText text="PRIVATE" as="span" className="block" />
            <SplitText text="BY DESIGN." as="span" className="block" />
          </h2>
          <Reveal as="p" className="mt-8 max-w-md text-lg leading-relaxed text-paper-dim">
            The interior is not decorated. It is authored — for stillness,
            distance and the quiet certainty that the space is entirely yours.
          </Reveal>

          <ul className="mt-12 divide-y divide-line border-y border-line">
            {ATTRS.map((a, i) => (
              <Reveal
                as="li"
                key={a.n}
                delay={i * 0.05}
                className="group flex items-baseline gap-5 py-5"
              >
                <span className="font-display text-xs tabular-nums text-cyan">
                  {a.n}
                </span>
                <span className="font-display text-2xl text-paper md:text-3xl">
                  {a.label}
                </span>
                <span className="ml-auto max-w-[46%] text-right text-sm text-paper-faint transition-colors group-hover:text-paper-dim">
                  {a.note}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal className="relative">
          <AtmoImage
            src="/img/cabin-leather.jpg"
            alt="Inside an L/Air cabin — leather seating, wood, warm ambient light"
            className="cabin-media aspect-[4/5] w-full rounded-3xl"
            sizes="(max-width: 1024px) 90vw, 45vw"
          />
          <div className="absolute -bottom-5 left-6 rounded-full border border-line bg-ink/60 px-5 py-2 backdrop-blur-md">
            <span className="font-display text-[0.68rem] uppercase tracking-[0.22em] text-paper-dim">
              45,000 ft · cabin altitude 4,800 ft
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
