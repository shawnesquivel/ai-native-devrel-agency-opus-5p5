import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { AUDIT_CTA, CAL_URL } from "@/lib/site";

type Variant = "primary" | "accent" | "ghost" | "quiet";

/** "Book a call" link to Cal. `location` is sent with the book_call_click event. */
export function CtaLink({
  children = "Book a call",
  variant = "primary",
  size,
  className = "",
  arrow = true,
  location,
}: {
  children?: ReactNode;
  variant?: Variant;
  size?: "sm";
  className?: string;
  arrow?: boolean;
  location: "nav" | "hero" | "final" | "packages" | "blog" | "preview";
}) {
  return (
    <a
      href={CAL_URL}
      target="_blank"
      rel="noopener"
      data-book-call={location}
      className={`btn btn-${variant} ${size === "sm" ? "btn-sm" : ""} ${className}`}
    >
      {children}
      {arrow && <Arrow />}
    </a>
  );
}

/** Primary CTA: goes to the audit form in #contact (from any page). `location` is sent with the cta_click event. */
export function AuditLink({
  children = AUDIT_CTA,
  variant = "accent",
  size,
  className = "",
  location,
}: {
  children?: ReactNode;
  variant?: Variant;
  size?: "sm";
  className?: string;
  location: "nav" | "hero" | "packages" | "blog";
}) {
  return (
    <Link href="/#contact" data-cta={location} className={`btn btn-${variant} ${size === "sm" ? "btn-sm" : ""} ${className}`}>
      {children}
      <Arrow />
    </Link>
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
  title,
  intro,
  children,
  className = "",
  bodyClassName = "mt-14 md:mt-20",
  split = false,
}: {
  id?: string;
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** From lg up: heading in a sticky left column, body beside it. */
  split?: boolean;
}) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={`relative ${className}`}>
      <div className="frame cross">
        <div data-line className="absolute inset-x-0 top-0 h-px bg-line" aria-hidden="true" />
        <div className={`px-5 py-20 sm:px-8 md:px-12 md:py-28 ${split ? "lg:grid lg:grid-cols-12 lg:gap-12" : ""}`}>
          <header className={split ? "lg:sticky lg:top-28 lg:col-span-4 lg:self-start" : ""}>
            <h2
              id={headingId}
              data-reveal
              className="text-balance text-[2rem] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[2.5rem] md:text-pretty md:text-5xl"
            >
              {title}
            </h2>
            {intro && (
              <p data-reveal style={i(1)} className="mt-5 max-w-[60ch] text-pretty text-lg leading-relaxed text-muted">
                {intro}
              </p>
            )}
          </header>
          <div className={split ? `${bodyClassName} lg:col-span-8 lg:mt-0` : bodyClassName}>{children}</div>
        </div>
      </div>
    </section>
  );
}

export function i(n: number) {
  return { "--i": n } as CSSProperties;
}
