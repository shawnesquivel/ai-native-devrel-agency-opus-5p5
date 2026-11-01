import { Mark } from "./Brand";
import { THEME } from "@/lib/site";
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
            <p data-reveal style={i(1)} className="mt-4 text-lg text-[#bdbbb2]">
              {THEME}
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
