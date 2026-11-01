"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import BrandIcon, { type IconName } from "./BrandIcon";
import { Mark } from "./Brand";

/* Stage coordinates are percentages of a square stage (0–100 on both axes). */
type Pt = [number, number];

const CHAPTERS = [
  { title: "Audit", body: "We ask the assistants your buyers ask." },
  { title: "Build", body: "Engineers build a real project with your product." },
  { title: "Ship", body: "One build becomes every channel." },
  { title: "Track", body: "A monthly AI visibility report. Done for you." },
];

const BLOB: Pt[] = [
  [50, 50],
  [50, 50],
  [50, 50],
  [50, 24],
];
const BLOB_SCALE = [0.78, 1, 0.92, 0.62];

type Node = {
  icon: IconName;
  label?: string;
  at: Partial<Record<number, Pt>>;
  /** Beam direction per step: out = from the studio, in = into it. */
  flow: "in" | "out";
  named?: boolean;
};

const NODES: Node[] = [
  { icon: "chatgpt", at: { 0: [18, 20] }, flow: "out" },
  { icon: "claude", at: { 0: [50, 11] }, flow: "out", named: true },
  { icon: "gemini", at: { 0: [82, 20] }, flow: "out" },
  { icon: "cursor", at: { 1: [15, 32] }, flow: "in" },
  { icon: "codex", at: { 1: [15, 68] }, flow: "in" },
  { icon: "github", at: { 1: [85, 50] }, flow: "in" },
  { icon: "youtube", label: "video", at: { 2: [15, 28] }, flow: "out" },
  { icon: "article", label: "blog", at: { 2: [15, 66] }, flow: "out" },
  { icon: "markdown", label: "docs", at: { 2: [50, 84] }, flow: "out" },
  { icon: "x", label: "posts", at: { 2: [85, 28] }, flow: "out" },
  { icon: "linkedin", label: "posts", at: { 2: [85, 66] }, flow: "out" },
];

const REPORT: { icon: IconName; name: string; w: number }[] = [
  { icon: "chatgpt", name: "ChatGPT", w: 42 },
  { icon: "claude", name: "Claude", w: 68 },
  { icon: "gemini", name: "Gemini", w: 55 },
];

const nearest = (at: Node["at"], step: number): Pt => {
  for (let d = 0; d < 4; d++) {
    if (at[step - d]) return at[step - d]!;
    if (at[step + d]) return at[step + d]!;
  }
  return [50, 50];
};

const pos = ([x, y]: Pt, s = 1) => ({ "--x": x, "--y": y, "--s": s }) as CSSProperties;

