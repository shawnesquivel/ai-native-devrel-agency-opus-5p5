import Link from "next/link";
import CTAButton from "@/components/CTAButton";
import Logo from "@/components/Logo";

const LINKS = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "API", href: "/#api" },
  { label: "MCP", href: "/mcp" },
  { label: "Compare", href: "/#compare" },
  { label: "Work", href: "/work" },
  { label: "FAQ", href: "/#faq" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-fg">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden sm:block">
          <CTAButton />
        </div>
        <Link href="/work" className="text-sm text-muted hover:text-fg sm:hidden">
          Work
        </Link>
      </div>
    </header>
  );
}
