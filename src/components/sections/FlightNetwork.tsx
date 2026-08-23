"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { state } from "@/lib/store";
import SplitText from "@/components/ui/SplitText";
import Reveal from "@/components/ui/Reveal";

/**
 * THE NETWORK — a signature scroll moment.
 * Curved routes fan out from the London hub and *draw themselves* as you
 * scroll (DrawSVG), city nodes ignite, and a jet flies the Tokyo route in
 * real time (MotionPath). Scrubbed, pinned, and reduced-motion aware.
 */

const HUB = { x: 232, y: 402, label: "LONDON" };

// Quadratic arcs from the hub. Order = draw order.
const ROUTES = [
  { id: "ny", d: "M232,402 Q120,220 150,150", node: { x: 150, y: 150 }, label: "NEW YORK", km: "5,585" },
  { id: "mc", d: "M232,402 Q410,250 566,214", node: { x: 566, y: 214 }, label: "MONACO", km: "1,074" },
  { id: "tk", d: "M232,402 Q650,110 1064,152", node: { x: 1064, y: 152 }, label: "TOKYO", km: "9,563", hero: true },
  { id: "mv", d: "M232,402 Q690,380 1086,470", node: { x: 1086, y: 470 }, label: "MALDIVES", km: "8,749" },
  { id: "db", d: "M232,402 Q520,610 812,648", node: { x: 812, y: 648 }, label: "DUBAI", km: "5,498" },
];

export default function FlightNetwork({ staticMode = false }: { staticMode?: boolean }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (staticMode) {
        gsap.set(".fn-route", { drawSVG: "100%" });
        gsap.set(".fn-node", { opacity: 1, scale: 1 });
        gsap.set(".fn-plane", { opacity: 1 });
        return;
      }
      const routes = gsap.utils.toArray<SVGPathElement>(".fn-route");
      const nodes = gsap.utils.toArray<SVGGElement>(".fn-node");
      const plane = root.current!.querySelector<SVGGElement>(".fn-plane");
      const heroPath = root.current!.querySelector<SVGPathElement>("#fn-tk");

      // Base state.
      gsap.set(routes, { drawSVG: "0%" });
      gsap.set(nodes, { opacity: 0, scale: 0, transformOrigin: "center" });
      gsap.set(plane, { opacity: 0 });

      if (state.reducedMotion) {
        gsap.set(routes, { drawSVG: "100%" });
        gsap.set(nodes, { opacity: 1, scale: 1 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 65%",
          once: true,
        },
      });

      const order = ["ny", "mc", "tk", "mv", "db"];
      order.forEach((id, i) => {
        const at = i * 0.22;
        tl.to(`#fn-${id}`, { drawSVG: "100%", duration: 0.8, ease: "power2.out" }, at);
        tl.to(
          `.fn-node[data-id="${id}"]`,
          { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" },
          at + 0.5,
        );
      });

      // The jet flies the Tokyo route while it draws.
      const tkStart = order.indexOf("tk") * 0.22;
      tl.set(plane, { opacity: 1 }, tkStart);
      tl.to(
        plane,
        {
          motionPath: { path: heroPath!, align: heroPath!, alignOrigin: [0.5, 0.5], autoRotate: true },
          duration: 1.1,
          ease: "power1.inOut",
        },
        tkStart,
      );
      tl.to(plane, { opacity: 0, duration: 0.25 }, tkStart + 1.1);
    },
    { scope: root, dependencies: [] },
  );

  return (
    <section
      ref={root}
      className="relative z-10 flex min-h-[100svh] items-center overflow-hidden bg-ink px-5 md:px-10"
      aria-label="The network"
    >
      <div className="pointer-events-none absolute inset-0">
        {/* faint radial glow, keeps the routes luminous */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(60% 60% at 22% 55%, rgba(90,70,220,0.20), transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.4fr] lg:items-center">
        {/* Copy */}
        <div>
          <p className="u-eyebrow mb-5 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-cyan" /> The network
          </p>
          <h2 className="u-display text-[13vw] leading-[0.9] text-paper md:text-[7vw] lg:text-[5vw]">
            <SplitText text="NO" as="span" className="block" />
            <SplitText text="CONNECTIONS." as="span" className="block text-iridescent" />
          </h2>
          <Reveal as="p" className="mt-6 max-w-sm text-lg leading-relaxed text-paper-dim">
            One hub, every city — a single hop. Watch the network find you: the
            route draws itself, the aircraft is already moving.
          </Reveal>
          <Reveal as="div" className="mt-8 flex gap-8">
            <div>
              <div className="font-display text-3xl text-paper">2,300+</div>
              <div className="u-eyebrow mt-1">Airports reachable</div>
            </div>
            <div>
              <div className="font-display text-3xl text-paper">0</div>
              <div className="u-eyebrow mt-1">Layovers, ever</div>
            </div>
          </Reveal>
        </div>

        {/* The map */}
        <div className="relative">
          <svg
            viewBox="0 0 1200 760"
            className="h-auto w-full overflow-visible"
            fill="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="fn-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#8b5cff" />
                <stop offset="0.5" stopColor="#35e6ff" />
                <stop offset="1" stopColor="#46f0c8" />
              </linearGradient>
            </defs>

            {/* Routes */}
            {ROUTES.map((r) => (
              <path
                key={r.id}
                id={`fn-${r.id}`}
                className="fn-route"
                d={r.d}
                stroke={r.hero ? "url(#fn-grad)" : "rgba(244,246,255,0.5)"}
                strokeWidth={r.hero ? 2.4 : 1.4}
                strokeLinecap="round"
              />
            ))}

            {/* Hub */}
            <g>
              <circle cx={HUB.x} cy={HUB.y} r="7" fill="#35e6ff" />
              <circle cx={HUB.x} cy={HUB.y} r="15" stroke="#35e6ff" strokeWidth="1" opacity="0.5" />
              <text x={HUB.x - 4} y={HUB.y + 34} fill="#f4f6ff" className="fn-label" textAnchor="middle">
                {HUB.label}
              </text>
            </g>

            {/* Destination nodes */}
            {ROUTES.map((r) => (
              <g key={r.id} className="fn-node" data-id={r.id}>
                <circle cx={r.node.x} cy={r.node.y} r="5" fill="#f4f6ff" />
                <circle cx={r.node.x} cy={r.node.y} r="11" stroke="#f4f6ff" strokeWidth="1" opacity="0.4" />
                <text
                  x={r.node.x}
                  y={r.node.y - 20}
                  fill="#f4f6ff"
                  className="fn-label"
                  textAnchor="middle"
                >
                  {r.label}
                </text>
                <text
                  x={r.node.x}
                  y={r.node.y + 30}
                  fill="rgba(244,246,255,0.55)"
                  className="fn-label fn-km"
                  textAnchor="middle"
                >
                  {r.km} KM
                </text>
              </g>
            ))}

            {/* The jet */}
            <g className="fn-plane">
              <path
                d="M14,0 L-12,-9 L-5,0 L-12,9 Z"
                fill="#35e6ff"
                stroke="#eaffff"
                strokeWidth="0.6"
              />
            </g>
          </svg>
        </div>
      </div>

      <style jsx>{`
        .fn-label {
          font-family: var(--font-mono), monospace;
          font-size: 15px;
          letter-spacing: 0.18em;
        }
        .fn-km {
          font-size: 12px;
          letter-spacing: 0.14em;
        }
      `}</style>
    </section>
  );
}
