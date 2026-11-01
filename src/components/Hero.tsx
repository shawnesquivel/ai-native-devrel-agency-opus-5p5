import { SITE } from "@/lib/site";
import { CtaLink, i } from "./ui";

const PILLARS = [
  { label: "For agents", body: "Docs and examples that AI assistants can read, run and cite." },
  { label: "For humans", body: "There's a human behind your brand: engineers on video, in posts and at events." },
];

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className="frame overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {[25, 50, 75].map((x, n) => (
            <span key={x} className="grid-v hidden md:block" style={{ left: `${x}%`, ...i(n) }} />
          ))}
        </div>

        <div className="relative px-5 pb-16 pt-16 sm:px-8 sm:pt-24 md:px-12 md:pb-24 md:pt-32">
          <p className="hero-fade inline-flex items-center gap-2.5 border border-line bg-card py-1.5 pl-2 pr-3 font-mono text-xs uppercase tracking-[0.12em] text-ink-2" style={i(0)}>
            <span className="size-2 bg-accent" aria-hidden="true" />
            {SITE.eyebrow}
          </p>

          <h1
            id="hero-title"
            className="mt-8 text-[min(2.625rem,10.6vw)] font-semibold leading-[0.98] tracking-[-0.05em] sm:text-7xl md:text-[5.5rem] lg:text-[6.25rem]"
          >
            <span className="hero-line">
              <span style={i(0)}>Make something</span>
            </span>
            <span className="hero-line">
              <span style={i(1)}>
                <span className="relative isolate inline-block">
                  agents
                  <span className="underline-draw" aria-hidden="true" />
                </span>{" "}
                want.
              </span>
            </span>
          </h1>

          <p className="hero-fade mt-8 max-w-[46ch] text-pretty text-lg leading-relaxed text-ink-2 md:text-xl" style={i(1)}>
            {SITE.subline}
          </p>

          <div className="hero-fade mt-10 flex flex-col gap-3 sm:flex-row sm:items-center" style={i(2)}>
            <CtaLink variant="primary">Book a call</CtaLink>
            <CtaLink variant="ghost">Get a free AI visibility audit</CtaLink>
          </div>
        </div>

        <div className="relative grid border-t border-line bg-paper md:grid-cols-2">
          {PILLARS.map((p, n) => (
            <div
              key={p.label}
              className={`hero-fade flex flex-col gap-2 px-5 py-6 sm:px-8 md:px-12 md:py-8 ${n ? "border-t border-line md:border-l md:border-t-0" : ""}`}
              style={i(n + 3)}
            >
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">{p.label}</p>
              <p className="max-w-[40ch] text-[15px] leading-relaxed text-ink">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
