"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEMO, type DemoPick, type DemoSource } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import BrandIcon from "./BrandIcon";

type Phase = "before" | "after";

/* Stage: 0 empty, 1 searching, 2-4 sources arrive, 5 answer, 6 done (marker, citation, winner). */
const DONE = 6;

/** Placeholder mark for the client's product: a dashed square, so it never reads as a real brand. */
function YourMark({ className = "size-4" }: { className?: string }) {
  return <span aria-hidden="true" className={`inline-block rounded-[4px] border-[1.5px] border-dashed border-ink ${className}`} />;
}

function Favicon({ icon }: { icon?: DemoSource["icon"] }) {
  return (
    <span className="grid size-6 shrink-0 place-items-center rounded-md border border-line bg-card text-ink">
      {icon ? <BrandIcon name={icon} className="size-3.5" /> : <YourMark className="size-3" />}
    </span>
  );
}

function Pick({ pick, rank, win, show }: { pick: DemoPick; rank: number; win: boolean; show: boolean }) {
  return (
    <li
      className={`flex items-center gap-2.5 rounded-lg border px-2.5 py-1.5 text-[13.5px] transition-[opacity,transform,box-shadow,border-color] duration-500 ease-out ${
        show ? "opacity-100" : "translate-y-1 opacity-0"
      } ${win ? "demo-win border-ink bg-card" : "border-line bg-paper text-ink-2"}`}
    >
      <span className="w-3 font-mono text-[11px] text-muted">{rank}</span>
      <span className="grid size-6 shrink-0 place-items-center rounded-md border border-line bg-card text-ink">
        {pick.icon ? <BrandIcon name={pick.icon} className="size-3.5" /> : <YourMark className="size-3" />}
      </span>
      <span className={`mr-auto sm:mr-0 ${win ? "font-semibold text-ink" : ""}`}>{pick.name}</span>
      <span className="ml-auto hidden truncate text-[12px] text-muted sm:block">{pick.note}</span>
      {win && <span className="demo-badge shrink-0 rounded-full bg-accent px-1.5 py-0.5 font-mono text-[10px] font-semibold text-ink">#1</span>}
    </li>
  );
}

export default function ChatDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const playRef = useRef<(p: Phase) => void>(() => {});
  const manual = useRef(false);
  const [phase, setPhase] = useState<Phase>("after");
  const [typed, setTyped] = useState(DEMO.question.length);
  const [stage, setStage] = useState(DONE);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

  const play = useCallback((p: Phase) => {
    clear();
    setStage(0);
    let t = 350;
    at(t, () => {
      setPhase(p);
      setTyped(0);
    });
    for (let c = 1; c <= DEMO.question.length; c++) {
      t += 22 + (c % 8 === 0 ? 40 : 0);
      at(t, () => setTyped(c));
    }
    t += 300;
    at(t, () => setStage(1));
    for (const s of [2, 3, 4]) {
      t += s === 2 ? 600 : 380;
      at(t, () => setStage(s));
    }
    t += 900;
    at(t, () => setStage(5));
    t += 800;
    at(t, () => setStage(DONE));
    t += p === "before" ? 3400 : 4800;
    at(t, () => playRef.current(p === "before" ? "after" : "before"));
  }, []);

  useEffect(() => {
    playRef.current = play;
    const el = ref.current;
    el?.removeAttribute("data-init");
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !manual.current) play("before");
      else clear();
    });
    io.observe(el);
    return () => {
      io.disconnect();
      clear();
    };
  }, [play]);

  const show = (p: Phase) => {
    manual.current = true;
    playRef.current = () => {};
    clear();
    setPhase(p);
    setTyped(DEMO.question.length);
    setStage(DONE);
    trackEvent("demo_toggle", { phase: p });
  };

  const typing = typed < DEMO.question.length;
  const searching = stage >= 1 && stage < 5;
  const answered = stage >= 5;
  const vis = (on: boolean) => `transition-[opacity,transform] duration-500 ease-out ${on ? "opacity-100" : "pointer-events-none translate-y-1 opacity-0"}`;

  return (
    <div
      ref={ref}
      data-init=""
      className="demo overflow-hidden rounded-xl border border-line-strong bg-card shadow-[0_1px_0_rgb(255_255_255)_inset,0_24px_48px_-28px_rgb(18_18_17/0.4)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-medium text-ink">
          <BrandIcon name="chatgpt" className="size-4" />
          ChatGPT
        </span>
        <div role="group" aria-label="Show answer" className="flex rounded-full border border-line bg-paper p-0.5 font-mono text-[11px]">
          {(["before", "after"] as Phase[]).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={phase === p}
              onClick={() => show(p)}
              className={`rounded-full px-2.5 py-1 transition-colors duration-300 ${
                phase === p ? (p === "after" ? "bg-accent text-ink" : "bg-ink text-paper") : "text-muted hover:text-ink"
              }`}
            >
              {p === "before" ? "Before" : "After we ship"}
            </button>
          ))}
        </div>
      </div>

      <div className="demo-body flex flex-col gap-3.5 p-4 sm:p-5">
        {/* The full question sits invisibly underneath so the bubble keeps its final size while typing. */}
        <p className="relative ml-auto max-w-[88%] rounded-xl rounded-br-sm bg-ink px-3 py-2 text-[14px] leading-snug text-paper">
          <span className="invisible" aria-hidden="true">
            {DEMO.question}
          </span>
          <span className="absolute inset-x-3 top-2">
            {DEMO.question.slice(0, typed)}
            {typing && <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-paper" />}
          </span>
        </p>

        <div className="grid grid-cols-[minmax(0,1fr)]">
        {(["before", "after"] as Phase[]).map((p) => {
          const data = DEMO[p];
          const on = phase === p;
          return (
            <div key={p} aria-hidden={!on} className={`col-start-1 row-start-1 ${on ? "" : "invisible"}`}>
              {/* Status line */}
              <div className="grid grid-cols-[minmax(0,1fr)] font-mono text-[11.5px] text-muted">
                <p className={`col-start-1 row-start-1 flex items-center gap-1.5 ${vis(searching)}`}>
                  <span className="flex gap-0.5" aria-hidden="true">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="demo-dot size-1 rounded-full bg-muted" style={{ animationDelay: `${d * 150}ms` }} />
                    ))}
                  </span>
                  Searching the web…
                </p>
                <p className={`col-start-1 row-start-1 flex items-center gap-1.5 ${vis(answered)}`}>
                  <span className="flex -space-x-1">
                    {data.sources.map((s) => (
                      <span key={s.domain} className="grid size-4 place-items-center rounded-full border border-line bg-card text-ink">
                        {s.icon ? <BrandIcon name={s.icon} className="size-2.5" /> : <YourMark className="size-2" />}
                      </span>
                    ))}
                  </span>
                  Searched {data.sources.length} sources
                </p>
              </div>

              {/* Sources, then the answer, in one cell so the height never changes */}
              <div className="mt-3 grid grid-cols-[minmax(0,1fr)]">
                <ul className={`col-start-1 row-start-1 space-y-2 ${vis(searching)}`}>
                  {data.sources.map((s, n) => (
                    <li key={s.domain} className={`flex items-center gap-2.5 rounded-lg border border-line bg-paper px-2.5 py-2 ${vis(stage >= 2 + n && !answered)}`}>
                      <Favicon icon={s.icon} />
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-medium text-ink">{s.title}</span>
                        <span className="block truncate font-mono text-[11px] text-muted">{s.domain}</span>
                      </span>
                    </li>
                  ))}
                </ul>

                <div className={`col-start-1 row-start-1 ${vis(answered)}`}>
                  <p className="text-[14px] leading-relaxed text-ink-2">
                    {data.answer.map((part, n) =>
                      "strong" in part && part.strong ? (
                        <strong key={n} className="font-semibold text-ink">
                          {part.text}
                        </strong>
                      ) : (
                        <span key={n}>{part.text}</span>
                      ),
                    )}
                  </p>
                  {"cite" in data && (
                    <p className={`mt-2 inline-flex items-center gap-1.5 rounded border border-line bg-paper px-1.5 py-0.5 font-mono text-[11px] text-ink-2 ${vis(stage >= DONE)}`}>
                      <YourMark className="size-2.5" />
                      {data.cite}
                    </p>
                  )}
                  <ol className="mt-3 space-y-1.5">
                    {data.picks.map((pick, n) => (
                      <Pick key={pick.name} pick={pick} rank={n + 1} win={n === 0 && stage >= DONE} show={answered} />
                    ))}
                  </ol>
                  {p === "before" && (
                    <p
                      className={`mt-3 inline-flex items-center gap-2 rounded-full border border-dashed border-line-strong px-2.5 py-1 font-mono text-[11px] text-muted ${vis(stage >= DONE)}`}
                    >
                      <span className="size-1.5 rounded-full border border-muted" />
                      You: not mentioned
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
