"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import BrandIcon, { ICON_LABELS, type IconName } from "./BrandIcon";
import { Mark } from "./Brand";

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
  { title: "Repeat", body: "The engine runs again. Every month you show up in more answers.", icons: [] },
];

/* Illustrative score curve, not client data: [scroll progress, score]. */
const CURVE: [number, number][] = [
  [0, 34],
  [0.25, 34],
  [0.5, 51],
  [0.75, 68],
  [0.95, 86],
  [1, 86],
];
const NAMED_AT = 50;

/* Sparkline points: week 1, month 1, month 3, month 6. x and y are stage percentages. */
const SPARK = [
  { label: "Wk 1", score: 34, x: 31 },
  { label: "Mo 1", score: 51, x: 44 },
  { label: "Mo 3", score: 68, x: 57 },
  { label: "Mo 6", score: 86, x: 70 },
];
const sparkY = (score: number) => 75 - ((score - 30) / 60) * 11;
const SPARK_PATH = SPARK.map((pt, n) => `${n ? "L" : "M"}${pt.x} ${sparkY(pt.score).toFixed(2)}`).join(" ");

const STATIONS: [number, number][] = [
  [50, 12],
  [88, 50],
  [50, 88],
  [12, 50],
];

const lerpCurve = (p: number) => {
  for (let k = 1; k < CURVE.length; k++) {
    const [p1, s1] = CURVE[k];
    const [p0, s0] = CURVE[k - 1];
    if (p <= p1) return s0 + ((p - p0) / (p1 - p0 || 1)) * (s1 - s0);
  }
  return CURVE[CURVE.length - 1][1];
};

