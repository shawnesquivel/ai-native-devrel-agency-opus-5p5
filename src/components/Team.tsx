import { POINTS, TEAM } from "@/lib/site";
import { Section, i } from "./ui";

export default function Team() {
  return (
    <Section id="team" index="04" label="Team" title="Engineers who've done DevRel from the inside.">
      <ul className="grid border-l border-t border-line md:grid-cols-3">
        {TEAM.map((m, n) => (
          <li key={n} data-reveal style={i(n)} className="flex flex-col gap-8 border-b border-r border-line bg-card p-6 md:p-7">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">{m.role}</span>
              <span aria-hidden="true" className="flex gap-1">
                {Array.from({ length: n === 2 ? 3 : 1 }).map((_, k) => (
                  <span key={k} className="size-2 border border-ink" />
                ))}
              </span>
            </div>
            <ul className="space-y-1.5">
              {m.creds.map((c) => (
                <li key={c} className="text-pretty text-lg font-medium leading-snug tracking-[-0.015em]">
                  {c}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p data-reveal className="mt-6 flex items-center gap-3 text-[15px] text-ink-2">
        <span aria-hidden="true" className="size-2 shrink-0 bg-accent" />
        Every piece is reviewed by an engineer and by our own review agents.
      </p>

      <ul className="mt-12 grid border-t border-line md:grid-cols-3">
        {POINTS.map((p, n) => (
          <li key={p.label} data-reveal style={i(n)} className={`py-6 md:px-6 md:first:pl-0 ${n ? "border-t border-line md:border-l md:border-t-0" : ""}`}>
            <p className="text-2xl font-semibold tracking-[-0.03em]">{p.label}</p>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{p.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
