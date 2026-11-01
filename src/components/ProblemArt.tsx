import type { JSX } from "react";
import type { ProblemArt as Art } from "@/lib/site";
import BrandIcon from "./BrandIcon";

/* Small looping illustrations for the problem cards. Styles live under `.pa` in globals.css. */

function Answer() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-4">
      <p className="pa-k1 self-end rounded-lg rounded-br-sm bg-ink px-2.5 py-1.5 font-mono text-[11px] text-paper">best auth sdk?</p>
      <div className="flex items-start gap-2">
        <span className="pa-k2 grid size-6 shrink-0 place-items-center rounded-md border border-line bg-card">
          <BrandIcon name="chatgpt" className="size-3.5" />
        </span>
        <div className="flex flex-1 flex-col gap-1.5 pt-1">
          <span className="pa-g2 h-1.5 w-[85%] rounded-full bg-line-strong" />
          <span className="pa-g3 h-1.5 w-[60%] rounded-full bg-line-strong" />
          <span className="pa-k4 mt-1 inline-flex w-fit items-center gap-1.5 rounded-full border border-ink bg-card px-2 py-1 font-mono text-[11px]">
            <span className="size-1.5 rounded-full bg-ink" />
            competitor
          </span>
        </div>
      </div>
    </div>
  );
}

function Docs() {
  return (
    <div className="relative h-full px-5 py-4">
      <div className="flex flex-col gap-2">
        <span className="h-1.5 w-[45%] rounded-full bg-ink" />
        <span className="h-1.5 w-[90%] rounded-full bg-line-strong" />
        <span className="h-1.5 w-[75%] rounded-full bg-line-strong" />
        <span className="pa-bad h-1.5 w-[82%] rounded-full bg-line-strong" />
        <span className="h-1.5 w-[64%] rounded-full bg-line-strong" />
        <span className="h-1.5 w-[70%] rounded-full bg-line-strong" />
      </div>
      <span className="pa-scan absolute inset-x-3 top-[35%] flex items-center gap-1.5">
        <span className="grid size-5 shrink-0 place-items-center rounded border border-line bg-card">
          <BrandIcon name="cursor" className="size-3" />
        </span>
        <span className="h-px flex-1 bg-ink/40" />
      </span>
      <span className="pa-k4 absolute bottom-3 right-3 rounded-full border border-ink bg-accent px-2 py-1 font-mono text-[11px] text-ink">
        can&apos;t parse
      </span>
    </div>
  );
}

function Hire() {
  return (
    <div className="flex h-full flex-col justify-center px-6">
      <div className="relative">
        <div className="flex justify-between">
          {Array.from({ length: 7 }).map((_, n) => (
            <span key={n} className="h-2 w-px bg-line-strong" />
          ))}
        </div>
        <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-line">
          <span className="pa-bar block h-full origin-left rounded-full bg-ink" />
        </span>
        <span className="pa-pill absolute -top-7 left-full -translate-x-1/2 rounded-full border border-ink bg-card px-2 py-0.5 font-mono text-[11px]">
          hire
        </span>
        <div className="mt-2 flex justify-between font-mono text-[11px] text-muted">
          <span>now</span>
          <span>6 mo</span>
        </div>
      </div>
    </div>
  );
}

const ARTS: Record<Art, () => JSX.Element> = { answer: Answer, docs: Docs, hire: Hire };

export default function ProblemArt({ art }: { art: Art }) {
  const Comp = ARTS[art];
  return (
    <div data-observe aria-hidden="true" className="pa relative h-36 overflow-hidden rounded-lg border border-line bg-paper">
      <Comp />
    </div>
  );
}
