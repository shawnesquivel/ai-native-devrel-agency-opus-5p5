import { HOOK_STAT, PROBLEMS } from "@/lib/site";
import BrandIcon from "./BrandIcon";
import ProblemArt from "./ProblemArt";
import { Section, i } from "./ui";

export default function Problem() {
  return (
    <Section id="problem" index="01" label="Problem" title="Developers ask AI before they ask you.">
      <div data-reveal className="mb-10 flex flex-col gap-5 border-y border-line py-8 md:mb-12 md:flex-row md:items-center md:gap-10">
        <p className="flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-line bg-card text-ink">
            <BrandIcon name="chatgpt" className="size-6" />
          </span>
          <span className="text-6xl font-semibold leading-none tracking-[-0.05em] md:text-7xl">{HOOK_STAT.value}</span>
        </p>
        <div>
          <p className="max-w-[34ch] text-pretty text-xl font-medium leading-snug tracking-[-0.02em]">{HOOK_STAT.label}</p>
          <a
            href={HOOK_STAT.href}
            target="_blank"
            rel="noopener"
            className="mt-2 inline-block font-mono text-[11px] uppercase tracking-[0.12em] text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink"
          >
            Source: {HOOK_STAT.source}
          </a>
        </div>
      </div>

      <ul className="grid border-l border-t border-line md:grid-cols-3">
        {PROBLEMS.map((p, n) => (
          <li key={p.title} data-reveal style={i(n)} className="flex flex-col gap-6 border-b border-r border-line bg-card p-5 md:p-6">
            <ProblemArt art={p.art} />
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{p.outcome}</p>
              <h3 className="mt-2 text-balance text-xl font-semibold leading-snug tracking-[-0.02em]">{p.title}</h3>
              <p className="mt-2 text-pretty text-[15px] leading-relaxed text-muted">{p.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
