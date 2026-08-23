"use client";

import Image from "next/image";

type Props = {
  src?: string;
  alt: string;
  /** Hue pair for the atmospheric placeholder when no src is present. */
  from?: string;
  to?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * A cinematic image slot. When a real (optimised, local) asset is supplied it
 * renders via next/image; otherwise it falls back to an art-directed
 * atmospheric gradient so the composition never breaks — the same palette
 * language as the rest of the site.
 */
export default function AtmoImage({
  src,
  alt,
  from = "#3a2a7a",
  to = "#0a1030",
  className = "",
  priority,
  sizes = "100vw",
}: Props) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative overflow-hidden ${className}`}
      style={{
        background:
          `radial-gradient(120% 100% at 25% 15%, ${from} 0%, transparent 55%),` +
          `radial-gradient(100% 90% at 85% 30%, ${to} 0%, transparent 60%),` +
          `radial-gradient(140% 120% at 50% 110%, #05060a 20%, transparent 70%),` +
          `linear-gradient(160deg, ${from} 0%, ${to} 60%, #05060a 100%)`,
      }}
    >
      {/* Soft horizon light + grain to read as atmosphere, not a flat swatch. */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 8%, rgba(255,255,255,0.5), transparent 70%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
    </div>
  );
}
