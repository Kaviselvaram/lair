# L/Air — *Above the Weather*

An immersive, colourful one-page brand experience for **L/Air**, a fictional
next-generation luxury private-jet brand for young ultra-high-net-worth
travellers.

Guiding idea: **real subjects, digital cinema.** Real photography leads; a living
iridescent atmosphere, luxury editorial type and kinetic motion make it feel
alive and expensive. Buttery smooth — no WebGL, no heavy 3D.

> The sky controls the colour. The cursor controls the sky.

## The experience

- **Hero** — a real jet at golden hour under a huge editorial headline
  (*Above the / weather.* — the second line an animated iridescent gradient),
  live stat counters and a destination marquee. A cursor-reactive atmosphere
  grades the photograph.
- **Journeys** — a cinematic destination showcase: full-bleed real photography
  of each city that morphs on selection, with animated great-circle distance +
  flight-time figures and a route arc that draws itself. (Replaces the old 3D
  globe — cooler, faster, photography-forward.)
- **Cabin / Fleet** — real private-jet interior and aircraft photography.
- **Destinations** — a horizontal editorial gallery of real places.
- **Membership** — three access tiers as editorial type, not SaaS cards.
- **Enquiry** — a real, accessible six-step request flow → concierge confirmation.

Colour comes from a **living mesh-gradient** behind the content sections —
GPU-composited blurred colour blobs that drift and follow the pointer.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger ·
Lenis smooth-scroll. Typography: **Fraunces** (display), Inter (body),
Space Grotesk (mono/labels).

## Architecture

```
src/
  app/            layout, page, /api/enquiry route
  components/
    ui/           Icon (bespoke SVG set), SectionMesh, SplitText, Counter,
                  MagneticButton, Reveal, AtmosphereOverlay, AtmoImage
    hero/ navigation/ preloader/ enquiry/ sections/
  lib/            store (frame-loop pointer/scroll state), gsap setup
  data/           destinations
public/img/       optimised local photography
```

Notes:
- **No WebGL / 3D.** Colour is a per-section CSS mesh gradient (`SectionMesh`) —
  reliable in every browser, and very cheap (CSS keyframe drift + one global
  pointer variable set per frame in `SmoothScroll`).
- Shared pointer/scroll state lives in a **mutable store** read in animation
  loops, so per-frame updates never trigger React re-renders.
- A **bespoke SVG icon language** (`ui/Icon.tsx`) — no third-party icon set.
- **`prefers-reduced-motion`** is honoured throughout.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Image credits

Photography from **[Pexels](https://www.pexels.com)** under the free Pexels
licence, served locally (optimised) from `public/img`. Replace with fully
licensed brand assets before any production use.

*L/Air is a fictional brand created for this design exercise.*
