import { OFFERS } from "@/lib/site";
import { CtaLink, Section, i } from "./ui";

export default function Offers() {
  return (
    <Section id="work-with-us" index="04" label="Engagements" title="Ways to work with us.">
      <ul className="grid gap-3 md:grid-cols-3 md:grid-rows-[auto_auto_auto_auto_1fr]">
        {OFFERS.map((o, n) => (
          <li
            key={o.title}
            data-reveal
            style={i(n)}
            className="flex flex-col rounded-xl border md:row-span-5 md:grid md:grid-rows-subgrid md:gap-y-0 border-line bg-card p-6 transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-[0_12px_32px_-20px_rgb(18_18_17/0.35)] md:p-7"
          >
            <span className="font-mono text-xs text-muted">{String(n + 1).padStart(2, "0")}</span>
            <h3 className="mt-6 text-2xl font-semibold leading-tight tracking-[-0.03em]">{o.title}</h3>
            <p className="mt-3 text-pretty text-[15px] leading-relaxed text-muted">{o.body}</p>
            <ul className="mt-6 space-y-2.5 border-t border-line pt-6 text-[15px]">
              {o.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-ink" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8 md:self-end">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-2">{o.pricing}</p>
              <CtaLink variant={n === 0 ? "accent" : "primary"} className="mt-4 w-full">
                Book a call
              </CtaLink>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
