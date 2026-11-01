"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BrandIcon, { ICON_LABELS, type IconName } from "./BrandIcon";

const CHAPTERS: { title: string; body: string; icons: IconName[] }[] = [
  {
    title: "Audit",
    body: "We ask the assistants your buyers ask. You get your score.",
    icons: ["chatgpt", "claude", "gemini", "grokbot", "hermes", "reddit"],
  },
  {
    title: "Ship",
    body: "Everything that gets you recommended, shipped every week.",
    icons: ["markdown", "aeo", "youtube", "tutorial", "github", "mcp", "x", "calendar"],
  },
  { title: "Measure", body: "A monthly report: what moved and what ships next.", icons: ["chart"] },
  { title: "Repeat", body: "Back to the audit, every week. Every month you show up in more answers.", icons: [] },
];

/* Illustrative score per point in time, one per step. Not client data. */
const TIMELINE = [
  { label: "Week 1", score: 34 },
  { label: "Week 2", score: 41 },
  { label: "Month 1", score: 58 },
  { label: "Month 3", score: 79 },
];
const NAMED_AT = 50;

export default function ScrollStory() {
  const wrap = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

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
      setStep(Math.min(CHAPTERS.length - 1, Math.floor(p * CHAPTERS.length * 0.999)));
      setProgress(p);
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

  const score = TIMELINE[step].score;
  const named = score >= NAMED_AT;
  /* Line fill runs marker-to-marker: 0 at the first marker, 1 at the last. */
  const fill = Math.min(1, Math.max(0, progress * CHAPTERS.length - 0.5) / (CHAPTERS.length - 1));

  return (
    <div ref={wrap} data-scrolly={CHAPTERS.length} className="relative h-[300svh]">
      <div className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col justify-center gap-8 py-6 lg:grid lg:grid-cols-12 lg:items-center lg:gap-12">
        {/* Stepper */}
        <ol className="relative order-2 lg:order-1 lg:col-span-6">
          {CHAPTERS.map((c, n) => {
            const state = n < step ? "done" : n === step ? "now" : "next";
            const segment = Math.min(1, Math.max(0, fill * (CHAPTERS.length - 1) - n));
            return (
              <li key={c.title} className="relative">
                {n < CHAPTERS.length - 1 && (
                  <span aria-hidden="true" className="step-line">
                    <span style={{ transform: `scaleY(${segment})` }} />
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => goTo(n)}
                  aria-current={state === "now" ? "step" : undefined}
                  className="group grid w-full grid-cols-[1.75rem_1fr] items-start gap-x-4 py-2.5 text-left lg:py-3.5"
                >
                  <span className={`step-marker ${state}`}>{state === "done" ? <Check /> : n + 1}</span>
                  <span className="min-w-0">
                    <span
                      className={`block text-xl font-semibold leading-7 tracking-[-0.03em] transition-colors duration-500 lg:text-2xl lg:leading-7 ${
                        state === "next" ? "text-line-strong group-hover:text-muted" : "text-ink"
                      }`}
                    >
                      {c.title}
                    </span>
                    <span
                      className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                        state === "now" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <span className="overflow-hidden">
                        <span className="block pt-1.5 text-[15px] leading-relaxed text-muted">{c.body}</span>
                        {c.icons.length > 0 && <IconRow icons={c.icons} />}
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Score */}
        <div className="order-1 lg:order-2 lg:col-span-6" role="img" aria-label={`Example visibility score: ${score} at ${TIMELINE[step].label}.`}>
          <div aria-hidden="true">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Example score</p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <span key={score} className="score-num text-[5.5rem] font-semibold leading-[0.85] tracking-[-0.06em] tabular-nums lg:text-[9rem]">
                {score}
              </span>
              <span
                className={`mb-2 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors duration-500 ${
                  named ? "border-ink bg-accent text-ink" : "border-dashed border-line-strong text-muted"
                }`}
              >
                <span className={`size-1.5 rounded-full border ${named ? "border-ink bg-ink" : "border-muted"}`} />
                {named ? "named in answers" : "not named"}
              </span>
            </div>

            <ol className="mt-6 grid grid-cols-4 border-t border-line lg:mt-8">
              {TIMELINE.map((t, n) => (
                <li key={t.label} className="relative pt-3">
                  <span
                    className={`absolute -top-px left-0 h-px w-full origin-left bg-ink transition-transform duration-500 ${
                      n <= step ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                  <span className={`block font-mono text-[11px] transition-colors duration-500 ${n <= step ? "text-ink" : "text-muted"}`}>
                    {t.label}
                  </span>
                  <span
                    className={`mt-1 block text-lg font-semibold tabular-nums tracking-[-0.02em] transition-colors duration-500 ${
                      n <= step ? "text-ink" : "text-line-strong"
                    }`}
                  >
                    {t.score}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="size-3" aria-hidden="true" fill="none">
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconRow({ icons }: { icons: IconName[] }) {
  return (
    <span className="mt-3 flex flex-wrap gap-1.5">
      {icons.map((icon) => (
        <span key={icon} title={ICON_LABELS[icon]} className="grid size-8 place-items-center rounded-lg border border-line bg-card text-ink">
          <BrandIcon name={icon} className="size-4" />
          <span className="sr-only">{ICON_LABELS[icon]}</span>
        </span>
      ))}
    </span>
  );
}
