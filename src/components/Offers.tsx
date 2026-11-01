import { AUDIT, PACKAGES, SERVICES, THEME } from "@/lib/site";
import BrandIcon from "./BrandIcon";
import { CtaLink, Section, i } from "./ui";

function Items({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="space-y-2.5 text-[15px]">
      {items.map((item) => (
        <li key={item} className="flex gap-3 break-inside-avoid">
          <span aria-hidden="true" className={`mt-[0.6em] w-3 shrink-0 ${dark ? "h-0.5 bg-accent" : "h-px bg-ink"}`} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function Offers() {
  const { basic, whiteGlove, pricing } = PACKAGES;
  return (
    <Section id="services" index="04" label="Services" title={THEME}>
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
        Packages
      </h3>

      <div className="grid gap-3 lg:grid-cols-12">
        <article data-reveal style={i(0)} className="flex flex-col rounded-xl border border-line bg-card p-6 lg:col-span-3 md:p-7">
          <p className="w-fit rounded-full border border-ink px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em]">Free</p>
          <h4 className="mt-6 text-2xl font-semibold leading-tight tracking-[-0.03em]">{AUDIT.title}</h4>
          <p className="mt-3 text-pretty text-[15px] leading-relaxed text-muted">{AUDIT.body}</p>
          <span className="mt-6 flex flex-wrap gap-1.5">
            {AUDIT.icons.map((icon) => (
              <span key={icon} className="grid size-8 place-items-center rounded-lg border border-line bg-paper text-ink">
                <BrandIcon name={icon} className="size-4" />
              </span>
            ))}
          </span>
          <div className="mt-auto pt-8">
            <CtaLink variant="primary" className="w-full">
              Book a call
            </CtaLink>
          </div>
        </article>

        <article data-reveal style={i(1)} className="flex flex-col rounded-xl border border-line bg-card p-6 lg:col-span-4 md:p-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{basic.tag}</p>
          <h4 className="mt-6 text-2xl font-semibold leading-tight tracking-[-0.03em]">{basic.title}</h4>
          <div className="mt-6 border-t border-line pt-6">
            <Items items={basic.items} />
          </div>
          <div className="mt-auto pt-8">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-2">{pricing}</p>
            <CtaLink variant="primary" className="mt-4 w-full">
              Book a call
            </CtaLink>
          </div>
        </article>

        <article data-reveal style={i(2)} className="flex flex-col rounded-xl border border-ink bg-ink p-6 text-paper lg:col-span-5 md:p-7">
          <p className="w-fit rounded-full bg-accent px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ink">{whiteGlove.tag}</p>
          <h4 className="mt-6 text-2xl font-semibold leading-tight tracking-[-0.03em]">{whiteGlove.title}</h4>
          <div className="mt-6 border-t border-white/15 pt-6">
            <p className="mb-4 text-[15px] text-[#bdbbb2]">{whiteGlove.lead}</p>
            <div className="sm:columns-2 sm:gap-6">
              <Items items={whiteGlove.items} dark />
            </div>
          </div>
          <div className="mt-auto pt-8">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#bdbbb2]">{pricing}</p>
            <CtaLink variant="accent" className="mt-4 w-full">
              Book a call
            </CtaLink>
          </div>
        </article>
      </div>
    </Section>
  );
}
