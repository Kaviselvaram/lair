"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import SplitText from "@/components/ui/SplitText";
import AtmosphereOverlay from "@/components/ui/AtmosphereOverlay";
import Icon from "@/components/ui/Icon";

/**
 * A full-bleed statement of the real aircraft — parallaxed, graded with the
 * cursor-reactive atmosphere. Real object, digital cinema.
 */
export default function AircraftBand() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.to(".band-photo", {
        scale: 1.14,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative z-10 flex h-[80vh] items-end overflow-hidden md:h-screen"
      aria-label="The fleet"
    >
      <div className="absolute inset-0 z-[1]">
        <Image
          src="/img/jet-tarmac-blue.jpg"
          alt="An L/Air aircraft — a Dassault Falcon on the ramp"
          fill
          sizes="100vw"
          className="band-photo object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/40" />
        <AtmosphereOverlay intensity={0.7} />
      </div>

      <div className="relative z-10 w-full px-5 pb-16 md:px-10 md:pb-24">
        <p className="u-eyebrow mb-4 flex items-center gap-3">
          <Icon name="altitude" size={16} className="text-cyan" /> The fleet
        </p>
        <h2 className="u-display max-w-4xl text-[11vw] leading-[0.9] text-paper u-scrim-text md:text-[6vw]">
          <SplitText text="ONE AIRCRAFT," as="span" className="block" />
          <SplitText text="ENTIRELY YOURS." as="span" className="block" />
        </h2>
        <p className="mt-6 max-w-md text-paper-dim u-scrim-text">
          Ultra-long-range jets, maintained to a standard you will never see —
          because it is the part you never have to think about.
        </p>
      </div>
    </section>
  );
}
