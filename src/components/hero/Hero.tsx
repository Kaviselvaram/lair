"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import MagneticButton from "@/components/ui/MagneticButton";
import AtmosphereOverlay from "@/components/ui/AtmosphereOverlay";
import Counter from "@/components/ui/Counter";
import Icon from "@/components/ui/Icon";
import { destinations } from "@/data/destinations";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const base = reduced ? 0 : 2.6;

      // Line mask reveal for the headline (keeps gradient fills intact).
      gsap.set(".hero-line-inner", { yPercent: 120 });
      gsap.to(".hero-line-inner", {
        yPercent: 0,
        duration: 1.3,
        ease: "power4.out",
        stagger: 0.12,
        delay: base,
      });

      gsap.fromTo(
        ".hero-fade",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", stagger: 0.1, delay: base + 0.5 },
      );

      if (!reduced) {
        gsap.to(".hero-photo", {
          scale: 1.12,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero-copy", {
          yPercent: -12,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        });
      }
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-8 pt-28 md:pb-10"
      aria-label="L/Air — Above the weather"
    >
      {/* Real aircraft — the luxury subject */}
      <div className="absolute inset-0 z-[1]">
        <Image
          src="/img/hero-jet.jpg"
          alt="A private jet at golden hour, head-on on the ramp"
          fill
          priority
          sizes="100vw"
          className="hero-photo object-cover object-center"
          style={{ filter: "contrast(1.05) saturate(1.12)" }}
        />
        {/* Colour — cursor-reactive iridescence over the photograph */}
        <AtmosphereOverlay intensity={0.65} blend="screen" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />
      </div>

      <div className="hero-copy relative z-10 mx-auto w-full max-w-[1500px] px-5 md:px-10">
        <p className="hero-fade u-eyebrow mb-6 flex items-center gap-3 opacity-0">
          <span className="inline-flex h-2 w-2 rounded-full bg-aurora shadow-[0_0_12px_2px_var(--aurora)]" />
          Private aviation, reauthored — Est. 45,000 ft
        </p>

        <h1 className="u-display text-paper u-scrim-text">
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="hero-line-inner block text-[16vw] font-light leading-[0.82] md:text-[12.5vw] lg:text-[11vw]">
              Above the
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.12em]">
            <span
              className="hero-line-inner text-clip-img block text-[16vw] italic leading-[0.82] md:text-[12.5vw] lg:text-[11vw]"
              style={{ backgroundImage: "url(/img/text-sky.jpg)" }}
            >
              weather.
            </span>
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between">
          <p className="hero-fade max-w-md text-balance text-base leading-relaxed text-paper-dim opacity-0 u-scrim-text md:text-lg">
            On-demand and members-only, for a generation that refuses the middle.
            Every flight begins with a different sky.
          </p>

          <div className="hero-fade flex items-center gap-5 opacity-0">
            <MagneticButton href="#enquire" ariaLabel="Enquire about a flight">
              Request a flight
              <Icon name="enquire" size={16} />
            </MagneticButton>
          </div>
        </div>

        {/* Interactive stat row */}
        <div className="hero-fade mt-10 grid max-w-2xl grid-cols-3 gap-6 border-t border-line pt-6 opacity-0 md:mt-12">
          {[
            { v: 600, s: "+", l: "Global airports" },
            { v: 24, s: "h", l: "Access, on request" },
            { v: 45000, s: "ft", l: "Above the weather" },
          ].map((stat) => (
            <div key={stat.l}>
              <div className="font-display text-3xl font-light text-paper md:text-5xl">
                <Counter value={stat.v} suffix={stat.s} />
              </div>
              <div className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-paper-faint">
                {stat.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Destination marquee */}
      <div className="hero-fade relative z-10 mt-10 overflow-hidden border-y border-line py-3 opacity-0 md:mt-14">
        <div className="marquee-track">
          {[...destinations, ...destinations].map((d, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-6 font-mono text-sm uppercase tracking-[0.24em] text-paper-dim">
              {d.city}
              <span className="text-cyan">✦</span>
            </span>
          ))}
        </div>
      </div>

      <div className="hero-fade pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 opacity-0">
        <Icon name="scroll" size={18} className="animate-[floatY_1.8s_ease-in-out_infinite] text-cyan" />
      </div>

      <style>{`@keyframes floatY{0%,100%{transform:translateY(-3px)}50%{transform:translateY(4px)}}`}</style>
    </section>
  );
}
