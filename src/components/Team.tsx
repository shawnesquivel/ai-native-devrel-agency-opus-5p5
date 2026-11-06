import { TEAM, TEAM_INTRO } from "@/lib/site";
import { Section, i } from "./ui";

export default function Team() {
  return (
    <Section id="team" index="06" label="Team" title="Engineers who have done DevRel at leading AI startups." intro={TEAM_INTRO}>
      <ul className="grid border-l border-t border-line md:grid-cols-2">
        {TEAM.map((m, n) => (
          <li key={n} data-reveal style={i(n)} className="flex flex-col gap-8 border-b border-r border-line bg-card p-6 md:p-7">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted">{m.role}</span>
              <span aria-hidden="true" className="size-2 border border-ink" />
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
    </Section>
  );
}
