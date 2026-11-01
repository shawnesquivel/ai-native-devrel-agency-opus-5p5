import { BRAND_NAME, CMS } from "@/lib/site";
import { Mark } from "./Brand";
import BrandIcon, { ICON_LABELS } from "./BrandIcon";
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

          <div className="mt-8 rounded-lg border border-line bg-paper text-[14px]" aria-label="Example Slack thread">
            <p className="flex items-center gap-1.5 border-b border-line px-3 py-2 font-mono text-[11px] text-muted">
              <BrandIcon name="slack" className="size-3" /># [your-channel]
            </p>
            <div className="space-y-3 p-3">
              <div className="flex gap-2.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-md bg-line-strong font-mono text-[11px] text-ink">Y</span>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold">You</p>
                  <p className="leading-snug text-ink-2">
                    <span className="rounded bg-accent/25 px-1 font-medium text-ink">@{BRAND_NAME}</span> turn this launch into a thread + tutorial
                  </p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-md bg-ink text-paper">
                  <Mark className="size-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[13px] font-semibold">
                    {BRAND_NAME}
                    <span className="rounded border border-line px-1 font-mono text-[10px] font-normal text-muted">APP</span>
                  </p>
                  <p className="leading-snug text-ink-2">On it. Drafts land in your CMS for review.</p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </Section>
  );
}
