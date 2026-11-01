import { OFFERS } from "@/lib/site";
import BrandIcon from "./BrandIcon";
import { CtaLink, Section, i } from "./ui";

export default function Offers() {
  return (
    <Section id="services" index="03" label="Services" title="Ways to work with us.">
      <ul className="grid gap-3 md:grid-cols-3 md:grid-rows-[auto_auto_1fr_auto]">
        {OFFERS.map((o, n) => (
          <li
            key={o.title}
            data-reveal
            style={i(n)}
            className="flex flex-col rounded-xl border md:row-span-4 md:grid md:grid-rows-subgrid md:gap-y-0 border-line bg-card p-6 transition-[border-color,box-shadow] duration-300 hover:border-line-strong hover:shadow-[0_12px_32px_-20px_rgb(18_18_17/0.35)] md:p-7"
          >
            <div className="flex h-8 items-center justify-between">
              <span className="font-mono text-xs text-muted">{String(n + 1).padStart(2, "0")}</span>
              {o.icons && (
                <span className="flex gap-1.5">
                  {o.icons.map((icon) => (
                    <span key={icon} className="grid size-8 place-items-center rounded-lg border border-line bg-paper text-ink">
                      <BrandIcon name={icon} className="size-4" />
                    </span>
                  ))}
                </span>
              )}
            </div>
            <h3 className="mt-6 text-2xl font-semibold leading-tight tracking-[-0.03em]">{o.title}</h3>
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
