import type { Metadata } from "next";
import { AuditLink } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description: `Notes from ${SITE.name} on DevRel for AI agents and the developers behind them.`,
  alternates: { canonical: "/blog" },
};

export default function Blog() {
  return (
    <section aria-labelledby="blog-title">
      <div className="frame cross min-h-[60vh] px-5 py-20 sm:px-8 md:px-12 md:py-28">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">Blog</p>
        <h1 id="blog-title" className="mt-6 text-5xl font-semibold tracking-[-0.045em] md:text-7xl">
          First posts soon.
        </h1>
        <div className="mt-10">
          <AuditLink location="blog" />
        </div>
      </div>
    </section>
  );
}
