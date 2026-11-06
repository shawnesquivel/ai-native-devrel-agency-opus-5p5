"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { STEPS } from "@/lib/site";
import BrandIcon, { ICON_LABELS, type IconName } from "./BrandIcon";

const ICONS: IconName[][] = [
  ["chatgpt", "claude", "gemini", "grokbot", "hermes", "reddit"],
  ["aeo", "reddit", "x", "youtube"],
  ["markdown", "aeo", "youtube", "tutorial", "github", "mcp", "x", "calendar"],
  [],
];

const CHAPTERS = STEPS.map((s, n) => ({ ...s, icons: ICONS[n] }));

/* Sample curve, not client data: [week, score]. Caps at 96. */
const CURVE: [number, number][] = [
  [1, 34],
  [2, 38],
  [4, 51],
  [8, 64],
  [13, 76],
  [20, 88],
  [26, 96],
];
const NAMED_AT = 50;
const LAST_WEEK = 26;

/* Scroll progress -> weeks of real line. Audit and Strategize hold at week 1 (34); Ship climbs; Compound runs to 96. */
const STOPS: [number, number][] = [
  [0, 1],
  [0.5, 1],
  [0.75, 4],
  [1, LAST_WEEK],
];
/* Strategize draws a dashed 4-week plan ahead of the real line. */
const PLAN_WEEKS = 4;
/* Compound re-plans every 4 weeks. */
const REPLANS = [5, 9, 13, 17, 21, 25];

const lerp = (pts: [number, number][], x: number) => {
  for (let k = 1; k < pts.length; k++) {
    const [x0, y0] = pts[k - 1];
    const [x1, y1] = pts[k];
    if (x <= x1) return y0 + ((x - x0) / (x1 - x0 || 1)) * (y1 - y0);
  }
  return pts[pts.length - 1][1];
};

/* Plot area inside a 400x220 viewBox. */
const PX = { l: 34, r: 384, t: 14, b: 186 };
/* Square-root time axis: early weeks get room, so Week 1 and Month 1 don't collide. */
const gx = (week: number) => PX.l + Math.sqrt((week - 1) / (LAST_WEEK - 1)) * (PX.r - PX.l);
const gy = (score: number) => PX.b - (score / 100) * (PX.b - PX.t);
const X_TICKS = [
  { week: 1, label: "Week 1" },
  { week: 4, label: "Month 1" },
  { week: 13, label: "Month 3" },
  { week: 26, label: "Month 6" },
];

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

  const week = lerp(STOPS, progress);
  const score = Math.round(lerp(CURVE, week));
  const named = score >= NAMED_AT;
  const shown = CURVE.filter(([w]) => w < week);
  const line = [...shown, [week, lerp(CURVE, week)] as [number, number]];
  const toPath = (pts: [number, number][]) => pts.map(([w, v], n) => `${n ? "L" : "M"}${gx(w).toFixed(1)} ${gy(v).toFixed(1)}`).join(" ");
  const d = toPath(line);
  const plan = Math.min(1, Math.max(0, (progress - 0.27) / 0.18));
  const planWeek = 1 + plan * (PLAN_WEEKS - 1);
  const planPts: [number, number][] = [...CURVE.filter(([w]) => w < planWeek), [planWeek, lerp(CURVE, planWeek)]];
  const planEnd = { x: (gx(planWeek) / 400) * 100, y: (gy(lerp(CURVE, planWeek)) / 220) * 100 };
  const tip = { x: (gx(week) / 400) * 100, y: (gy(lerp(CURVE, week)) / 220) * 100 };
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

        {/* AI visibility score */}
        <div className="order-1 lg:order-2 lg:col-span-6" role="img" aria-label={`Example AI visibility score: ${score} out of 100, rising over time.`}>
          <div aria-hidden="true">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[15px] font-semibold tracking-[-0.01em]">AI visibility score</p>
                <p className="mt-1 max-w-[36ch] text-pretty text-[13px] leading-snug text-muted">
                  How often AI assistants name you when buyers ask about your category.
                </p>
              </div>
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors duration-500 ${
                  named ? "border-ink bg-accent text-ink" : "border-dashed border-line-strong text-muted"
                }`}
              >
                <span className={`size-1.5 rounded-full border ${named ? "border-ink bg-ink" : "border-muted"}`} />
                {named ? "named" : "not named"}
              </span>
            </div>

            <div className="relative mt-5 aspect-[400/220] w-full">
              <svg viewBox="0 0 400 220" className="absolute inset-0 size-full overflow-visible" fill="none">
                <line x1={PX.l} y1={PX.b} x2={PX.r} y2={PX.b} className="stroke-line-strong" vectorEffect="non-scaling-stroke" />
                <line x1={PX.l} y1={PX.t} x2={PX.l} y2={PX.b} className="stroke-line-strong" vectorEffect="non-scaling-stroke" />
                <line
                  x1={PX.l}
                  y1={gy(NAMED_AT)}
                  x2={PX.r}
                  y2={gy(NAMED_AT)}
                  className="stroke-line-strong"
                  strokeDasharray="3 4"
                  vectorEffect="non-scaling-stroke"
                />
                {plan > 0 && (
                  <path
                    d={toPath(planPts)}
                    className="stroke-muted"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
                <path d={d} className="stroke-ink" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              </svg>

              {[0, 50, 100].map((v) => (
                <span key={v} className="graph-label right-[calc(100%-7.5%)] -translate-y-1/2 text-right" style={{ top: `${(gy(v) / 220) * 100}%` }}>
                  {v}
                </span>
              ))}
              <span className="graph-label right-0 -translate-y-full pb-1" style={{ top: `${(gy(NAMED_AT) / 220) * 100}%` }}>
                named
              </span>
              {X_TICKS.map((t) => (
                <span
                  key={t.label}
                  className={`graph-label top-[calc(186/220*100%)] pt-2 ${t.week === 1 ? "" : t.week === LAST_WEEK ? "-translate-x-full" : "-translate-x-1/2"}`}
                  style={{ left: `${(gx(t.week) / 400) * 100}%` }}
                >
                  {t.label}
                </span>
              ))}

              <span
                className={`graph-label -translate-y-full pb-1.5 transition-opacity duration-300 ${plan > 0.6 && week < 1.05 ? "opacity-100" : "opacity-0"}`}
                style={{ left: `${planEnd.x}%`, top: `${planEnd.y}%` }}
              >
                plan
              </span>

              {REPLANS.map((w, n) => (
                <span
                  key={w}
                  className={`replan ${week >= w ? "on" : ""}`}
                  style={{ left: `${(gx(w) / 400) * 100}%`, top: `${(PX.b / 220) * 100}%` }}
                  title="Re-plan"
                >
                  <Loop />
                  {n === 0 && <span className="graph-label bottom-full left-1/2 -translate-x-1/2 pb-1">re-plan</span>}
                </span>
              ))}

              <span className="graph-tip" style={{ left: `${tip.x}%`, top: `${tip.y}%` }}>
                <span className="graph-dot" />
                <span className={`graph-value ${tip.x > 78 ? "right-3" : "left-3"}`}>{score}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Loop() {
  return (
    <svg viewBox="0 0 16 16" className="size-full" fill="none" aria-hidden="true">
      <path d="M12.5 8a4.5 4.5 0 1 1-1.3-3.2M12.5 3v2.5H10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
