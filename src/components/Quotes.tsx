"use client";

import { useEffect, useRef, useState } from "react";
import { QUOTES } from "@/lib/site";
import Image from "next/image";
import { Section } from "./ui";

const INTERVAL = 7000;

export default function Quotes() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(true);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => {
      if (!reduced.current) setActive((a) => (a + 1) % QUOTES.length);
    }, INTERVAL);
    return () => clearTimeout(t);
  }, [active, paused]);

  return (
    <Section id="agents" title="Make Something Agents Want">
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        className="rounded-xl border border-line bg-card p-6 sm:p-8 md:p-12"
      >
        <div className="grid">
          {QUOTES.map((q, n) => (
            <figure
              key={q.href}
              aria-hidden={n !== active}
              className={`col-start-1 row-start-1 flex flex-col justify-center transition-[opacity,transform] duration-700 ease-out ${
                n === active ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
              }`}
            >
              <blockquote className="max-w-[60ch] text-pretty text-[18px] font-normal leading-relaxed tracking-normal text-ink-2 md:text-[22px]">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 text-[15px] sm:mt-8">
                <Image
                  src={q.avatar}
                  alt=""
                  width={28}
                  height={28}
                  preload={n === 0}
                  loading={n === 0 ? undefined : "eager"}
                  className="size-6 shrink-0 rounded-full border border-line bg-paper object-cover md:size-7"
                />
                <span className="min-w-0 text-pretty leading-snug">
                  <span className="font-semibold">{q.name}</span>
                  {q.title && <span className="text-muted">, {q.title}</span>}
                </span>
                <a
                  href={q.href}
                  target="_blank"
                  rel="noopener"
                  tabIndex={n === active ? 0 : -1}
                  aria-label={`Source: ${q.name}`}
                  className="grid size-7 place-items-center rounded-md border border-line text-muted transition-colors hover:border-ink hover:text-ink"
                >
                  <svg viewBox="0 0 16 16" className="size-3" fill="none" aria-hidden="true">
                    <path
                      d="M6.5 9.5 9.5 6.5M7 4.5l1.2-1.2a2.5 2.5 0 0 1 3.5 3.5L10.5 8M9 11.5l-1.2 1.2a2.5 2.5 0 0 1-3.5-3.5L5.5 8"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Section>
  );
}
