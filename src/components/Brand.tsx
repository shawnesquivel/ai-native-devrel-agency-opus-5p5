import { BRAND_NAME } from "@/lib/site";

/**
 * The mark is the services pyramid: base (docs for agents), core (videos + blogs, in accent),
 * top (founder-led content). It reads at 16px and doesn't depend on the name.
 */
export function Mark({ className = "size-5", accent = "var(--color-accent)" }: { className?: string; accent?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <rect x="7" y="3" width="10" height="5" rx="1" fill="currentColor" />
      <rect x="3.5" y="9.5" width="17" height="5" rx="1" fill={accent} />
      <rect x="0" y="16" width="24" height="5" rx="1" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark className="size-[1.15em] shrink-0" />
      <span className="text-[1em] font-semibold leading-none tracking-[-0.03em]">{BRAND_NAME}</span>
    </span>
  );
}
