"use client";

import { useEffect, useRef, useState } from "react";
import { BRAND_NAME } from "@/lib/site";
import { Mark } from "./Brand";
import BrandIcon, { type IconName } from "./BrandIcon";

const OUTPUTS: { icon: IconName; label: string; text: string }[] = [
  { icon: "github", label: "GitHub", text: "Created public benchmark evals repo" },
  { icon: "medium", label: "Medium", text: "Postgres Poolers Compared: Our Public p95 Benchmark" },
  { icon: "linkedin", label: "LinkedIn", text: "Drafted a founder post" },
];

/* Step: 0 Greg, 1 Sam, 2 the tag, 3 Lode typing, 4-6 outputs. */
const LAST = 6;
const TIMES = [200, 1000, 1800, 2600, 4000, 4500, 5000];

function Avatar({ initial }: { initial: string }) {
  return <span className="grid size-7 shrink-0 place-items-center rounded-md bg-line-strong font-mono text-[11px] text-ink">{initial}</span>;
}

export default function SlackThread() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(LAST);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setStep(-1);
        TIMES.forEach((ms, n) => timers.push(window.setTimeout(() => setStep(n), ms)));
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const vis = (n: number) => `transition-[opacity,transform] duration-500 ease-out ${step >= n ? "opacity-100" : "translate-y-1 opacity-0"}`;

  return (
    <div ref={ref} className="rounded-lg border border-line bg-paper text-[14px]" aria-label="Example Slack thread">
      <p className="flex items-center gap-1.5 border-b border-line px-3 py-2 font-mono text-[11px] text-muted">
        <BrandIcon name="slack" className="size-3" />#agent-studio
      </p>
      <div className="space-y-3 p-3">
        <div className={`flex gap-2.5 ${vis(0)}`}>
          <Avatar initial="G" />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold">Greg</p>
            <p className="leading-snug text-ink-2">p95 dropped to 38ms on the new pooler</p>
            <div className="mt-2 rounded-md border border-line bg-card p-2.5">
              <p className="flex items-center justify-between font-mono text-[10.5px] text-muted">
                <span>pooler-bench · p95 latency</span>
                <span>ms</span>
              </p>
              <div className="mt-2 space-y-1.5 font-mono text-[10.5px]">
                <div className="grid grid-cols-[3.5rem_1fr_2.5rem] items-center gap-2 text-muted">
                  <span>old</span>
                  <span className="h-1.5 rounded-full bg-line-strong" />
                  <span className="text-right">–</span>
                </div>
                <div className="grid grid-cols-[3.5rem_1fr_2.5rem] items-center gap-2 text-ink">
                  <span>new</span>
                  <span className="h-1.5 w-[34%] rounded-full bg-ink" />
                  <span className="text-right">38</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`flex gap-2.5 ${vis(1)}`}>
          <Avatar initial="S" />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold">Sam</p>
            <p className="leading-snug text-ink-2">this is a post.</p>
            <p className={`mt-1 leading-snug text-ink-2 ${vis(2)}`}>
              <span className="rounded bg-accent/25 px-1 font-medium text-ink">@{BRAND_NAME}</span> turn this thread into some content
            </p>
          </div>
        </div>

        <div className={`flex gap-2.5 ${vis(3)}`}>
          <span className="grid size-7 shrink-0 place-items-center rounded-md bg-ink text-paper">
            <Mark className="size-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 text-[13px] font-semibold">
              {BRAND_NAME}
              <span className="rounded border border-line px-1 font-mono text-[10px] font-normal text-muted">APP</span>
            </p>
            <div className="mt-1 grid">
              <span
                aria-hidden="true"
                className={`col-start-1 row-start-1 flex h-5 items-center gap-1 transition-opacity duration-300 ${step === 3 ? "opacity-100" : "opacity-0"}`}
              >
                {[0, 1, 2].map((d) => (
                  <span key={d} className="demo-dot size-1.5 rounded-full bg-muted" style={{ animationDelay: `${d * 150}ms` }} />
                ))}
              </span>
              <ul className="col-start-1 row-start-1 space-y-1.5">
                {OUTPUTS.map((o, n) => (
                  <li key={o.label} className={`flex items-center gap-2 rounded-md border border-line bg-card px-2 py-1.5 ${vis(4 + n)}`}>
                    <span className="grid size-5 shrink-0 place-items-center rounded text-ink" title={o.label}>
                      <BrandIcon name={o.icon} className="size-3.5" />
                      <span className="sr-only">{o.label}</span>
                    </span>
                    <span className="min-w-0 text-[13px] leading-snug text-ink">{o.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
