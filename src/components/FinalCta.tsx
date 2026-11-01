import { Mark } from "./Brand";
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
              Make sure agents can find it.
            </h2>
          </div>
          <div data-reveal style={i(1)}>
            <CtaLink variant="accent">Book a call</CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}
