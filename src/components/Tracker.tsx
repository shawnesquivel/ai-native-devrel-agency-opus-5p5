"use client";

import { useEffect } from "react";
import { trackEvent, trackOnce } from "@/lib/analytics";

/* Section ids on the page, mapped to the names used in analytics. */
const SECTIONS: Record<string, string> = {
  hero: "hero",
  problem: "problem",
  process: "how-it-works",
  services: "packages",
  work: "work",
  faq: "faq",
};

export default function Tracker() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const section = SECTIONS[entry.target.id];
          if (section) trackOnce(`section:${section}`, "section_view", { section });
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "-35% 0px -35% 0px" },
    );
    Object.keys(SECTIONS).forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest<HTMLElement>("[data-book-call]");
      if (link) trackEvent("book_call_click", { location: link.dataset.bookCall ?? "unknown" });
    };
    document.addEventListener("click", onClick);

    return () => {
      io.disconnect();
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
