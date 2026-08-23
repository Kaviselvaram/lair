/**
 * Per-section colour: an absolutely-positioned mesh gradient that lives INSIDE
 * a section (as its first child), so content painted after it always sits on
 * top — no z-index games, reliable in every browser. Blobs drift via CSS
 * keyframes and follow the pointer via the global `--mesh-px/--mesh-py`
 * variables (set once per frame in SmoothScroll). Cheap and buttery smooth.
 *
 * The parent section must be `relative overflow-hidden`.
 */

type BlobDef = {
  color: string;
  left: string;
  top: string;
  size: string;
  anim: string;
  dur: number;
  react: number; // px of pointer follow
  opacity: number;
};

const BLOBS: BlobDef[] = [
  { color: "#ff5f9e", left: "6%", top: "10%", size: "48vw", anim: "drift-a", dur: 19, react: 28, opacity: 0.72 },
  { color: "#8b5cff", left: "72%", top: "6%", size: "54vw", anim: "drift-b", dur: 23, react: 38, opacity: 0.78 },
  { color: "#ff4fd8", left: "30%", top: "60%", size: "44vw", anim: "drift-c", dur: 21, react: 22, opacity: 0.6 },
  { color: "#3a6bff", left: "84%", top: "68%", size: "52vw", anim: "drift-d", dur: 25, react: 32, opacity: 0.72 },
  { color: "#2fe6d0", left: "2%", top: "74%", size: "42vw", anim: "drift-b", dur: 27, react: 18, opacity: 0.58 },
];

export default function SectionMesh({
  veil = 0.5,
  className = "",
}: {
  /** 0..1 darkening veil for text contrast. */
  veil?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {BLOBS.map((b, i) => (
        <div
          key={i}
          className="mesh-blob"
          style={{
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            marginLeft: `calc(${b.size} / -2)`,
            marginTop: `calc(${b.size} / -2)`,
            background: `radial-gradient(circle at center, ${b.color} 0%, transparent 62%)`,
            opacity: b.opacity,
            animation: `${b.anim} ${b.dur}s ease-in-out infinite`,
            translate: `calc(var(--mesh-px, 0) * ${b.react}px) calc(var(--mesh-py, 0) * ${b.react}px)`,
          }}
        />
      ))}
      {/* Darkening veil + vignette for contrast. */}
      <div className="absolute inset-0" style={{ background: `rgba(5,5,16,${veil})` }} />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 50%, transparent 40%, rgba(5,5,16,0.55) 100%)",
        }}
      />
    </div>
  );
}
