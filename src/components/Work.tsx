import { POSTS, STATS, VIDEOS } from "@/lib/site";
import CountUp from "./CountUp";
import Logos from "./Logos";
import VideoEmbed from "./VideoEmbed";
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
    <Section id="work" index="06" label="Proof" title="Our work.">
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

      <ul
        aria-label="Videos"
        className="snap-row -mx-5 mt-16 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-x-4 sm:gap-y-8 sm:overflow-visible sm:px-0 sm:pb-0 md:mt-20 lg:grid-cols-3"
      >
        {VIDEOS.map((v, n) => (
          <li key={v.id} data-reveal style={i(n)} className="w-[82%] shrink-0 snap-start sm:w-auto">
            <VideoEmbed id={v.id} title={v.title} thumb={v.thumb} />
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{v.channel}</p>
            <p className="mt-1 text-pretty text-[15px] font-medium leading-snug tracking-[-0.01em]">{v.title}</p>
          </li>
        ))}
      </ul>

      <ul
        aria-label="Videos on X"
        className="snap-row -mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:mt-12 sm:grid sm:snap-none sm:grid-cols-3 sm:gap-0 sm:overflow-visible sm:border-l sm:border-t sm:border-line sm:px-0 sm:pb-0"
      >
        {POSTS.map((p, n) => (
          <li
            key={p.href}
            data-reveal
            style={i(n)}
            className="w-[82%] shrink-0 snap-start rounded-lg border border-line sm:w-auto sm:rounded-none sm:border-0 sm:border-b sm:border-r"
          >
            <a
              href={p.href}
              target="_blank"
              rel="noopener"
              className="group flex h-full items-center justify-between gap-4 p-5 transition-colors duration-300 hover:bg-card md:px-6"
            >
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Video on X</span>
                <span className="mt-1.5 block text-[15px] font-medium tracking-[-0.01em]">{p.title}</span>
              </span>
              <span className="text-line-strong transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink">
                <External />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
