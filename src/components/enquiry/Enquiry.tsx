"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/lib/gsap";
import SplitText from "@/components/ui/SplitText";
import Icon, { type IconName } from "@/components/ui/Icon";
import SectionMesh from "@/components/ui/SectionMesh";
import { destinations } from "@/data/destinations";

type Data = {
  from: string;
  to: string;
  when: string;
  pax: number;
  tier: string;
  name: string;
  email: string;
};

const STEPS: {
  key: keyof Data;
  icon: IconName;
  label: string;
  question: string;
}[] = [
  { key: "from", icon: "departure", label: "Departure", question: "Where are you departing from?" },
  { key: "to", icon: "arrival", label: "Destination", question: "Where would you like to go?" },
  { key: "when", icon: "calendar", label: "When", question: "When do you want to fly?" },
  { key: "pax", icon: "passengers", label: "Passengers", question: "How many are travelling?" },
  { key: "tier", icon: "access", label: "Access", question: "Which access interests you?" },
  { key: "name", icon: "concierge", label: "You", question: "Who shall the concierge contact?" },
];

const TIERS = ["Private", "Signature", "Black"];

export default function Enquiry() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>({
    from: "", to: "", when: "", pax: 2, tier: "Signature", name: "", email: "",
  });
  const [done, setDone] = useState<null | string>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const panel = useRef<HTMLDivElement>(null);

  const isLast = step === STEPS.length - 1;

  const valid = (): boolean => {
    const s = STEPS[step].key;
    if (s === "pax") return data.pax > 0;
    if (s === "name") return data.name.trim() !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    return String(data[s]).trim() !== "";
  };

  // Animate step transitions (fast — never block the user).
  useEffect(() => {
    if (!panel.current) return;
    gsap.fromTo(panel.current, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" });
  }, [step]);

  const next = async () => {
    if (!valid()) return;
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong");
      setDone(json.reference);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  const s = STEPS[step];

  return (
    <section
      id="enquire"
      className="relative z-10 flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 py-28 md:px-10"
      aria-label="Enquire"
    >
      <SectionMesh veil={0.62} />
      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <header className="mb-12 text-center">
          <p className="u-eyebrow mb-4">Request a flight</p>
          <h2 className="u-display text-[13vw] leading-[0.9] text-paper md:text-[6.5vw]">
            <SplitText text="WHERE TO NEXT?" as="span" />
          </h2>
        </header>

        {/* Progress */}
        <ol className="mb-10 flex items-center justify-center gap-2" aria-hidden>
          {STEPS.map((st, i) => (
            <li
              key={st.key}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === step ? "w-10 bg-cyan" : i < step ? "w-6 bg-paper-dim" : "w-6 bg-line"
              }`}
            />
          ))}
        </ol>

        <div
          className="relative rounded-3xl border border-line bg-white/[0.02] p-7 backdrop-blur-md md:p-10"
          role="group"
          aria-label={`Step ${step + 1} of ${STEPS.length}`}
        >
          <div ref={panel}>
            <div className="mb-6 flex items-center gap-3 text-cyan">
              <Icon name={s.icon} size={22} />
              <span className="font-display text-xs uppercase tracking-[0.24em] text-paper-faint">
                {String(step + 1).padStart(2, "0")} — {s.label}
              </span>
            </div>
            <label
              htmlFor={`field-${s.key}`}
              className="mb-6 block font-display text-2xl text-paper md:text-3xl"
            >
              {s.question}
            </label>

            {s.key === "to" ? (
              <div className="flex flex-wrap gap-2">
                {destinations.map((d) => (
                  <button
                    key={d.code}
                    type="button"
                    onClick={() => setData((v) => ({ ...v, to: d.city }))}
                    className={`rounded-full border px-4 py-2 font-display text-sm transition-colors ${
                      data.to === d.city
                        ? "border-cyan text-paper"
                        : "border-line text-paper-dim hover:border-line-strong"
                    }`}
                  >
                    {d.city}
                  </button>
                ))}
              </div>
            ) : s.key === "pax" ? (
              <div className="flex items-center gap-6">
                <button
                  type="button"
                  aria-label="Fewer passengers"
                  onClick={() => setData((v) => ({ ...v, pax: Math.max(1, v.pax - 1) }))}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-paper transition-colors hover:border-cyan"
                >
                  <span className="text-2xl leading-none">–</span>
                </button>
                <span className="font-display text-5xl tabular-nums text-paper">{data.pax}</span>
                <button
                  type="button"
                  aria-label="More passengers"
                  onClick={() => setData((v) => ({ ...v, pax: Math.min(19, v.pax + 1) }))}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-paper transition-colors hover:border-cyan"
                >
                  <span className="text-2xl leading-none">+</span>
                </button>
              </div>
            ) : s.key === "tier" ? (
              <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Access tier">
                {TIERS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={data.tier === t}
                    onClick={() => setData((v) => ({ ...v, tier: t }))}
                    className={`rounded-2xl border px-5 py-4 text-left transition-colors ${
                      data.tier === t ? "border-cyan bg-white/[0.03]" : "border-line hover:border-line-strong"
                    }`}
                  >
                    <span className="font-display text-lg text-paper">{t}</span>
                    <span className="mt-1 block text-xs text-paper-faint">L/Air {t}</span>
                  </button>
                ))}
              </div>
            ) : s.key === "name" ? (
              <div className="grid gap-4">
                <input
                  id="field-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Full name"
                  value={data.name}
                  onChange={(e) => setData((v) => ({ ...v, name: e.target.value }))}
                  className="w-full rounded-xl border border-line bg-transparent px-5 py-4 text-lg text-paper placeholder:text-paper-faint focus:border-cyan"
                />
                <input
                  id="field-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  value={data.email}
                  onChange={(e) => setData((v) => ({ ...v, email: e.target.value }))}
                  className="w-full rounded-xl border border-line bg-transparent px-5 py-4 text-lg text-paper placeholder:text-paper-faint focus:border-cyan"
                />
              </div>
            ) : (
              <input
                id={`field-${s.key}`}
                type={s.key === "when" ? "date" : "text"}
                value={String(data[s.key])}
                onChange={(e) => setData((v) => ({ ...v, [s.key]: e.target.value }))}
                placeholder={s.key === "from" ? "City or airport" : ""}
                className="w-full rounded-xl border border-line bg-transparent px-5 py-4 text-lg text-paper placeholder:text-paper-faint focus:border-cyan [color-scheme:dark]"
                onKeyDown={(e) => e.key === "Enter" && next()}
              />
            )}

            {error && <p className="mt-4 text-sm text-magenta" role="alert">{error}</p>}

            <div className="mt-9 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep((v) => Math.max(0, v - 1))}
                disabled={step === 0}
                className="flex items-center gap-2 font-display text-sm uppercase tracking-[0.18em] text-paper-dim transition-opacity disabled:pointer-events-none disabled:opacity-0 hover:text-paper"
              >
                <Icon name="arrow-left" size={16} /> Back
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!valid() || sending}
                className="group flex items-center gap-2 rounded-full bg-paper px-7 py-3 font-display text-sm uppercase tracking-[0.18em] text-ink transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {sending ? "Sending" : isLast ? "Send request" : "Continue"}
                <Icon name={isLast ? "enquire" : "arrow-right"} size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {done && <Confirmation reference={done} onClose={() => { setDone(null); setStep(0); }} />}
    </section>
  );
}

function Confirmation({ reference, onClose }: { reference: string; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });
    gsap.fromTo(".confirm-card", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.05 });
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/80 px-6 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="confirm-card relative w-full max-w-lg rounded-3xl border border-line bg-ink-2 p-10 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 text-paper-dim transition-colors hover:text-paper"
        >
          <Icon name="close" size={22} />
        </button>
        <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-cyan/50 text-cyan">
          <Icon name="check" size={26} />
        </span>
        <h3 id="confirm-title" className="u-display text-3xl text-paper md:text-4xl">
          YOUR REQUEST<br />IS IN THE AIR.
        </h3>
        <p className="mx-auto mt-5 max-w-sm text-paper-dim">
          An L/Air concierge will be in touch shortly. Your reference is{" "}
          <span className="font-display text-cyan">{reference}</span>.
        </p>
      </div>
    </div>,
    document.body,
  );
}