export default function ScrollStory() {
  const wrap = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const sticky = el.firstElementChild as HTMLElement;
      const range = r.height - sticky.offsetHeight;
      const p = range > 0 ? Math.min(1, Math.max(0, -r.top / range)) : 0;
      el.style.setProperty("--p", p.toFixed(4));
      setStep(Math.min(CHAPTERS.length - 1, Math.floor(p * CHAPTERS.length * 0.999)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = useCallback((n: number) => {
    const el = wrap.current;
    if (!el) return;
    const sticky = el.firstElementChild as HTMLElement;
    const range = el.offsetHeight - sticky.offsetHeight;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((n + 0.5) / CHAPTERS.length) * range, behavior: "smooth" });
  }, []);

  const blob = BLOB[step];

  return (
    <div ref={wrap} data-scrolly className="relative h-[320svh]" style={{ "--p": 0 } as CSSProperties}>
      <div className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col justify-center gap-6 py-6 lg:grid lg:grid-cols-12 lg:items-center lg:gap-8">
        {/* Chapters: full list on desktop, the active one on mobile */}
        <div className="order-2 lg:order-1 lg:col-span-5">
          <ol className="hidden lg:block">
            {CHAPTERS.map((c, n) => (
              <li key={c.title}>
                <button
                  type="button"
                  onClick={() => goTo(n)}
                  aria-current={n === step ? "step" : undefined}
                  className="group grid w-full grid-cols-[2rem_1fr] items-baseline gap-x-3 border-t border-line py-5 text-left"
                >
                  <span className={`font-mono text-xs transition-colors duration-500 ${n === step ? "text-ink" : "text-muted"}`}>
                    {String(n + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span
                      className={`block text-2xl font-semibold tracking-[-0.03em] transition-colors duration-500 ${
                        n === step ? "text-ink" : "text-line-strong group-hover:text-muted"
                      }`}
                    >
                      {c.title}
                    </span>
                    <span
                      className={`grid transition-[grid-template-rows,opacity] ease-out ${
                        n === step ? "grid-rows-[1fr] opacity-100 duration-500" : "grid-rows-[0fr] opacity-0 duration-300"
                      }`}
                    >
                      <span className="overflow-hidden">
                        <span className="block pt-2 text-[15px] leading-relaxed text-muted">{c.body}</span>
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="lg:hidden">
            <div className="flex gap-1.5" aria-hidden="true">
              {CHAPTERS.map((c, n) => (
                <span key={c.title} className="h-0.5 flex-1 overflow-hidden bg-line">
                  <span
                    className={`block h-full origin-left bg-ink transition-transform duration-500 ${n <= step ? "scale-x-100" : "scale-x-0"}`}
                  />
                </span>
              ))}
            </div>
            <div className="mt-5 grid">
              {CHAPTERS.map((c, n) => (
                <div
                  key={c.title}
                  aria-hidden={n !== step}
                  className={`col-start-1 row-start-1 transition-[opacity,transform] ease-out ${
                    n === step ? "opacity-100 delay-200 duration-500" : "pointer-events-none translate-y-2 opacity-0 duration-150"
                  }`}
                >
                  <p className="font-mono text-xs text-muted">{String(n + 1).padStart(2, "0")}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-[-0.03em]">{c.title}</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stage */}
        <div className="order-1 lg:order-2 lg:col-span-7">
          <div
            className="stage relative mx-auto aspect-square w-full max-w-[min(100%,calc(100svh-17rem))] lg:max-w-[min(100%,calc(100svh-9rem))]"
            role="img"
            aria-label={`${CHAPTERS[step].title}: ${CHAPTERS[step].body}`}
          >
            <div aria-hidden="true" className="absolute inset-0">
              <span className="orbit absolute left-1/2 top-1/2 size-[64%] rounded-full border border-dashed border-line-strong" />

              <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible" fill="none">
                {NODES.map((node) =>
                  Object.entries(node.at).map(([s, p]) => (
                    <line
                      key={`${node.icon}-${s}`}
                      x1={BLOB[+s][0]}
                      y1={BLOB[+s][1]}
                      x2={p![0]}
                      y2={p![1]}
                      className={`beam ${node.flow === "in" ? "beam-in" : ""} ${+s === step ? "on" : ""}`}
                    />
                  )),
                )}
                <line x1="50" y1="24" x2="50" y2="44" className={`beam ${step === 3 ? "on" : ""}`} />
              </svg>

              <div className="blob-wrap" style={pos(blob, BLOB_SCALE[step])}>
                <div className="blob" />
                <Mark className="relative size-[11cqw] text-ink" accent="var(--color-paper)" />
              </div>

              {NODES.map((node) => {
                const on = node.at[step] !== undefined;
                return (
                  <div key={node.icon} className={`node ${on ? "on" : ""}`} style={pos(nearest(node.at, step), on ? 1 : 0.6)}>
                    <span className="relative grid size-[clamp(2.5rem,12cqw,3.75rem)] place-items-center rounded-xl border border-line bg-card text-ink shadow-[0_1px_0_rgb(255_255_255)_inset,0_6px_16px_-10px_rgb(18_18_17/0.35)]">
                      <BrandIcon name={node.icon} className="size-[45%]" />
                      {node.named && (
                        <span className="absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-paper bg-accent" />
                      )}
                    </span>
                    {node.label && (
                      <span className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 font-mono text-[11px] text-muted">
                        {node.label}
                      </span>
                    )}
                  </div>
                );
              })}

              <div className={`chip ${step === 0 ? "on" : ""}`} style={pos([50, 86])}>
                <span className="text-muted">ask</span> &quot;best auth sdk for next.js?&quot;
              </div>
              <div className={`chip ${step === 1 ? "on" : ""}`} style={pos([50, 86])}>
                quickstart.ts <span className="size-1.5 rounded-full bg-accent" /> tested
              </div>
              <div className={`chip chip-dashed ${step === 2 ? "on" : ""}`} style={pos([50, 13])}>
                <BrandIcon name="calendar" className="size-3.5" /> events
              </div>

              <div className={`report ${step === 3 ? "on" : ""}`}>
                <div className="flex items-center justify-between border-b border-line pb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                  <span>Monthly report</span>
                  <span className="rounded border border-line px-1.5 py-px normal-case tracking-normal">example</span>
                </div>
                <ul className="mt-3 space-y-3">
                  {REPORT.map((r, n) => (
                    <li key={r.name} className="grid grid-cols-[1.25rem_4.5rem_1fr] items-center gap-2.5 text-sm">
                      <BrandIcon name={r.icon} className="size-4" />
                      <span>{r.name}</span>
                      <span className="h-1.5 overflow-hidden rounded-full bg-line">
                        <span
                          className="bar block h-full rounded-full bg-ink"
                          style={{ "--w": `${r.w}%`, "--d": `${n * 120 + 250}ms` } as CSSProperties}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
