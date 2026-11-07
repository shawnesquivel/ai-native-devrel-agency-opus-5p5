"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { StatHeading } from "../StatFlow";
import { FINAL, PromptBox, QUESTIONS, useReducedMotion } from "./chatgpt-shared";

const ROWS = 13;
const MID = (ROWS - 1) / 2;
const rows = Array.from({ length: ROWS }, (_, r) => {
  const shift = (r * 5) % QUESTIONS.length;
  const row = [...QUESTIONS.slice(shift), ...QUESTIONS.slice(0, shift)];
  return [...row, ...row];
});

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (v: number) => v * v * (3 - 2 * v);
const span = (p: number, a: number, b: number) => ease(clamp((p - a) / (b - a)));

/** Scroll-scrubbed: rows of prompts drift, collapse to the centre, and leave one prompt. */
export default function ChatGptWall() {
  const wrap = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const sticky = el.firstElementChild as HTMLElement;
      const range = r.height - sticky.offsetHeight;
      setP(range > 0 ? clamp(-(r.top - 64) / range) : 0);
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

  const collapse = span(p, 0.35, 0.7);
  const wallOpacity = 1 - span(p, 0.5, 0.72);
  const boxIn = span(p, 0.58, 0.78);
  const typed = Math.round(span(p, 0.74, 0.96) * FINAL.length);
  const move = reduced ? 0 : 1;

  return (
    <div ref={wrap} className="relative h-[280svh]">
      <div className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col justify-center py-4 md:py-6">
        <div className="flex h-full max-h-[44rem] flex-col overflow-hidden rounded-xl border border-line bg-card">
          <StatHeading />
          <div aria-hidden="true" className="relative min-h-0 flex-1 overflow-hidden">
            {/* Rows run past the edges on purpose (marquee), so layout QA skips them. */}
            <div data-qa-ignore className="absolute inset-0 flex flex-col justify-center gap-2.5 md:gap-3" style={{ opacity: wallOpacity }}>
              {rows.map((row, r) => {
                const dir = r % 2 ? 1 : -1;
                const fromMid = r - MID;
                const style: CSSProperties = {
                  transform: `translate3d(${move * (dir * p * 420 - 260)}px, ${move * -fromMid * collapse * 42}px, 0) scale(${1 - collapse * 0.18})`,
                  opacity: 1 - Math.abs(fromMid) * collapse * 0.3,
                };
                return (
                  <div key={r} className="flex shrink-0 gap-2.5 whitespace-nowrap will-change-transform md:gap-3" style={style}>
                    {row.map((q, k) => (
                      <span
                        key={k}
                        className={`rounded-lg px-3 py-1.5 font-mono text-[12px] md:text-[13px] ${
                          (r + k) % 7 === 3 ? "bg-ink text-paper" : "border border-line bg-paper text-ink-2"
                        }`}
                      >
                        {q}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-card to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-card to-transparent" />

            <div
              className="absolute left-1/2 top-1/2 w-[min(24rem,calc(100%-2.5rem))]"
              style={{ opacity: boxIn, transform: `translate(-50%, -50%) scale(${0.92 + boxIn * 0.08})` }}
            >
              <PromptBox caret={typed < FINAL.length}>{FINAL.slice(0, typed)}</PromptBox>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
