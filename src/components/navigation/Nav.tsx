"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { scrollToTarget } from "@/components/SmoothScrollProvider";
import MagneticButton from "@/components/ui/MagneticButton";
import Icon from "@/components/ui/Icon";

const LINKS = [
  { label: "Journeys", href: "#journeys" },
  { label: "Fleet", href: "#fleet" },
  { label: "Destinations", href: "#destinations" },
  { label: "Membership", href: "#membership" },
];

export default function Nav() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      gsap.fromTo(el, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 2.1, ease: "power3.out" });

      let isHidden = false;
      let lastY = 0;

      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (open) return;
          const y = self.scroll();
          if (y < 80) {
            if (isHidden) {
              isHidden = false;
              gsap.to(el, { yPercent: 0, duration: 0.35, ease: "power2.out", overwrite: "auto" });
            }
          } else if (self.direction === 1 && y - lastY > 8 && !isHidden) {
            isHidden = true;
            gsap.to(el, { yPercent: -140, duration: 0.35, ease: "power2.out", overwrite: "auto" });
          } else if (self.direction === -1 && isHidden) {
            isHidden = false;
            gsap.to(el, { yPercent: 0, duration: 0.35, ease: "power2.out", overwrite: "auto" });
          }
          lastY = y;
        },
      });
      return () => st.kill();
    },
    { scope: ref, dependencies: [open] },
  );

  const go = (href: string) => {
    setOpen(false);
    scrollToTarget(href);
  };

  return (
    <>
      <header
        ref={ref}
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 md:px-10 md:py-6"
      >
        <a
          href="#top"
          onClick={(e) => { e.preventDefault(); go("#top"); }}
          className="font-display text-xl font-medium tracking-tight text-paper u-scrim-text md:text-2xl"
          aria-label="L/Air home"
        >
          L<span className="text-cyan">/</span>Air
        </a>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => { e.preventDefault(); go(l.href); }}
              className="group relative font-display text-[0.8rem] uppercase tracking-[0.2em] text-paper-dim transition-colors hover:text-paper u-scrim-text"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-cyan transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <MagneticButton href="#enquire" variant="ghost" className="!px-6 !py-2.5">
              Enquire <Icon name="enquire" size={15} />
            </MagneticButton>
          </div>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-paper md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? "close" : "menu"} size={22} />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-ink/95 px-6 backdrop-blur-xl transition-opacity duration-300 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {LINKS.map((l) => (
          <button
            key={l.href}
            onClick={() => go(l.href)}
            className="py-2 text-left font-display text-4xl text-paper"
          >
            {l.label}
          </button>
        ))}
        <button
          onClick={() => go("#enquire")}
          className="mt-6 flex items-center gap-3 font-display text-4xl text-cyan"
        >
          Enquire <Icon name="enquire" size={30} />
        </button>
      </div>
    </>
  );
}
