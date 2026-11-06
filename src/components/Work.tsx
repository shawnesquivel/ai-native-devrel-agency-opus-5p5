import { STATS } from "@/lib/site";
import CountUp from "./CountUp";
import Logos from "./Logos";
import WorkCarousel from "./WorkCarousel";
import { Section, i } from "./ui";

function External() {
  return (
    <svg viewBox="0 0 16 16" className="size-3 shrink-0" aria-hidden="true" fill="none">
      <path d="M5 11 11 5M6 4.5h5.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Work() {
  return (
    <Section id="work" index="07" label="Proof" title="Our work.">
      <h3 data-reveal className="mb-5 font-mono text-xs uppercase tracking-[0.14em] text-muted">
        Our team has worked with
      </h3>
      <Logos />

      <ul className="mt-16 grid grid-cols-2 border-l border-t border-line md:mt-20 lg:grid-cols-4">
        {STATS.map((s, n) => {
          const body = (
            <>
              <span className="block text-[2.125rem] font-semibold leading-none tracking-[-0.045em] sm:text-5xl md:text-[3.5rem]">
                <CountUp value={s.value} suffix={s.suffix} />
              </span>
              <span className="flex items-start justify-between gap-2 text-pretty text-sm leading-snug text-muted">
                <span>{s.label}</span>
                {s.href && (
                  <span className="mt-0.5 text-line-strong transition-colors duration-300 group-hover:text-ink">
                    <External />
                  </span>
                )}
              </span>
            </>
          );
          const cell = "flex h-full flex-col gap-3 p-5 md:p-7";
          return (
            <li key={s.label} data-reveal style={i(n)} className="border-b border-r border-line">
              {s.href ? (
                <a href={s.href} target="_blank" rel="noopener" className={`group ${cell} transition-colors duration-300 hover:bg-card`}>
                  {body}
                </a>
              ) : (
                <div className={cell}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-16 md:mt-20">
        <WorkCarousel />
      </div>
    </Section>
  );
}
