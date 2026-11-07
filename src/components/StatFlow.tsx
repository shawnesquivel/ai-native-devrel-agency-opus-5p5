import { HOOK_STAT } from "@/lib/site";
import BrandIcon from "./BrandIcon";

/* Buyers streaming into one assistant. viewBox is 640x200 with the assistant at the centre (320,100);
   `slice` keeps the centre fixed, so narrow screens crop the edges and the streams enter from offscreen. */
const CX = 320;
const CY = 100;
const ROWS = [14, 42, 70, 98, 126, 154, 186];

type Lane = { d: string; p0: [number, number]; c: [number, number] };
const LANES: Lane[] = ROWS.flatMap((y) => {
  const left: Lane = { d: `M0 ${y} Q 170 ${y} ${CX} ${CY}`, p0: [0, y], c: [170, y] };
  const right: Lane = { d: `M640 ${y} Q 470 ${y} ${CX} ${CY}`, p0: [640, y], c: [470, y] };
  return [left, right];
});

const at = ({ p0, c }: Lane, t: number) => {
  const u = 1 - t;
  return [u * u * p0[0] + 2 * u * t * c[0] + t * t * CX, u * u * p0[1] + 2 * u * t * c[1] + t * t * CY];
};

const DUR = 4.2;

/** The 1.2B headline with its source link and subline. Shared with the /preview variations. */
export function StatHeading({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-1 px-5 pt-6 md:flex-row md:items-baseline md:justify-between md:px-7 md:pt-7 ${className}`}>
      <h3 className="flex items-start gap-2 text-balance text-2xl font-semibold leading-tight tracking-[-0.03em] md:text-3xl">
        {HOOK_STAT.headline}
        <a
          href={HOOK_STAT.href}
          target="_blank"
          rel="noopener"
          aria-label={`Source: ${HOOK_STAT.source}`}
          title={`Source: ${HOOK_STAT.source}`}
          className="mt-1 grid size-6 shrink-0 place-items-center rounded-md border border-line text-muted transition-colors hover:border-ink hover:text-ink"
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
      </h3>
      <p className="text-[15px] text-muted">{HOOK_STAT.sub}</p>
    </div>
  );
}

export default function StatFlow() {
  return (
    <div data-reveal className="mb-10 overflow-hidden rounded-xl border border-line bg-card md:mb-12">
      <StatHeading />

      <div className="relative h-56 md:h-64" aria-hidden="true">
        <svg viewBox="0 0 640 200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" fill="none">
          {LANES.map((l) => (
            <path key={l.d} d={l.d} className="stroke-line" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
          <g className="flow-moving">
            {LANES.map((l, n) =>
              [0, 1, 2, 3].map((k) => {
                const begin = `${-((n * 0.61 + k * (DUR / 4)) % DUR).toFixed(2)}s`;
                const accent = (n + k) % 9 === 4;
                return (
                  <circle key={`${n}-${k}`} r={accent ? 3 : 2.4} className={accent ? "fill-accent" : "fill-ink"} opacity="0">
                    <animateMotion dur={`${DUR}s`} begin={begin} repeatCount="indefinite" path={l.d} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.8 1" />
                    <animate attributeName="opacity" dur={`${DUR}s`} begin={begin} repeatCount="indefinite" values="0;0.85;0.85;0" keyTimes="0;0.12;0.8;1" />
                  </circle>
                );
              }),
            )}
          </g>
          <g className="flow-static">
            {LANES.map((l, n) =>
              [0.2, 0.45, 0.68].map((t) => {
                const [x, y] = at(l, t);
                return <circle key={`${n}-${t}`} cx={x} cy={y} r="2.4" className="fill-ink" opacity="0.6" />;
              }),
            )}
          </g>
        </svg>

        <div className="absolute left-1/2 top-1/2 w-[min(15rem,60%)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-line-strong bg-card p-3 shadow-[0_16px_40px_-24px_rgb(18_18_17/0.45)]">
          <p className="flex items-center gap-2 text-[13px] font-medium text-ink">
            <BrandIcon name="chatgpt" className="size-4" />
            ChatGPT
          </p>
          <p className="mt-2.5 flex items-center justify-between gap-2 rounded-lg border border-line bg-paper px-2.5 py-2 text-[13px] text-muted">
            Ask anything…
            <span className="grid size-5 place-items-center rounded-full bg-ink text-paper">
              <svg viewBox="0 0 16 16" className="size-2.5" fill="none">
                <path d="M8 12.5v-9M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
