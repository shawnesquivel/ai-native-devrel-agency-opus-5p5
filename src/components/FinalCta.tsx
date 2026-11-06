import { Mark } from "./Brand";
import { HOOK_STAT } from "@/lib/site";
import { CtaLink, i } from "./ui";

export default function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="relative">
      <div className="frame cross bg-ink text-paper">
        <div className="flex flex-col gap-10 px-5 py-20 sm:px-8 md:flex-row md:items-end md:justify-between md:px-12 md:py-28">
          <div>
            <Mark className="size-8 text-paper" />
            <h2
              id="cta-title"
              data-reveal
              className="mt-8 max-w-[14ch] text-balance text-[2.5rem] font-semibold leading-none tracking-[-0.045em] sm:text-6xl md:text-7xl"
            >
              Make sure agents can find you.
            </h2>
            <p data-reveal style={i(1)} className="mt-5 max-w-[46ch] text-pretty text-lg leading-relaxed text-[#bdbbb2]">
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
          </div>
          <div data-reveal style={i(2)}>
            <CtaLink variant="accent">Book a call</CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}
