import { PROBLEMS } from "@/lib/site";
import { Section, i } from "./ui";

export default function Problem() {
  return (
    <Section id="problem" index="01" label="Problem" title="Developers ask AI before they ask you.">
      <ul className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
        {PROBLEMS.map((p, n) => (
          <li
            key={p.title}
            data-reveal
            style={i(n)}
            className="group relative flex flex-col gap-12 border-b border-r border-line bg-card p-6 transition-colors duration-300 hover:bg-white md:p-7"
          >
            <span className="font-mono text-xs text-muted">{String(n + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="text-balance text-xl font-semibold leading-snug tracking-[-0.02em]">{p.title}</h3>
              <p className="mt-3 text-pretty text-[15px] leading-relaxed text-muted">{p.body}</p>
            </div>
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-x-100"
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
