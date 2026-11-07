import { PROBLEMS } from "@/lib/site";
import StatFlow from "./StatFlow";
import ProblemArt from "./ProblemArt";
import { Section, i } from "./ui";

export default function Problem() {
  return (
    <Section id="problem" title="Agents answer before you do.">
      <StatFlow />

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
