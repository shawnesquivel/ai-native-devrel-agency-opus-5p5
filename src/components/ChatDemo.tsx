"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEMO } from "@/lib/site";
import { Mark } from "./Brand";

type Phase = "before" | "after";

/* Stage: 0 empty, 1 thinking, 2..4 answer rows, 5 marker/reason. */
const LAST = 5;

export default function ChatDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const [phase, setPhase] = useState<Phase>("after");
  const [typed, setTyped] = useState(DEMO.question.length);
  const [stage, setStage] = useState(LAST);
  const playRef = useRef<(p: Phase) => void>(() => {});
  const manual = useRef(false);

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
      t += 24 + (c % 7 === 0 ? 40 : 0);
      at(t, () => setTyped(c));
    }
    t += 300;
    at(t, () => setStage(1));
    t += 800;
    for (let s = 2; s <= LAST; s++) {
      at(t, () => setStage(s));
      t += s === LAST - 1 ? 450 : 260;
    }
    t += p === "before" ? 2600 : 4200;
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
    setStage(LAST);
  };

  const row = (s: number) =>
    `transition-[opacity,transform] duration-300 ease-out ${stage >= s ? "opacity-100" : "translate-y-1 opacity-0"}`;
  const answering = stage === 1;
  const typing = typed < DEMO.question.length;

  return (
    <div
      ref={ref}
      data-init=""
      className="demo overflow-hidden rounded-xl border border-line-strong bg-card shadow-[0_1px_0_rgb(255_255_255)_inset,0_24px_48px_-28px_rgb(18_18_17/0.4)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <span className="flex items-center gap-2 text-sm text-ink-2">
          <span className="size-2.5 rounded-full bg-ink" aria-hidden="true" />
          AI assistant
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

      <div className="demo-body flex flex-col gap-4 p-4 sm:p-5">
        {/* The full question sits invisibly underneath so the bubble keeps its final size while typing. */}
        <p className="relative ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-ink px-3 py-2 text-[14px] leading-snug text-paper">
          <span className="invisible" aria-hidden="true">
            {DEMO.question}
          </span>
          <span className="absolute inset-x-3 top-2">
            {DEMO.question.slice(0, typed)}
            {typing && <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-paper" />}
          </span>
        </p>

        <div className="flex items-start gap-2.5">
          <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line bg-paper text-ink" aria-hidden="true">
            <span className="size-2 rounded-full bg-ink" />
          </span>

          <div className="grid min-w-0 flex-1">
            <span
              aria-hidden="true"
              className={`col-start-1 row-start-1 flex h-7 items-center gap-1 transition-opacity duration-200 ${answering ? "opacity-100" : "opacity-0"}`}
            >
              {[0, 1, 2].map((d) => (
                <span key={d} className="demo-dot size-1.5 rounded-full bg-muted" style={{ animationDelay: `${d * 150}ms` }} />
              ))}
            </span>

            {/* Before */}
            <div aria-hidden={phase !== "before"} className={`col-start-1 row-start-1 ${phase === "before" ? "" : "invisible"}`}>
              <p className={`text-[14px] text-ink-2 ${row(2)}`}>Top picks:</p>
              <ol className="mt-2 space-y-1.5">
                {DEMO.before.map((name, n) => (
                  <li key={name} className={`flex items-center gap-2.5 rounded-lg border border-line bg-paper px-3 py-2 text-[14px] ${row(2 + n)}`}>
                    <span className="font-mono text-[11px] text-muted">{n + 1}</span>
                    {name}
                  </li>
                ))}
              </ol>
              <p
                className={`mt-3 inline-flex items-center gap-2 rounded-full border border-dashed border-line-strong px-2.5 py-1 font-mono text-[11px] text-muted ${row(LAST)}`}
              >
                <span className="size-1.5 rounded-full border border-muted" />
                You: not mentioned
              </p>
            </div>

            {/* After */}
            <div aria-hidden={phase !== "after"} className={`col-start-1 row-start-1 ${phase === "after" ? "" : "invisible"}`}>
              <p className={`text-[14px] text-ink-2 ${row(2)}`}>Top pick:</p>
              <div className={`mt-2 rounded-lg border border-ink bg-paper p-3 ${row(2)}`}>
                <p className="flex items-center gap-2.5 text-[14px] font-medium">
                  <span className="font-mono text-[11px] text-muted">1</span>
                  {DEMO.after.pick}
                  <span className="ml-auto rounded-full bg-accent px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink">named</span>
                </p>
                <div className={`mt-2 border-l-2 border-accent pl-2.5 ${row(LAST)}`}>
                  <p className="text-[13px] text-ink-2">{DEMO.after.reason}</p>
                  <p className="mt-1.5 flex flex-wrap gap-1.5">
                    {DEMO.after.cites.map((c) => (
                      <span key={c} className="inline-flex items-center gap-1 rounded border border-line bg-card px-1.5 py-0.5 font-mono text-[11px] text-ink-2">
                        <Mark className="size-2.5" />
                        {c}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
              <ol className="mt-1.5 space-y-1.5">
                {DEMO.after.rest.map((name, n) => (
                  <li key={name} className={`flex items-center gap-2.5 rounded-lg border border-line bg-paper px-3 py-2 text-[14px] text-ink-2 ${row(3 + n)}`}>
                    <span className="font-mono text-[11px] text-muted">{n + 2}</span>
                    {name}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
