import Link from "next/link";
import { BRAND_NAME, NAV, SITE } from "@/lib/site";
import { Wordmark } from "./Brand";

const LINKS = [...NAV, { label: "Blog", href: "/blog" }, { label: "llms.txt", href: "/llms.txt" }];

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="frame px-5 py-12 sm:px-8 md:px-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/" aria-label="Home" className="text-[15px]">
              <Wordmark />
            </Link>
            <p className="mt-4 max-w-[30ch] text-sm leading-relaxed text-muted">{SITE.eyebrow}. Devtools only.</p>
          </div>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm sm:grid-cols-3">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-ink-2 transition-colors hover:text-ink">
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${SITE.email}`} className="text-ink-2 transition-colors hover:text-ink">
                  Email
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <p className="mt-12 border-t border-line pt-6 font-mono text-xs text-muted">
          © {new Date().getFullYear()} {BRAND_NAME}
        </p>
      </div>
    </footer>
  );
}
