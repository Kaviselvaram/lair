"use client";

import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import SectionMesh from "@/components/ui/SectionMesh";

const TIERS = [
  {
    name: "Private",
    tag: "On-demand",
    line: "Fly on request. Pay for the flight, never the aircraft.",
    points: ["Access within 24 hours", "Global fleet, no ownership", "Fixed, transparent pricing"],
  },
  {
    name: "Signature",
    tag: "Priority",
    line: "Guaranteed availability and a service that already knows you.",
    points: ["Guaranteed aircraft", "Dedicated concierge", "Priority slots & routing"],
    featured: true,
  },
  {
    name: "Black",
    tag: "By invitation",
    line: "The whole network, open. Invitation only.",
    points: ["Unrestricted global access", "Bespoke aircraft & crew", "Anonymous by default"],
  },
];

export default function Membership() {
  return (
    <section
      id="membership"
      className="relative z-10 overflow-hidden px-5 py-28 md:px-10 md:py-40"
      aria-label="Membership"
    >
      <SectionMesh veil={0.58} />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col justify-between gap-6 md:mb-24 md:flex-row md:items-end">
          <h2 className="u-display text-[12vw] leading-[0.9] text-paper md:text-[6vw]">
            <SplitText text="ACCESS," as="span" className="block" />
            <SplitText text="WITHOUT THE WAIT." as="span" className="block" />
          </h2>
          <Reveal as="p" className="max-w-sm text-lg leading-relaxed text-paper-dim">
            Three ways to fly with L/Air. Each one removes something between you
            and the sky.
          </Reveal>
        </div>

        <div className="grid gap-px overflow-hidden border-y border-line md:grid-cols-3 md:border">
          {TIERS.map((t, i) => (
            <Reveal
              key={t.name}
              delay={i * 0.08}
              className={`relative flex flex-col justify-between border-line px-7 py-10 transition-colors duration-500 md:px-8 md:py-12 ${
                i > 0 ? "border-t md:border-l md:border-t-0" : ""
              } ${t.featured ? "bg-white/[0.03]" : "hover:bg-white/[0.02]"}`}
            >
              {t.featured && (
                <span className="absolute right-6 top-8 h-2 w-2 rounded-full bg-cyan shadow-[0_0_16px_4px_rgba(53,230,255,0.6)]" />
              )}
              <div>
                <p className="u-eyebrow mb-6">L/Air · {t.tag}</p>
                <h3 className="font-display text-5xl tracking-tight text-paper md:text-6xl">
                  {t.name}
                </h3>
                <p className="mt-5 max-w-xs text-[0.98rem] leading-relaxed text-paper-dim">
                  {t.line}
                </p>
              </div>
              <ul className="mt-10 space-y-3">
                {t.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-3 text-sm text-paper-dim"
                  >
                    <span className="mt-[7px] h-px w-4 shrink-0 bg-cyan/70" />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 flex flex-col items-center gap-6 text-center">
          <p className="max-w-md text-balance text-paper-dim">
            Not sure which tier? Tell us where you want to be, and when.
          </p>
          <MagneticButton href="#enquire">Request access</MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}
