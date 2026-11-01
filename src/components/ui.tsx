import type { CSSProperties, ReactNode } from "react";
import { CAL_URL } from "@/lib/site";

type Variant = "primary" | "accent" | "ghost";

export function CtaLink({
  children = "Book a call",
  variant = "primary",
  size,
  className = "",
  arrow = true,
}: {
  children?: ReactNode;
  variant?: Variant;
  size?: "sm";
  className?: string;
  arrow?: boolean;
}) {
  return (
    <a
      href={CAL_URL}
      target="_blank"
      rel="noopener"
      className={`btn btn-${variant} ${size === "sm" ? "btn-sm" : ""} ${className}`}
    >
      {children}
      {arrow && <Arrow />}
    </a>
  );
}

export function Arrow({ className = "arrow size-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" fill="none">
      <path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Section({
  id,
  index,
  label,
  title,
  intro,
  children,
  className = "",
  bodyClassName = "mt-14 md:mt-20",
}: {
  id?: string;
  index: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={`relative ${className}`}>
      <div className="frame cross">
        <div data-line className="absolute inset-x-0 top-0 h-px bg-line" aria-hidden="true" />
        <div className="px-5 py-20 sm:px-8 md:px-12 md:py-28">
          <header className="grid gap-6 md:grid-cols-12 md:gap-8">
            <p data-reveal className="font-mono text-xs uppercase tracking-[0.14em] text-muted md:col-span-3 md:pt-2.5">
              <span className="text-ink">{index}</span>
              <span className="mx-2 text-line-strong">/</span>
              {label}
            </p>
            <div className="md:col-span-9">
              <h2
                id={headingId}
                data-reveal
                style={i(1)}
                className="max-w-[22ch] text-balance text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[2.5rem] md:text-5xl"
              >
                {title}
              </h2>
              {intro && (
                <p
                  data-reveal
                  style={i(2)}
                  className="mt-5 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted"
                >
                  {intro}
                </p>
              )}
            </div>
          </header>
          <div className={bodyClassName}>{children}</div>
        </div>
      </div>
    </section>
  );
}

export function i(n: number) {
  return { "--i": n } as CSSProperties;
}
