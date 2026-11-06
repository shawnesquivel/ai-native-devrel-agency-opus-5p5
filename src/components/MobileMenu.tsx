"use client";

import { useEffect, useId, useState } from "react";
import { NAV } from "@/lib/site";
import { CtaLink, ShareLink } from "./ui";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="btn btn-ghost btn-sm w-9 px-0"
      >
        <svg viewBox="0 0 16 16" className="size-[18px]" aria-hidden="true">
          <path
            d={open ? "M3.5 3.5l9 9M12.5 3.5l-9 9" : "M2 4.5h12M2 8h12M2 11.5h12"}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div
        id={id}
        hidden={!open}
        className="absolute inset-x-0 top-16 border-b border-line bg-paper px-5 pb-6 pt-2 sm:px-8"
      >
        <ul className="divide-y divide-line">
          {NAV.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={() => setOpen(false)} className="block py-3.5 text-lg tracking-tight">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-4 grid gap-2" onClick={() => setOpen(false)}>
          <ShareLink className="w-full" />
          <CtaLink location="nav" variant="ghost" className="w-full">
            Ready now? Book a call
          </CtaLink>
        </div>
      </div>
    </div>
  );
}
