import { SITE } from "@/lib/site";
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
          <h1
            id="hero-title"
            className="max-w-[15ch] text-balance text-[min(2.5rem,10vw)] font-semibold leading-[1] tracking-[-0.05em] sm:text-6xl md:text-7xl lg:text-[3.75rem] xl:text-[4.25rem]"
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

          <div className="hero-fade mt-10" style={i(2)}>
            <AuditLink location="hero" />
            <p className="mt-3 text-sm text-muted">Free audit within 48 hours.</p>
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
                    <BrandIcon name={icon} className="size-[18px]" color={p.label === "For agents"} />
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
