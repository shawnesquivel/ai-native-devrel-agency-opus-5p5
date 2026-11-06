"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { WORK, type WorkCase } from "@/lib/site";
import BrandIcon, { ICON_LABELS } from "./BrandIcon";

const LOGO: Record<WorkCase["logo"], { src?: string; w: number; h: number }> = {
  composio: { src: "/logos/composio.svg", w: 93, h: 18 },
  rentahuman: { src: "/logos/rentahuman.svg", w: 18, h: 18 },
  cursor: { src: "/logos/cursor.svg", w: 76, h: 18 },
  chat2db: { src: "/logos/chat2db.svg", w: 103, h: 18 },
  gumloop: { w: 0, h: 0 },
};

function CompanyLogo({ item }: { item: WorkCase }) {
  const logo = LOGO[item.logo];
  return (
    <span className="flex h-5 items-center gap-2" title={item.company}>
      {logo.src && <Image src={logo.src} alt="" width={logo.w} height={logo.h} unoptimized className="h-[18px] w-auto brightness-0" />}
      {(!logo.src || item.logo === "rentahuman") && (
        <span className="text-[15px] font-semibold leading-none tracking-[-0.02em]">{item.company}</span>
      )}
      <span className="sr-only">{item.company}</span>
    </span>
  );
}

function Check() {
  return (
    <span className="grid size-4 shrink-0 place-items-center rounded-full bg-ink text-paper">
      <svg viewBox="0 0 16 16" className="size-2.5" fill="none" aria-hidden="true">
        <path d="M3.5 8.5 6.5 11.5 12.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Card({ item }: { item: WorkCase }) {
  const stat = item.deliverables.find((d) => /\d/.test(d));
  return (
    <a href={item.href} target="_blank" rel="noopener" className="group relative flex h-full flex-col rounded-xl border border-line bg-card p-3 transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-[0_14px_32px_-22px_rgb(18_18_17/0.45)]">
      <span className="relative block aspect-video overflow-hidden rounded-lg border border-line bg-ink">
        {item.thumb ? (
          <Image
            src={item.thumb}
            alt=""
            fill
            sizes="(min-width: 1024px) 340px, 80vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />
        ) : (
          <span className="absolute inset-0 flex flex-col justify-end p-4 text-paper">
            <span className="text-5xl font-semibold leading-none tracking-[-0.05em]">{stat?.split(" ")[0]}</span>
            <span className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#bdbbb2]">{stat?.split(" ").slice(1).join(" ")}</span>
          </span>
        )}
        <span className="absolute left-2.5 top-2.5 grid size-8 place-items-center rounded-lg bg-paper text-ink shadow-[0_2px_8px_rgb(0_0_0/0.25)]">
          <BrandIcon name={item.platform} className="size-4" />
          <span className="sr-only">{ICON_LABELS[item.platform]}</span>
        </span>
      </span>
      <span className="flex flex-1 flex-col px-1.5 pb-1.5 pt-4">
        <CompanyLogo item={item} />
        <span className="mt-3 block text-pretty text-[15px] font-medium leading-snug tracking-[-0.01em]">{item.title}</span>
        <span className="mt-auto flex flex-col gap-1.5 pt-4">
          {item.deliverables.map((d) => (
            <span key={d} className="flex items-center gap-2 text-[14px] text-ink-2">
              <Check />
              {d}
            </span>
          ))}
        </span>
      </span>
    </a>
  );
}

/* Gentle drift on desktop; pauses on hover, focus, touch and when offscreen. Ping-pongs at the ends. */
const SPEED = 0.35;

export default function WorkCarousel() {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const desktop = window.matchMedia("(min-width: 64rem)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let dir = 1;
    let paused = false;
    let visible = false;
    let pos = el.scrollLeft;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (paused || !visible || !desktop.matches || reduced.matches) {
        pos = el.scrollLeft;
        return;
      }
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      pos += SPEED * dir;
      if (pos >= max) {
        pos = max;
        dir = -1;
      } else if (pos <= 0) {
        pos = 0;
        dir = 1;
      }
      el.scrollLeft = pos;
    };
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);
    const pause = () => (paused = true);
    const resume = () => (paused = false);
    const events: [string, () => void][] = [
      ["mouseenter", pause],
      ["mouseleave", resume],
      ["focusin", pause],
      ["focusout", resume],
      ["pointerdown", pause],
      ["wheel", pause],
    ];
    events.forEach(([e, fn]) => el.addEventListener(e, fn, { passive: true }));
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      events.forEach(([e, fn]) => el.removeEventListener(e, fn));
    };
  }, []);

  return (
    <ul
      ref={ref}
      tabIndex={0}
      aria-label="Case studies"
      className="snap-row -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 md:-mx-12 md:scroll-px-12 md:px-12 lg:snap-none"
    >
      {WORK.map((item) => (
        <li key={item.href} className="w-[82%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]">
          <Card item={item} />
        </li>
      ))}
    </ul>
  );
}
