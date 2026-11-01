import { STEPS } from "@/lib/site";
import Terminal from "./Terminal";
import { Section, i } from "./ui";

export default function HowItWorks() {
  return (
    <Section id="process" index="02" label="How it works" title="One real build. Every channel covered.">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <ol className="relative lg:col-span-6">
          <span aria-hidden="true" className="absolute bottom-3 left-[0.6875rem] top-3 w-px bg-line" />
          {STEPS.map((s, n) => (
            <li key={s.title} data-reveal style={i(n)} className="relative grid grid-cols-[1.5rem_1fr] gap-x-5 pb-10 last:pb-0">
              <span className="relative z-10 mt-0.5 grid size-6 place-items-center border border-line-strong bg-paper font-mono text-[11px] text-ink">
                {n + 1}
              </span>
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-2 max-w-[44ch] text-pretty text-[15px] leading-relaxed text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="lg:col-span-6 lg:pl-4">
          <div className="lg:sticky lg:top-28">
            <Terminal />
          </div>
        </div>
      </div>
    </Section>
  );
}
