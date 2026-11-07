import { BRAND_NAME, CMS } from "@/lib/site";
import BrandIcon, { ICON_LABELS } from "./BrandIcon";
import SlackThread from "./SlackThread";
import { Section, i } from "./ui";

function CmsRow({ copy }: { copy: number }) {
  return (
    <ul className="marquee-row flex shrink-0 gap-2.5 pr-2.5" aria-hidden={copy > 0 || undefined} aria-label={copy ? undefined : "CMS platforms"}>
      {CMS.map((c) => (
        <li key={c} className="flex h-14 items-center gap-2.5 whitespace-nowrap rounded-lg border border-line bg-paper px-5 text-[15px] text-ink">
          <BrandIcon name={c} className="size-[18px] shrink-0" />
          {ICON_LABELS[c]}
        </li>
      ))}
    </ul>
  );
}

export default function Stack() {
  return (
    <Section id="stack" title="Works with the tools you already use." intro="Plug us into your CMS and Slack, and content ships without new workflows.">
      <div className="grid gap-3">
        <article data-reveal className="grid gap-8 rounded-xl border border-line bg-card p-6 md:p-8 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Your CMS</p>
            <h3 className="mt-3 text-balance text-2xl font-semibold leading-tight tracking-[-0.03em] md:text-[1.75rem]">
              We publish straight into any CMS.
            </h3>
          </div>
          {/* Four copies of the row; the track slides by half its width (two copies), so the loop is seamless at any width. */}
          <div data-qa-ignore className="marquee min-w-0 lg:col-span-7">
            <div className="marquee-track flex w-max">
              {[0, 1, 2, 3].map((copy) => (
                <CmsRow key={copy} copy={copy} />
              ))}
            </div>
          </div>
        </article>

        <article data-reveal style={i(1)} className="grid gap-8 rounded-xl border border-line bg-card p-6 md:p-8 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-5">
            <div className="flex items-start justify-between gap-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Slack or MCP</p>
              <span className="flex gap-1.5">
                {(["slack", "mcp"] as const).map((icon) => (
                  <span key={icon} title={ICON_LABELS[icon]} className="grid size-8 place-items-center rounded-lg border border-line bg-paper text-ink">
                    <BrandIcon name={icon} className="size-4" />
                    <span className="sr-only">{ICON_LABELS[icon]}</span>
                  </span>
                ))}
              </span>
            </div>
            <h3 className="mt-3 text-balance text-2xl font-semibold leading-tight tracking-[-0.03em] md:text-[1.75rem]">
              Tag {BRAND_NAME} when inspiration strikes.
            </h3>
            <p className="mt-3 max-w-[44ch] text-pretty text-[15px] leading-relaxed text-muted">
              Your best content is happening in your Slack threads. Tag {BRAND_NAME} and it builds the first draft.
            </p>
          </div>
          <div className="min-w-0 lg:col-span-7">
            <SlackThread />
          </div>
        </article>
      </div>
    </Section>
  );
}
