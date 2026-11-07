import { AUDIT_CTA, FUNNEL } from "@/lib/site";
import LeadForm from "./LeadForm";
import { CtaLink, i } from "./ui";

/* Centred minimal card on the dark band: headline, one short description, the two fields, one button. */
export default function FinalCta() {
  return (
    <section id="contact" aria-labelledby="cta-title" className="relative">
      <div className="frame cross overflow-hidden bg-ink text-paper">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_55%,rgb(255_79_26/0.16),transparent_70%)]"
        />
        <div className="relative flex flex-col items-center px-5 py-14 text-center sm:px-8 md:py-28">
          <h2
            id="cta-title"
            data-reveal
            className="text-balance text-[2.25rem] font-semibold leading-none tracking-[-0.045em] sm:text-5xl md:text-6xl"
          >
            {FUNNEL.headline}
          </h2>
          {FUNNEL.description && (
            <p data-reveal style={i(1)} className="mt-4 max-w-[46ch] text-pretty text-base leading-relaxed text-[#bdbbb2] md:mt-5 md:text-lg">
              {FUNNEL.description}
            </p>
          )}
          <div
            data-reveal
            style={i(2)}
            className="mt-7 w-full max-w-[26rem] rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-left backdrop-blur-sm sm:p-5 md:mt-10"
          >
            <LeadForm dark layout="stack" bareLabels submitLabel={AUDIT_CTA} />
          </div>
          <CtaLink
            location="final"
            variant="quiet"
            size="sm"
            className="mt-3 text-[#bdbbb2] hover:text-paper hover:decoration-white/40 [#contact:has(form[data-done])_&]:invisible"
          >
            or book a call
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
