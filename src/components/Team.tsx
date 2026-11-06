import Image from "next/image";
import { TEAM, TEAM_COPY, type TeamChip } from "@/lib/site";
import BrandIcon from "./BrandIcon";
import { Section, i } from "./ui";

const LOGO = "h-4 w-auto brightness-0";

function ChipMark({ mark }: { mark: NonNullable<TeamChip["marks"]>[number] }) {
  if (mark === "composio") return <Image src="/logos/composio-mark.svg" alt="" width={14} height={16} unoptimized className={LOGO} />;
  if (mark === "litellm") return <Image src="/logos/litellm-mark.png" alt="" width={16} height={16} unoptimized className="size-4 rounded-[3px]" />;
  return <BrandIcon name={mark} className="size-3.5" />;
}

function Chip({ chip }: { chip: TeamChip }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 text-[13px] text-ink">
      {chip.marks && (
        <span className="flex items-center gap-1" aria-hidden="true">
          {chip.marks.map((m) => (
            <ChipMark key={m} mark={m} />
          ))}
        </span>
      )}
      {chip.label}
    </span>
  );
}


export default function Team() {
  return (
    <Section id="team" index="06" label="Team" title={TEAM_COPY.title} intro={TEAM_COPY.intro}>
      <ul className="grid border-l border-t border-line md:grid-cols-2">
        {TEAM.map((m, n) => (
          <li key={m.role} data-reveal style={i(n)} className="flex flex-col gap-4 border-b border-r border-line bg-card p-5 sm:p-6 md:gap-5 md:p-7">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">{m.role}</p>
            <p className="text-pretty text-[17px] leading-relaxed text-ink md:text-lg">{m.body}</p>
            <ul className="mt-auto flex flex-wrap gap-1.5 pt-1" aria-label="Proof">
              {m.chips.map((c) => (
                <li key={c.label}>
                  <Chip chip={c} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <p data-reveal className="mt-6 flex items-center gap-3 text-lg font-medium tracking-[-0.015em] text-ink">
        <span aria-hidden="true" className="size-2 shrink-0 bg-accent" />
        {TEAM_COPY.closer}
      </p>
    </Section>
  );
}
