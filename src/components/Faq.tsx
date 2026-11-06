import { FAQ } from "@/lib/site";
import { Section, i } from "./ui";

export default function Faq() {
  return (
    <Section id="faq" index="08" label="FAQ" title="Questions, answered.">
      <div className="md:grid md:grid-cols-12 md:gap-8">
        <div className="faq border-t border-line md:col-span-9 md:col-start-4">
          {FAQ.map((item, n) => (
            <details key={item.q} data-reveal style={i(n)} className="group border-b border-line" name="faq">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-lg font-medium tracking-[-0.015em] transition-colors duration-200 hover:text-ink-2 md:py-6">
                <span className="text-pretty">{item.q}</span>
                <span aria-hidden="true" className="plus relative mt-1.5 size-3.5 shrink-0">
                  <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-current" />
                  <span className="absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 bg-current" />
                </span>
              </summary>
              <p className="max-w-[60ch] text-pretty pb-6 pr-10 text-[15px] leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
