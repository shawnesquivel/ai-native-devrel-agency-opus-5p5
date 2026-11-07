import Link from "next/link";
import { BRAND_NAME, NAV } from "@/lib/site";
import { Wordmark } from "./Brand";
import MobileMenu from "./MobileMenu";
import { AuditLink } from "./ui";

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md backdrop-saturate-150">
      <div className="frame flex h-16 items-center justify-between gap-4 px-4 sm:px-8 md:px-12">
        <Link href="/" aria-label={`${BRAND_NAME} home`} className="-m-2 rounded p-2 text-[15px]">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  data-cta={item.href.endsWith("#contact") ? "nav" : undefined}
                  className="rounded-md px-3 py-2 text-sm text-ink-2 transition-colors duration-200 hover:bg-ink/[0.05] hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <AuditLink location="nav" size="sm" />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
