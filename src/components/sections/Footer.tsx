"use client";

import { scrollToTarget } from "@/components/SmoothScrollProvider";
import SplitText from "@/components/ui/SplitText";
import SectionMesh from "@/components/ui/SectionMesh";

const COLS = [
  { title: "Explore", links: [["Journeys", "#journeys"], ["Fleet", "#fleet"], ["Destinations", "#destinations"], ["Membership", "#membership"]] },
  { title: "Company", links: [["Enquire", "#enquire"], ["Concierge", "#enquire"], ["Careers", "#"], ["Press", "#"]] },
  { title: "Legal", links: [["Privacy", "#"], ["Terms", "#"], ["Cookies", "#"], ["Safety", "#"]] },
];

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden px-5 pb-10 pt-24 md:px-10 md:pt-32">
      <SectionMesh veil={0.6} />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <a
              href="#top"
              onClick={(e) => { e.preventDefault(); scrollToTarget(0); }}
              className="font-display text-4xl tracking-tight text-paper md:text-5xl"
            >
              L<span className="text-cyan">/</span>Air
            </a>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper-dim">
              Private aviation, elevated beyond the expected. Above the weather,
              on your schedule.
            </p>
          </div>
          {COLS.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="u-eyebrow mb-5">{c.title}</p>
              <ul className="space-y-3">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      onClick={(e) => {
                        if (href.startsWith("#") && href !== "#") { e.preventDefault(); scrollToTarget(href); }
                      }}
                      className="text-sm text-paper-dim transition-colors hover:text-paper"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mb-14 border-y border-line py-10">
          <p className="u-display text-[11vw] leading-none text-paper/90 md:text-[7vw]">
            <SplitText text="EVERY FLIGHT, A DIFFERENT SKY." as="span" />
          </p>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 text-xs text-paper-faint md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} L/Air. A fictional brand experience.</p>
          <div className="flex gap-6">
            {["Instagram", "X", "LinkedIn"].map((s) => (
              <a key={s} href="#" className="transition-colors hover:text-paper">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
