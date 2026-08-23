"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { scrollToTarget } from "@/components/SmoothScrollProvider";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "solid" | "ghost";
  ariaLabel?: string;
};

/**
 * The one emphasised control. Subtle magnetic pull + fast colour response.
 * Deliberately restrained so it never competes with the sky interaction.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  className = "",
  variant = "solid",
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.3;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.4;
    gsap.to(el, { x, y, duration: 0.5, ease: "power3.out" });
    gsap.to(inner.current, { x: x * 0.35, y: y * 0.35, duration: 0.5, ease: "power3.out" });
  };
  const onLeave = () => {
    gsap.to([ref.current, inner.current], {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.4)",
    });
  };

  const base =
    "group relative inline-flex items-center justify-center rounded-full px-7 py-3 " +
    "text-[0.78rem] tracking-[0.16em] uppercase font-mono font-medium " +
    "transition-colors duration-300 will-change-transform select-none";
  const skin =
    variant === "solid"
      ? "bg-paper text-ink hover:bg-white"
      : "border border-line-strong text-paper hover:border-cyan/70 hover:text-white";

  const handleClick = () => {
    if (onClick) onClick();
    else if (href?.startsWith("#")) scrollToTarget(href);
    else if (href) window.location.href = href;
  };

  return (
    <button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`${base} ${skin} ${className}`}
    >
      <span ref={inner} className="inline-flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}
