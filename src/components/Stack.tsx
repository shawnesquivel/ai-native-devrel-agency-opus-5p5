import { BRAND_NAME, CMS } from "@/lib/site";
import BrandIcon, { ICON_LABELS } from "./BrandIcon";
import SlackThread from "./SlackThread";
import { Section, i } from "./ui";

export default function Stack() {
  return (
    <Section id="stack" index="03" label="Your stack" title="Works with the tools you already use.">
      <div className="grid gap-3 md:grid-cols-2">
        <article data-reveal className="flex flex-col rounded-xl border border-line bg-card p-6 md:p-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Your CMS</p>
          <h3 className="mt-3 text-balance text-2xl font-semibold leading-tight tracking-[-0.03em]">
            We publish straight into the blog you already run.
          </h3>
          <ul className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CMS.map((c, n) => (
              <li key={c} data-reveal style={i(n)} className="flex items-center gap-2.5 rounded-lg border border-line bg-paper px-3 py-3 text-[14px]">
                <BrandIcon name={c} className="size-4 shrink-0" />
                {ICON_LABELS[c]}
              </li>
            ))}
          </ul>
        </article>

        <article data-reveal style={i(1)} className="flex flex-col rounded-xl border border-line bg-card p-6 md:p-7">
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
          <h3 className="mt-3 text-balance text-2xl font-semibold leading-tight tracking-[-0.03em]">
            Tag {BRAND_NAME} when inspiration strikes.
          </h3>
          <p className="mt-3 text-pretty text-[15px] leading-relaxed text-muted">
            Your best content is happening in your Slack threads. Tag {BRAND_NAME} and it builds the first draft.
          </p>

          <div className="mt-8">
            <SlackThread />
          </div>
        </article>
      </div>
    </Section>
  );
}
