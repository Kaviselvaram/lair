import type { SVGProps } from "react";

/**
 * L/Air bespoke icon language.
 * One geometric system: 24×24 grid, 1.5 stroke, round joins, aerospace-precise
 * (angles, arcs, crosshairs). No third-party icon set. currentColor throughout.
 */

export type IconName =
  | "menu"
  | "close"
  | "enquire"
  | "arrow-right"
  | "arrow-left"
  | "departure"
  | "arrival"
  | "calendar"
  | "passengers"
  | "access"
  | "concierge"
  | "privacy"
  | "altitude"
  | "route"
  | "globe"
  | "cabin"
  | "check"
  | "scroll";

const P: Record<IconName, React.ReactNode> = {
  // Directional stack — a bespoke aviation glyph, not a hamburger.
  menu: (
    <>
      <path d="M4 8h16M7 12h13M11 16h9" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  // Enquire — a precise paper-dart mark, drawn not filled.
  enquire: (
    <>
      <path d="M21 4L3 11l6 2.4L21 4z" />
      <path d="M21 4l-9 16-2.6-6.6" />
    </>
  ),
  "arrow-right": <path d="M4 12h15m-6-6l6 6-6 6" />,
  "arrow-left": <path d="M20 12H5m6 6l-6-6 6-6" />,
  // Departure — vector lifting off a line.
  departure: (
    <>
      <path d="M3 20h18" />
      <path d="M5 15.5l4 .6 6-6.8a1.6 1.6 0 012.6 1.7L14 18l-3-.2" />
      <path d="M8.5 13.7L6.8 10l1.6.2 2 2.1" />
    </>
  ),
  // Arrival — vector settling onto a line.
  arrival: (
    <>
      <path d="M3 20h18" />
      <path d="M4 9.2l1.4 3.9 8.8 2.4a1.6 1.6 0 00.8-3.1L5.6 8.8 4 5.4" />
    </>
  ),
  // Calendar — a plotted date, corner-cut.
  calendar: (
    <>
      <path d="M5 6h14v13H5zM5 10h14M8 4v3M16 4v3" />
      <path d="M9 14l1.6 1.6L15 12" />
    </>
  ),
  // Passengers — two concentric figures, minimal.
  passengers: (
    <>
      <circle cx="9" cy="8" r="2.6" />
      <path d="M4 19c0-3 2.4-5 5-5s5 2 5 5" />
      <path d="M16 6.4A2.6 2.6 0 0117 11" />
      <path d="M15.5 14.2c2 .5 3.5 2.4 3.5 4.8" />
    </>
  ),
  // Access — a keyed altitude band.
  access: (
    <>
      <path d="M4 12h9" />
      <circle cx="16" cy="12" r="3" />
      <path d="M19 12h1M16 9V4M16 20v-5" />
    </>
  ),
  concierge: (
    <>
      <path d="M5 18h14" />
      <path d="M6.5 15a5.5 5.5 0 0111 0z" />
      <path d="M12 9.5V7M12 5.5a.6.6 0 100-1 .6.6 0 000 1z" />
    </>
  ),
  // Privacy — a shielded aperture.
  privacy: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6z" />
      <circle cx="12" cy="11" r="2.2" />
    </>
  ),
  // Altitude — level ascending markers.
  altitude: (
    <>
      <path d="M3 20h18" />
      <path d="M6 20v-4M11 20V9M16 20v-8" />
      <path d="M4 12l7-6 3 2 6-4" />
    </>
  ),
  // Route — origin arc to destination.
  route: (
    <>
      <circle cx="5" cy="18" r="1.6" />
      <circle cx="19" cy="6" r="1.6" />
      <path d="M6.4 16.6C9 12 13 8.5 17.6 7.2" strokeDasharray="1 2.4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.6 2.4 2.6 14.6 0 17M12 3.5c-2.6 2.4-2.6 14.6 0 17" />
    </>
  ),
  // Cabin — a fuselage window band.
  cabin: (
    <>
      <path d="M3 12c3-4 15-4 18 0-3 4-15 4-18 0z" />
      <path d="M8 10.6v2.8M12 10.4v3.2M16 10.6v2.8" />
    </>
  ),
  check: <path d="M4 12.5l5 5L20 6" />,
  scroll: (
    <>
      <path d="M12 4v13m0 0l-4-4m4 4l4-4" />
    </>
  ),
};

type Props = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
  title?: string;
};

export default function Icon({ name, size = 20, title, ...rest }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {P[name]}
    </svg>
  );
}
