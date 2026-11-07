"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { FUNNEL } from "@/lib/site";
import { trackEvent, trackOnce } from "@/lib/analytics";
import { Arrow } from "./ui";

type State = { status: "idle" | "sending" | "done" | "error"; error?: string };

/**
 * The audit form, the only form on the page: work email + website, posted to /api/lead.
 * The success message replaces the fields in the same box, so the layout doesn't move.
 */
export default function LeadForm({
  location = "final",
  dark = false,
  layout = "grid",
  submitLabel = FUNNEL.submit,
  bareLabels = false,
}: {
  location?: "final" | "preview";
  dark?: boolean;
  /** grid: two fields then the button; row: fields and button on one line from md; stack: one column. */
  layout?: "grid" | "row" | "stack";
  submitLabel?: string;
  /** Visually hide the labels and use them as placeholders. */
  bareLabels?: boolean;
}) {
  const ref = useRef<HTMLFormElement>(null);
  const id = useId();
  const [state, setState] = useState<State>({ status: "idle" });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        trackOnce(`form:${location}`, "cta_form_view", { location });
        io.disconnect();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [location]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.status === "sending") return;
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setState({ status: "sending" });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: location }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong. Try again or book a call.");
      trackEvent("cta_form_submit", { location, status: "success" });
      setState({ status: "done" });
    } catch (err) {
      trackEvent("cta_form_submit", { location, status: "fail" });
      setState({ status: "error", error: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  const field = dark
    ? "border-white/15 bg-white/5 text-paper placeholder:text-[#8f8d86] focus-visible:border-paper"
    : "border-line-strong bg-card text-ink placeholder:text-muted focus-visible:border-ink";
  const label = bareLabels ? "sr-only" : `text-[13px] font-medium ${dark ? "text-[#bdbbb2]" : "text-ink-2"}`;
  const grid = { grid: "sm:grid-cols-2", row: "md:grid-cols-[1fr_1fr_auto]", stack: "" }[layout];
  const actions = {
    grid: "flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between",
    row: "contents",
    stack: "flex flex-col gap-2",
  }[layout];
  const accent = dark || layout !== "grid";

  return (
    <form ref={ref} onSubmit={onSubmit} noValidate aria-label={FUNNEL.title} className="relative">
      <div className={`grid gap-3 ${grid} ${state.status === "done" ? "invisible" : ""}`} aria-hidden={state.status === "done"}>
        <label className="grid gap-1.5">
          <span className={label}>Work email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={bareLabels ? "Work email" : "you@company.com"}
            className={`h-11 rounded-lg border px-3 text-[15px] outline-none transition-colors ${field}`}
          />
        </label>
        <label className="grid gap-1.5">
          <span className={label}>Company website</span>
          <input
            name="website"
            type="text"
            inputMode="url"
            required
            autoComplete="url"
            placeholder={bareLabels ? "Company website" : "company.com"}
            className={`h-11 rounded-lg border px-3 text-[15px] outline-none transition-colors ${field}`}
          />
        </label>
        {/* Honeypot: hidden from people and screen readers, tempting to bots. */}
        <div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 size-0 overflow-hidden opacity-0">
          <label htmlFor={`${id}-company`}>Company URL</label>
          <input id={`${id}-company`} name="company_url" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <div className={actions}>
          <button
            type="submit"
            disabled={state.status === "sending"}
            className={`btn ${accent ? "btn-accent" : "btn-primary"} disabled:opacity-70 ${layout === "grid" ? "" : "h-11 w-full md:w-auto"} ${
              layout === "stack" ? "md:w-full" : ""
            } ${layout === "row" ? "self-end" : ""}`}
          >
            {state.status === "sending" ? "Sending…" : submitLabel}
            <Arrow />
          </button>
          <p role="status" aria-live="polite" className={`text-[13px] ${layout === "grid" ? "min-h-5" : "empty:hidden"} ${layout === "row" ? "md:col-span-3" : ""} ${dark ? "text-[#ffb59b]" : "text-[#b4361a]"}`}>
            {state.status === "error" ? state.error : ""}
          </p>
        </div>
      </div>

      {state.status === "done" && (
        <div role="status" className="absolute inset-0 flex items-center gap-3">
          <span className={`grid size-9 shrink-0 place-items-center rounded-full ${dark ? "bg-accent text-ink" : "bg-ink text-paper"}`}>
            <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
              <path d="M3.5 8.5 6.5 11.5 12.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <p className={`text-[15px] font-medium ${dark ? "text-paper" : "text-ink"}`}>{FUNNEL.success}</p>
        </div>
      )}
    </form>
  );
}
