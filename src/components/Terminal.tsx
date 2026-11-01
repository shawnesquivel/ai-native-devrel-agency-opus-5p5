"use client";

import { useEffect, useRef, useState } from "react";

const QUERY = `"best auth sdk for next.js?"`;

const ROWS = [
  { model: "chatgpt", names: ["competitor-a", "competitor-b"] },
  { model: "claude", names: ["competitor-a", "you"] },
  { model: "gemini", names: ["competitor-b"] },
];

const SUMMARY = [
  { k: "named", v: "1 of 3" },
  { k: "cited", v: "competitor docs" },
  { k: "next", v: "tested next.js example in your docs" },
];

const TOTAL_STEPS = ROWS.length + SUMMARY.length;

export default function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState(QUERY.length);
  const [shown, setShown] = useState(TOTAL_STEPS);
  const [done, setDone] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setTyped(0);
    setShown(0);
    setDone(false);

    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        let t = 250;
        for (let c = 1; c <= QUERY.length; c++) {
          t += 26 + (c % 5 === 0 ? 30 : 0);
          timers.push(window.setTimeout(() => setTyped(c), t));
        }
        t += 380;
        for (let r = 1; r <= TOTAL_STEPS; r++) {
          t += r === ROWS.length + 1 ? 520 : 300;
          timers.push(window.setTimeout(() => setShown(r), t));
        }
        timers.push(window.setTimeout(() => setDone(true), t + 200));
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const row = (n: number) =>
    `transition-[opacity,transform] duration-500 ease-out ${shown > n ? "opacity-100" : "translate-y-1 opacity-0"}`;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Example audit: one buyer question asked to ChatGPT, Claude and Gemini. You are named by one of three; the next step is a tested example in your docs."
      className="overflow-hidden rounded-xl border border-ink bg-ink font-mono text-[12.5px] leading-[1.7] text-[#d9d7cf] shadow-[0_1px_0_rgb(255_255_255/0.06)_inset,0_24px_48px_-24px_rgb(18_18_17/0.45)] sm:text-[13px]"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-[11px] uppercase tracking-[0.14em] text-[#a3a198]">
        <span>visibility audit</span>
        <span className="rounded border border-white/15 px-1.5 py-px normal-case tracking-normal">example</span>
      </div>
      <div className="p-4 sm:p-5" aria-hidden="true">
        <p className="break-words">
          <span className="text-[#a3a198]">$ </span>
          <span className="text-white">ask </span>
          <span className="text-white">{QUERY.slice(0, typed)}</span>
          {!done && typed < QUERY.length && <span className="caret ml-px" />}
        </p>

        <div className="mt-4 space-y-1">
          {ROWS.map((r, n) => (
            <div key={r.model} className={`grid grid-cols-[4.75rem_1fr] gap-x-3 ${row(n)}`}>
              <span className="text-[#a3a198]">{r.model}</span>
              <span>
                {r.names.map((name, k) => (
                  <span key={name}>
                    {k > 0 && <span className="text-[#a3a198]">, </span>}
                    <span className={name === "you" ? "text-accent" : "text-white"}>{name}</span>
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-1 border-t border-dashed border-white/15 pt-4">
          {SUMMARY.map((s, n) => (
            <div key={s.k} className={`grid grid-cols-[4.75rem_1fr] gap-x-3 ${row(ROWS.length + n)}`}>
              <span className="text-[#a3a198]">{s.k}</span>
              <span className={s.k === "next" ? "text-accent" : "text-white"}>{s.v}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 h-[1.7em]">
          <span className="text-[#a3a198]">$ </span>
          {done && <span className="caret" />}
        </p>
      </div>
    </div>
  );
}
