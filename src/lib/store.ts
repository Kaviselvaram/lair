/**
 * Global mutable runtime state shared between the DOM/GSAP layer and the
 * animation loops (mesh gradient, canvases). Deliberately NOT React state:
 * reading/writing every frame must never trigger a re-render.
 */

export type LairState = {
  /** Normalised pointer, -1..1, raw target from the mouse. */
  pointer: { x: number; y: number };
  /** Smoothed pointer that visuals actually follow. */
  smooth: { x: number; y: number };
  /** Whole-page scroll progress 0..1. */
  scroll: number;
  reducedMotion: boolean;
  touch: boolean;
};

export const state: LairState = {
  pointer: { x: 0, y: 0 },
  smooth: { x: 0, y: 0 },
  scroll: 0,
  reducedMotion: false,
  touch: false,
};

let bound = false;

export function bindPointer() {
  if (bound || typeof window === "undefined") return;
  bound = true;

  state.touch = window.matchMedia("(pointer: coarse)").matches;
  state.reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const onMove = (e: PointerEvent) => {
    state.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    state.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  const onTilt = (e: DeviceOrientationEvent) => {
    if (e.gamma == null || e.beta == null) return;
    state.pointer.x = Math.max(-1, Math.min(1, e.gamma / 35));
    state.pointer.y = Math.max(-1, Math.min(1, (e.beta - 45) / 35));
  };
  if (state.touch) {
    window.addEventListener("deviceorientation", onTilt, { passive: true });
  }
}

/** Frame-rate independent smoothing of the pointer. */
export function updateSmooth(dt: number) {
  const k = state.reducedMotion ? 1 : 1 - Math.pow(0.0018, dt);
  state.smooth.x += (state.pointer.x - state.smooth.x) * k;
  state.smooth.y += (state.pointer.y - state.smooth.y) * k;
}
