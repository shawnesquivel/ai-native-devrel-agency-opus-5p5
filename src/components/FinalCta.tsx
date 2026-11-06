import { BRAND_NAME, FUNNEL, HOOK_STAT } from "@/lib/site";
import { Mark } from "./Brand";
import LeadForm from "./LeadForm";
import { CtaLink, i } from "./ui";

export default function FinalCta() {
  return (
    <section id="contact" aria-labelledby="cta-title" className="relative">
      <div className="frame cross bg-ink text-paper">
        <div className="grid gap-6 px-5 py-8 sm:px-8 md:gap-12 md:px-12 md:py-28 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Mark className="hidden size-8 text-paper md:block" />
            <h2
              id="cta-title"
              data-reveal
              className="text-balance text-[2.25rem] font-semibold leading-none tracking-[-0.045em] sm:text-6xl md:mt-8 lg:text-[3.5rem]"
            >
              Make sure agents can find you.
            </h2>
            <p data-reveal style={i(1)} className="mt-4 max-w-[46ch] text-pretty text-base leading-relaxed text-[#bdbbb2] md:mt-5 md:text-lg">
              ChatGPT has{" "}
              <a
                href={HOOK_STAT.href}
                target="_blank"
                rel="noopener"
                className="text-paper underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-accent"
              >
                1.2 billion weekly users
              </a>
              . Win your competitors&apos; customers back with AEO-optimized content.
            </p>
            <p data-reveal style={i(2)} className="mt-3 max-w-[46ch] text-pretty text-base leading-relaxed text-[#bdbbb2] md:mt-4 md:text-lg">
              Agents now pick the tools their users install. <span className="text-paper">{BRAND_NAME}</span> helps you win them.
            </p>
            <ol className="mt-10 hidden space-y-4 md:block">
              {FUNNEL.steps.map((step, n) => (
                <li key={step} data-reveal style={i(n + 2)} className="flex items-start gap-3.5">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full border border-white/20 font-mono text-[12px] text-paper">
                    {n + 1}
                  </span>
                  <span className="pt-0.5 text-[16px] leading-snug text-paper">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="lg:col-span-7 lg:pt-16">
            <div data-reveal style={i(2)} className="rounded-xl border border-white/15 bg-white/[0.04] p-5 sm:p-7">
              <h3 id="audit-title" className="text-xl font-semibold tracking-[-0.025em] sm:text-[1.75rem]">
                {FUNNEL.title}
              </h3>
              <p className="mt-2 text-pretty text-[15px] leading-relaxed text-[#bdbbb2]">{FUNNEL.subline}</p>
              <div className="mt-5 md:mt-6">
                <LeadForm dark />
              </div>
            </div>
            <div data-reveal style={i(3)} className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 md:mt-5">
              <span className="text-[15px] text-[#bdbbb2]">Ready now?</span>
              <CtaLink location="final" variant="accent">
                Book a call
              </CtaLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