export default function ScrollStory() {
  const wrap = useRef<HTMLDivElement>(null);
  const scoreEl = useRef<HTMLSpanElement>(null);
  const [step, setStep] = useState(0);
  const [named, setNamed] = useState(false);
  const [scored, setScored] = useState(false);
  const [dots, setDots] = useState(0);

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
      const score = Math.round(lerpCurve(p));
      el.style.setProperty("--p", p.toFixed(4));
      el.style.setProperty("--arc", Math.min(1, p / 0.92).toFixed(4));
      el.style.setProperty("--spark", Math.min(1, Math.max(0, (p - 0.25) / 0.7)).toFixed(4));
      el.style.setProperty("--score", (score / 100).toFixed(3));
      if (scoreEl.current) scoreEl.current.textContent = String(score);
      setStep(Math.min(CHAPTERS.length - 1, Math.floor(p * CHAPTERS.length * 0.999)));
      setNamed(score >= NAMED_AT);
      setScored(p > 0.1);
      const spark = Math.min(1, Math.max(0, (p - 0.25) / 0.7));
      setDots(p > 0.1 ? Math.floor(spark * (SPARK.length - 1) + 0.02) + 1 : 0);
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
    window.scrollTo({ top: top + ((n + 0.6) / CHAPTERS.length) * range, behavior: "smooth" });
  }, []);

  const looping = step === CHAPTERS.length - 1;

  return (
    <div
      ref={wrap}
      data-scrolly={CHAPTERS.length}
      className="engine relative h-[340svh]"
      style={{ "--p": 0, "--arc": 0, "--spark": 0, "--score": 0.34 } as CSSProperties}
    >
      <div className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col justify-center gap-6 py-6 lg:grid lg:grid-cols-12 lg:items-center lg:gap-8">
        {/* Chapters: each finished step stays checked, so the steps stack up */}
        <div className="order-2 lg:order-1 lg:col-span-5">
          <ol className="hidden lg:block">
            {CHAPTERS.map((c, n) => {
              const state = n < step ? "done" : n === step ? "now" : "next";
              return (
                <li key={c.title}>
                  <button
                    type="button"
                    onClick={() => goTo(n)}
                    aria-current={state === "now" ? "step" : undefined}
                    className="group grid w-full grid-cols-[2rem_1fr] items-start gap-x-3 border-t border-line py-4 text-left"
                  >
                    <span
                      className={`mt-0.5 grid size-6 place-items-center rounded-full border font-mono text-[11px] transition-colors duration-500 ${
                        state === "done"
                          ? "border-ink bg-ink text-paper"
                          : state === "now"
                            ? "border-ink bg-accent text-ink"
                            : "border-line-strong text-muted"
                      }`}
                    >
                      {state === "done" ? <Check /> : n + 1}
                    </span>
                    <span>
                      <span
                        className={`block text-2xl font-semibold tracking-[-0.03em] transition-colors duration-500 ${
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
                          <span className="block pt-2 text-[15px] leading-relaxed text-muted">{c.body}</span>
                          {c.icons.length > 0 && <IconRow icons={c.icons} />}
                        </span>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="lg:hidden">
            <div className="flex gap-1.5" aria-hidden="true">
              {CHAPTERS.map((c, n) => (
                <span key={c.title} className="h-0.5 flex-1 overflow-hidden bg-line">
                  <span className={`block h-full origin-left bg-ink transition-transform duration-500 ${n <= step ? "scale-x-100" : "scale-x-0"}`} />
                </span>
              ))}
            </div>
            <div className="mt-4 grid">
              {CHAPTERS.map((c, n) => (
                <div
                  key={c.title}
                  aria-hidden={n !== step}
                  className={`col-start-1 row-start-1 transition-[opacity,transform] duration-500 ease-out ${
                    n === step ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
                  }`}
                >
                  <p className="font-mono text-xs text-muted">{String(n + 1).padStart(2, "0")}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-[-0.03em]">{c.title}</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{c.body}</p>
                  {c.icons.length > 0 && <IconRow icons={c.icons} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The engine */}
        <div className="order-1 lg:order-2 lg:col-span-7">
          <div
            className="stage relative mx-auto aspect-square w-full max-w-[min(100%,calc(100svh-19rem))] lg:max-w-[min(100%,calc(100svh-9rem))]"
            role="img"
            aria-label={`${CHAPTERS[step].title}. ${CHAPTERS[step].body} Example visibility score shown, rising over six months.`}
          >
            <div aria-hidden="true" className="absolute inset-0">
              <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible" fill="none">
                <circle cx="50" cy="50" r="38" className="ring-track" />
                <circle cx="50" cy="50" r="38" pathLength={1} className="ring-arc" />
                <g className={`ring-comet ${looping ? "on" : ""}`}>
                  <circle cx="50" cy="12" r="1.3" className="fill-accent" />
                </g>

                <path d={SPARK_PATH} pathLength={1} className="spark" />
                {SPARK.map((pt, n) => (
                  <circle
                    key={pt.label}
                    cx={pt.x}
                    cy={sparkY(pt.score)}
                    r="1.1"
                    className={`spark-dot ${n < dots ? "on" : ""}`}
                  />
                ))}
              </svg>

              {STATIONS.map(([x, y], n) => {
                const state = n < step || (looping && n === 0) ? "done" : n === step ? "now" : "next";
                return (
                  <span key={n} className={`station ${state}`} style={{ "--x": x, "--y": y } as CSSProperties}>
                    {state === "done" ? <Check /> : n + 1}
                  </span>
                );
              })}

              <div className="blob-wrap" style={{ "--x": 50, "--y": 37 } as CSSProperties}>
                <svg viewBox="0 0 100 100" className="gauge absolute -inset-[16%]" fill="none">
                  <circle cx="50" cy="50" r="46" className="gauge-track" />
                  <circle cx="50" cy="50" r="46" pathLength={1} className="gauge-arc" />
                </svg>
                <div className="blob" />
                <Mark className={`relative size-[8cqw] text-ink transition-opacity duration-500 ${scored ? "opacity-0" : ""}`} accent="var(--color-paper)" />
                <span
                  className={`absolute inset-0 grid place-items-center content-center text-ink transition-opacity duration-500 ${scored ? "opacity-100" : "opacity-0"}`}
                >
                  <span ref={scoreEl} className="text-[9cqw] font-semibold leading-none tracking-[-0.04em] tabular-nums">
                    34
                  </span>
                  <span className="mt-1 whitespace-nowrap font-mono text-[max(9px,2.1cqw)] uppercase tracking-[0.06em]">Example score</span>
                </span>
              </div>

              <span
                className={`named-chip ${scored ? "on" : ""} ${named ? "is-named" : ""}`}
                style={{ "--x": 50, "--y": 59 } as CSSProperties}
              >
                <span className="named-dot" />
                {named ? "named in answers" : "not named"}
              </span>

              {SPARK.map((pt, n) => (
                <span key={pt.label} className={`spark-label ${n < dots ? "on" : ""}`} style={{ "--x": pt.x, "--y": 79 } as CSSProperties}>
                  {pt.label}
                </span>
              ))}
            </div>
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
