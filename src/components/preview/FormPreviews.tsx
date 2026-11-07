import { HOOK_STAT } from "@/lib/site";
import LeadForm from "../LeadForm";
import { CtaLink } from "../ui";

const CTA = "Get your AI visibility audit";
const HEADLINE = "Make sure agents can find you.";

function StatLine({ dark = true }: { dark?: boolean }) {
  return (
    <p className={`text-pretty text-base leading-relaxed md:text-lg ${dark ? "text-[#bdbbb2]" : "text-muted"}`}>
      ChatGPT has{" "}
      <a
        href={HOOK_STAT.href}
        target="_blank"
        rel="noopener"
        className={`underline underline-offset-4 transition-colors hover:decoration-accent ${
          dark ? "text-paper decoration-white/30" : "text-ink decoration-line-strong"
        }`}
      >
        1.2 billion weekly users
      </a>
      .
    </p>
  );
}

function BookLink({ dark = true, className = "" }: { dark?: boolean; className?: string }) {
  return (
    <CtaLink
      location="preview"
      variant="quiet"
      size="sm"
      className={`-ml-2 ${dark ? "text-[#bdbbb2] hover:text-paper hover:decoration-white/40" : ""} ${className}`}
    >
      or book a call
    </CtaLink>
  );
}

/* 1: big headline, then email + website + button on one line. */
export function FormInline() {
  return (
    <section id="contact" aria-labelledby="cta-title" className="relative">
      <div className="frame cross bg-ink text-paper">
        <div className="px-5 py-14 sm:px-8 md:px-12 md:py-32">
          <h2
            id="cta-title"
            className="max-w-[14ch] text-balance text-[2.75rem] font-semibold leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-[6rem]"
          >
            {HEADLINE}
          </h2>
          <div className="mt-6 max-w-[40ch] md:mt-8">
            <StatLine />
          </div>
          <div className="mt-8 md:mt-12">
            <LeadForm dark layout="row" bareLabels submitLabel={CTA} location="preview" />
          </div>
          <BookLink />
        </div>
      </div>
    </section>
  );
}

/* 2: headline left, compact form card right, on paper. */
export function FormSplit() {
  return (
    <section id="contact" aria-labelledby="cta-title" className="relative">
      <div className="frame cross lg:flex lg:min-h-[calc(100svh-4rem)] lg:items-center">
        <div data-line className="absolute inset-x-0 top-0 h-px bg-line" aria-hidden="true" />
        <div className="grid w-full gap-8 px-5 py-14 sm:px-8 md:px-12 md:py-28 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-6">
            <h2
              id="cta-title"
              className="text-balance text-[2.5rem] font-semibold leading-none tracking-[-0.045em] sm:text-6xl lg:text-[4rem]"
            >
              {HEADLINE}
            </h2>
            <div className="mt-5 max-w-[36ch]">
              <StatLine dark={false} />
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="rounded-xl bg-ink p-5 text-paper shadow-[0_24px_60px_-32px_rgb(18_18_17/0.6)] sm:p-6">
              <LeadForm dark layout="stack" bareLabels submitLabel={CTA} location="preview" />
            </div>
            <BookLink dark={false} className="mt-2" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* 3: centred minimal card on the dark band: fields and button only. */
export function FormCard() {
  return (
    <section id="contact" aria-labelledby="cta-title" className="relative">
      <div className="frame cross overflow-hidden bg-ink text-paper">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgb(255_79_26/0.16),transparent_70%)]"
        />
        <div className="relative flex flex-col items-center px-5 py-16 text-center sm:px-8 md:py-32">
          <h2 id="cta-title" className="text-balance text-[2.25rem] font-semibold leading-none tracking-[-0.045em] sm:text-5xl md:text-6xl">
            {HEADLINE}
          </h2>
          <div className="mt-8 w-full max-w-[26rem] rounded-2xl border border-white/15 bg-white/[0.05] p-4 text-left backdrop-blur-sm sm:p-5 md:mt-12">
            <LeadForm dark layout="stack" bareLabels submitLabel={CTA} location="preview" />
          </div>
          <BookLink className="ml-0 mt-3" />
        </div>
      </div>
    </section>
  );
}
