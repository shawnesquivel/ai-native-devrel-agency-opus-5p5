import { CAL_URL, SITE } from "@/lib/site";
import BrandIcon, { ICON_LABELS, type IconName } from "./BrandIcon";
import ChatDemo from "./ChatDemo";
import { AuditLink, i } from "./ui";

const PILLARS: { label: string; body: string; icons: IconName[] }[] = [
  { label: "For agents", body: "Docs they can read and cite.", icons: ["chatgpt", "claude", "gemini", "grokbot", "hermes", "cursor", "codex"] },
  { label: "For humans", body: "Engineers on video and in posts.", icons: ["youtube", "x", "linkedin", "reddit", "article"] },
];

export default function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="relative">
      <div className="frame overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {[25, 50, 75].map((x, n) => (
            <span key={x} className="grid-v hidden md:block" style={{ left: `${x}%`, ...i(n) }} />
          ))}
        </div>

        <div className="relative grid grid-cols-[minmax(0,1fr)] gap-12 px-5 pb-16 pt-16 sm:px-8 sm:pt-24 md:px-12 md:pb-24 md:pt-28 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="min-w-0 lg:col-span-7">
          <p className="hero-fade inline-flex items-center gap-2.5 border border-line bg-card py-1.5 pl-2 pr-3 font-mono text-xs uppercase tracking-[0.12em] text-ink-2" style={i(0)}>
            <span className="size-2 bg-accent" aria-hidden="true" />
            {SITE.eyebrow}
          </p>

          <h1
            id="hero-title"
            className="mt-8 max-w-[15ch] text-balance text-[min(2.5rem,10vw)] font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl md:text-7xl lg:text-[3.75rem] xl:text-[4.25rem]"
          >
            <span className="hero-line">
              <span style={i(0)}>
                You built something{" "}
                <span className="relative isolate inline-block">
                  agents
                  <span className="underline-draw" aria-hidden="true" />
                </span>{" "}
                want.
              </span>
            </span>
            <span className="hero-line">
              <span style={i(1)} className="text-muted">
                We make sure agents can find you.
              </span>
            </span>
          </h1>

          <p className="hero-fade mt-8 max-w-[46ch] text-pretty text-lg leading-relaxed text-ink-2 md:text-xl" style={i(1)}>
            {SITE.subline}
          </p>

          <div className="hero-fade mt-10 flex flex-wrap items-center gap-x-5 gap-y-4" style={i(2)}>
            <AuditLink location="hero" />
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener"
              data-book-call="hero"
              className="text-[15px] text-muted underline decoration-line-strong underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
            >
              or book a call
            </a>
          </div>
          </div>

          <div className="hero-fade min-w-0 lg:col-span-5" style={i(3)}>
            <ChatDemo />
          </div>
        </div>

        <div className="relative grid border-t border-line bg-paper md:grid-cols-2">
          {PILLARS.map((p, n) => (
            <div
              key={p.label}
              className={`hero-fade flex flex-col gap-4 px-5 py-6 sm:px-8 md:px-12 md:py-8 ${n ? "border-t border-line md:border-l md:border-t-0" : ""}`}
              style={i(n + 3)}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">{p.label}</p>
                <p className="text-[15px] text-ink">{p.body}</p>
              </div>
              <ul className="flex flex-wrap gap-1.5 sm:gap-2">
                {p.icons.map((icon, k) => (
                  <li
                    key={icon}
                    title={ICON_LABELS[icon]}
                    className="hero-fade grid size-9 place-items-center rounded-lg border border-line bg-card text-ink sm:size-10"
                    style={i(n * 3 + k + 4)}
                  >
                    <BrandIcon name={icon} className="size-[18px]" />
                    <span className="sr-only">{ICON_LABELS[icon]}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
