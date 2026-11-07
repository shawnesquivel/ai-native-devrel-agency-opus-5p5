"use client";

import { useRef } from "react";
import { HOOK_STAT } from "@/lib/site";
import { StatHeading } from "../StatFlow";
import { FINAL, PromptBox, QUESTIONS, useInView, useTypingCycle } from "./chatgpt-shared";

const SEQUENCE = [...QUESTIONS.slice(0, 5), FINAL];
const LAST = SEQUENCE.length - 1;
const TARGET = "1,200,000,000";

function Odometer({ run }: { run: boolean }) {
  let digit = 0;
  return (
    <span data-qa-ignore className="inline-flex font-semibold tabular-nums leading-none tracking-[-0.05em]" aria-label="1.2 billion">
      {[...TARGET].map((ch, n) => {
        if (ch === ",") {
          return (
            <span key={n} aria-hidden="true" className="text-muted">
              ,
            </span>
          );
        }
        const value = Number(ch);
        const order = digit++;
        /* Each column spins through a few full turns before landing, leftmost first. */
        const turns = 1 + (order % 3);
        const stop = run ? turns * 10 + value : 0;
        return (
          <span key={n} aria-hidden="true" className="odo-digit">
            <span style={{ transform: `translateY(-${stop}em)`, transitionDelay: `${order * 70}ms` }}>
              {Array.from({ length: 40 }, (_, k) => (
                <span key={k} className="h-[1em]">
                  {k % 10}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}

export default function ChatGptOdometer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, "0px");
  const { index, text, done } = useTypingCycle(SEQUENCE, {
    active: inView,
    holdMs: (n) => (n === LAST ? 4200 : 650),
  });
  const answered = index === LAST && done;
  const sent = SEQUENCE.slice(0, answered ? index + 1 : index).slice(-4);

  return (
    <div ref={ref} className="overflow-hidden rounded-xl border border-line bg-card">
      <StatHeading />

      <div className="grid gap-8 px-5 pb-6 pt-8 md:grid-cols-2 md:items-center md:gap-10 md:px-7 md:pb-8 md:pt-10">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">ChatGPT weekly users</p>
          <p className="mt-3 text-[2.4rem] sm:text-6xl md:text-[3.25rem] lg:text-[4.25rem]">
            <Odometer run={inView} />
          </p>
          <a
            href={HOOK_STAT.href}
            target="_blank"
            rel="noopener"
            className="mt-3 inline-block font-mono text-[11px] text-muted underline decoration-line-strong underline-offset-4 hover:text-ink"
          >
            Source: {HOOK_STAT.source}
          </a>
        </div>

        <div aria-hidden="true" className="relative flex h-[19rem] flex-col justify-end gap-2 overflow-hidden rounded-lg border border-line bg-paper p-3 sm:p-4">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-paper to-transparent" />
          {sent.map((q) => (
            <p key={q} className="sent-in self-end rounded-lg rounded-br-sm bg-ink px-2.5 py-1 font-mono text-[11.5px] text-paper">
              {q}
            </p>
          ))}
          <div className={`grid transition-[grid-template-rows,opacity] duration-500 ${answered ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="overflow-hidden">
              <p className="pt-1 text-[14px] leading-snug text-ink">
                For a Next.js app, I&apos;d go with{" "}
                <span className="rounded border border-ink/20 bg-card px-1.5 py-0.5 font-semibold">your competitor</span>.
              </p>
              <p className="mt-2 w-fit rounded-full border border-dashed border-line-strong px-2 py-0.5 font-mono text-[10.5px] text-muted">
                You: not mentioned
              </p>
            </div>
          </div>
          <PromptBox caret={!answered} className="mt-1">
            {answered ? <span className="text-muted">Ask anything…</span> : text}
          </PromptBox>
        </div>
      </div>
    </div>
  );
}
