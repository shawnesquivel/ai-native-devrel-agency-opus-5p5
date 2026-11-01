import { PYRAMID } from "@/lib/site";
import { Section, i } from "./ui";

const WIDTHS = ["w-[74%] sm:w-[62%]", "w-[87%] sm:w-[81%]", "w-full"];

export default function Services() {
  return (
    <Section
      id="services"
      index="03"
      label="Services"
      title="Built for agents first. Driven by humans."
    >
      <div className="grid gap-8 lg:grid-cols-12">
        <div data-observe className="flex flex-col items-center gap-2 lg:col-span-8">
          {PYRAMID.map((layer, n) => (
            <div
              key={layer.title}
              style={i(PYRAMID.length - 1 - n)}
              className={`layer ${WIDTHS[n]} rounded-lg border p-5 text-center sm:p-6 ${
                layer.core ? "border-ink bg-accent text-ink" : "border-line bg-card"
              } ${layer.core ? "py-8 sm:py-10" : ""}`}
            >
              <p className={`font-mono text-[11px] uppercase tracking-[0.14em] ${layer.core ? "text-ink" : "text-muted"}`}>
                {layer.level}
              </p>
              <h3
                className={`mt-2 text-balance font-semibold tracking-[-0.02em] ${
                  layer.core ? "text-2xl sm:text-[1.75rem]" : "text-lg sm:text-xl"
                }`}
              >
                {layer.title}
              </h3>
              <p className={`mx-auto mt-1.5 max-w-[40ch] text-pretty text-sm leading-relaxed ${layer.core ? "text-ink" : "text-muted"}`}>
                {layer.body}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:content-end">
          <div data-reveal style={i(2)} className="rounded-lg border border-ink bg-ink p-6 text-paper">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#bdbbb2]">Every layer</p>
              <span className="rounded-full bg-accent px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-ink">
                Included
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em]">AI visibility tracking</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#d9d7cf]">Done for you. A report lands in your inbox every month.</p>
          </div>
          <div data-reveal style={i(3)} className="rounded-lg border border-dashed border-line-strong p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Add-on</p>
            <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em]">Events</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">Meetups and hackathons for your developer community.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
