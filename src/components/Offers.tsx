import { AUDIT, OFFERS, SERVICES, THEME } from "@/lib/site";
import BrandIcon, { type IconName } from "./BrandIcon";
import { CtaLink, Section, i } from "./ui";

function Icons({ icons, size = "size-8" }: { icons: IconName[]; size?: string }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {icons.map((icon) => (
        <span key={icon} className={`grid ${size} place-items-center rounded-lg border border-line bg-paper text-ink`}>
          <BrandIcon name={icon} className="size-4" />
        </span>
      ))}
    </span>
  );
}

export default function Offers() {
  return (
    <Section id="services" index="03" label="Services" title={THEME}>
      <ul className="mb-14 grid grid-cols-1 gap-x-6 border-t border-line sm:grid-cols-2 lg:grid-cols-3 md:mb-16">
        {SERVICES.map((s, n) => (
          <li key={s.label} data-reveal style={i(n)} className="flex items-center gap-3 border-b border-line py-3.5 text-[15px]">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-line bg-card text-ink">
              <BrandIcon name={s.icon} className="size-4" />
            </span>
            {s.label}
          </li>
        ))}
      </ul>

      <h3 data-reveal className="mb-5 font-mono text-xs uppercase tracking-[0.14em] text-muted">
        Ways to work with us
      </h3>
      <div
        data-reveal
        className="mb-3 flex flex-col gap-6 rounded-xl border border-ink bg-ink p-6 text-paper md:flex-row md:items-center md:justify-between md:p-7"
      >
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#bdbbb2]">Free · Start with this</p>
          <h4 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em]">{AUDIT.title}</h4>
          <p className="mt-2 max-w-[44ch] text-pretty text-[15px] leading-relaxed text-[#d9d7cf]">{AUDIT.body}</p>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <span className="flex flex-wrap gap-1.5">
            {AUDIT.icons.map((icon) => (
              <span key={icon} className="grid size-8 place-items-center rounded-lg border border-white/15 bg-white/5 text-paper">
                <BrandIcon name={icon} className="size-4" />
              </span>
            ))}
          </span>
          <CtaLink variant="accent">Book a call</CtaLink>
        </div>
      </div>

      <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 md:grid-rows-[auto_auto_1fr_auto]">
        {OFFERS.map((o, n) => (
          <li
            key={o.title}
            data-reveal
            style={i(n)}
            className={`flex flex-col rounded-xl border bg-card p-6 transition-[border-color,box-shadow] duration-300 hover:shadow-[0_12px_32px_-20px_rgb(18_18_17/0.35)] md:row-span-4 md:grid md:grid-rows-subgrid md:gap-y-0 ${
              o.tag ? "border-ink" : "border-line hover:border-line-strong"
            }`}
          >
            <div className="flex h-8 items-center justify-between gap-3">
              <span className="font-mono text-xs text-muted">{String(n + 1).padStart(2, "0")}</span>
              {o.tag && (
                <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ink">{o.tag}</span>
              )}
              {o.icons && <Icons icons={o.icons} />}
            </div>
            <h4 className="mt-6 text-2xl font-semibold leading-tight tracking-[-0.03em]">{o.title}</h4>
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
              <CtaLink variant={o.tag ? "accent" : "primary"} className="mt-4 w-full">
                Book a call
              </CtaLink>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
