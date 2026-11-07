"use client";

import { useEffect, useState, type ReactNode } from "react";
import BrandIcon from "../BrandIcon";

/* Generic developer questions. Illustrative only: no brands, no quotes. */
export const QUESTIONS = [
  "how do I add auth to my nextjs app",
  "best vector database for RAG",
  "cheapest way to host postgres",
  "how to rate limit an api route",
  "which logging tool for a node backend",
  "how do I test webhooks locally",
  "what orm should I use with typescript",
  "add search to my docs site",
  "best email api for transactional email",
  "how do I deploy a python worker",
  "set up background jobs in node",
  "best feature flag tool for a startup",
  "how to cache api responses",
  "which auth library supports passkeys",
  "monitor errors in a react app",
  "best way to store user uploads",
];

export const FINAL = "best database for my nextjs app";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/** Types each prompt, holds, then moves on. Reduced motion shows whole prompts and steps slowly. */
export function useTypingCycle(
  prompts: string[],
  { typeMs = 38, holdMs = 1100, active = true }: { typeMs?: number; holdMs?: number | ((index: number) => number); active?: boolean } = {},
) {
  const reduced = useReducedMotion();
  const [state, setState] = useState({ index: 0, chars: 0 });

  useEffect(() => {
    if (!active) return;
    const text = prompts[state.index];
    if (reduced) {
      const t = setTimeout(() => setState((s) => ({ index: (s.index + 1) % prompts.length, chars: prompts[(s.index + 1) % prompts.length].length })), 3200);
      return () => clearTimeout(t);
    }
    const done = state.chars >= text.length;
    const t = setTimeout(
      () => setState((s) => (done ? { index: (s.index + 1) % prompts.length, chars: 0 } : { ...s, chars: s.chars + 1 })),
      done ? (typeof holdMs === "function" ? holdMs(state.index) : holdMs) : typeMs + (Math.random() * typeMs) / 2,
    );
    return () => clearTimeout(t);
  }, [state, prompts, typeMs, holdMs, active, reduced]);

  const text = prompts[state.index];
  const chars = reduced ? text.length : state.chars;
  return { index: state.index, text: text.slice(0, chars), done: chars >= text.length };
}

export function PromptBox({ children, caret = true, className = "" }: { children: ReactNode; caret?: boolean; className?: string }) {
  return (
    <div className={`rounded-xl border border-line-strong bg-card p-3 shadow-[0_16px_40px_-24px_rgb(18_18_17/0.45)] ${className}`}>
      <p className="flex items-center gap-2 text-[13px] font-medium text-ink">
        <BrandIcon name="chatgpt" className="size-4" />
        ChatGPT
      </p>
      <div className="mt-2.5 flex min-h-10 items-center justify-between gap-2 rounded-lg border border-line bg-paper px-3 py-2 text-[14px] text-ink">
        <span className="min-w-0 text-pretty break-words">
          {children}
          {caret && <span aria-hidden="true" className="caret ml-px inline-block h-[1.05em] w-[1.5px] translate-y-[2px] bg-ink" />}
        </span>
        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-ink text-paper">
          <svg viewBox="0 0 16 16" className="size-3" fill="none" aria-hidden="true">
            <path d="M8 12.5v-9M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
}

/** Pauses work when the element is offscreen. */
export function useInView<T extends Element>(ref: React.RefObject<T | null>, rootMargin = "100px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}
