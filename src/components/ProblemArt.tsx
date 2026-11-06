import type { CSSProperties, JSX } from "react";
import { BRAND_NAME, type ProblemArt as Art } from "@/lib/site";
import BrandIcon from "./BrandIcon";

/* Small looping illustrations for the problem cards. Styles live under `.pa` in globals.css.
   `.pa-at` reveals an element at --at (a share of the 9s loop); base styles are the finished frame. */
const at = (share: number) => ({ "--at": share }) as CSSProperties;

const SOURCES = [
  { icon: "supabase", title: "Use Supabase with Next.js", domain: "supabase.com/docs" },
  { icon: "neon", title: "Neon vs PlanetScale: which Postgres to pick", domain: "neon.com/blog" },
  { icon: "reddit", title: "Best Postgres for Next.js in 2026?", domain: "reddit.com/r/nextjs" },
] as const;

function Named({ icon, children }: { icon: "supabase" | "neon"; children: string }) {
  return (
    <span className="inline-flex items-baseline gap-1 font-semibold">
      <BrandIcon name={icon} className="size-3 translate-y-[1px] self-center" />
      {children}
    </span>
  );
}

function Answer() {
  return (
    <div className="flex h-full flex-col justify-center gap-2 px-4 py-6">
      <p className="pa-at self-end rounded-lg rounded-br-sm bg-ink px-2.5 py-1 font-mono text-[11px] text-paper" style={at(0)}>
        best Postgres for Next.js?
      </p>
      <p className="pa-at flex items-center gap-1.5 font-mono text-[11px] text-muted" style={at(0.1)}>
        <span className="flex gap-0.5" aria-hidden="true">
          {[0, 1, 2].map((d) => (
            <span key={d} className="demo-dot size-1 rounded-full bg-muted" style={{ animationDelay: `${d * 150}ms` }} />
          ))}
        </span>
        Searching the web…
      </p>
      <p className="flex flex-wrap gap-1">
        {SOURCES.map((src, n) => (
          <span
            key={src.domain}
            title={src.title}
            className="pa-at inline-flex items-center gap-1 rounded border border-line bg-card px-1.5 py-0.5 font-mono text-[10.5px] text-ink-2"
            style={at(0.2 + n * 0.06)}
          >
            <BrandIcon name={src.icon} className="size-2.5 text-ink" />
            {src.domain}
          </span>
        ))}
      </p>
      <p className="pa-at text-[12.5px] leading-snug text-ink" style={at(0.45)}>
        I recommend <Named icon="supabase">Supabase</Named>… and <Named icon="neon">Neon</Named>…
      </p>
      <p
        className="pa-at w-fit rounded-full border border-dashed border-line-strong px-2 py-0.5 font-mono text-[10.5px] text-muted"
        style={at(0.6)}
      >
        You: not mentioned
      </p>
    </div>
  );
}

function Docs() {
  return (
    <div className="relative h-full py-4 pl-16 pr-5">
      <div className="flex flex-col gap-2.5">
        <span className="h-1.5 w-[42%] rounded-full bg-ink" />
        <span className="h-1.5 w-[88%] rounded-full bg-line-strong" />
        <span className="h-1.5 w-[74%] rounded-full bg-line-strong" />
        <span className="pa-bad h-1.5 w-[80%] rounded-full bg-line-strong" style={at(0.45)} />
        <span className="h-1.5 w-[62%] rounded-full bg-line-strong" />
        <span className="h-1.5 w-[70%] rounded-full bg-line-strong" />
      </div>
      <span className="pa-scan absolute left-3 right-4 top-[38%] flex items-center gap-1.5">
        <span className="flex -space-x-1.5">
          {(["cursor", "claude", "codex"] as const).map((icon) => (
            <span key={icon} className="grid size-5 place-items-center rounded border border-line bg-card">
              <BrandIcon name={icon} className="size-3" />
            </span>
          ))}
        </span>
        <span className="h-px flex-1 bg-ink/30" />
        <span
          className="pa-at grid size-5 place-items-center rounded-full border border-ink bg-card font-mono text-[11px] text-ink"
          style={at(0.52)}
        >
          ?
        </span>
      </span>
      <span
        className="pa-at absolute bottom-3 right-3 rounded-full border border-dashed border-line-strong bg-paper px-2 py-0.5 font-mono text-[10.5px] text-muted"
        style={at(0.62)}
      >
        failed · reason unknown
      </span>
    </div>
  );
}

const SHIPS = [3, 16, 29, 42, 55, 68, 81, 94];

function Hire() {
  return (
    <div className="flex h-full flex-col justify-center gap-4 px-5">
      <div>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">DevRel hire</p>
        <div className="relative mt-1.5 h-2 rounded-full bg-line">
          <span className="pa-onboard absolute inset-y-0 left-0 w-[84%] origin-left rounded-l-full bg-line-strong" />
          <span
            className="pa-fade absolute top-1/2 z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink bg-card"
            style={{ left: "84%", ...at(0.74) }}
          />
        </div>
        <p className="mt-1 flex justify-between font-mono text-[10.5px] text-muted">
          <span>onboarding</span>
          <span className="pa-at" style={at(0.74)}>
            first post
          </span>
        </p>
      </div>
      <div>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink">{BRAND_NAME}</p>
        <div className="relative mt-1.5 h-2 rounded-full bg-line">
          {SHIPS.map((x, n) => (
            <span
              key={x}
              className="pa-fade absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
              style={{ left: `${x}%`, ...at(0.05 + n * 0.075) }}
            />
          ))}
        </div>
        <p className="mt-1 flex justify-between font-mono text-[10.5px] text-muted">
          <span className="text-ink">day 1</span>
          <span>month 3</span>
        </p>
      </div>
    </div>
  );
}

const ARTS: Record<Art, () => JSX.Element> = { answer: Answer, docs: Docs, hire: Hire };

export default function ProblemArt({ art }: { art: Art }) {
  const Comp = ARTS[art];
  return (
    <div data-observe aria-hidden="true" className="pa relative h-56 overflow-hidden rounded-lg border border-line bg-paper">
      <Comp />
    </div>
  );
}
