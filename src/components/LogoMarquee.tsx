import Image from "next/image";

function CursorLogo() {
  return <Image src="/logos/cursor.svg" alt="Cursor" width={101} height={24} className="h-6 w-auto" />;
}

function CodexLogo() {
  return (
    <span className="flex items-center gap-2.5">
      <Image src="/logos/codex.svg" alt="" width={28} height={28} className="size-7" />
      <span className="text-2xl font-semibold tracking-tight text-white">Codex</span>
    </span>
  );
}

function ComposioLogo() {
  return <Image src="/logos/composio.svg" alt="Composio" width={135} height={26} className="h-[26px] w-auto" />;
}

function ClaudeCodeLogo() {
  return (
    <span className="flex items-center gap-2.5">
      <Image src="/logos/claude.svg" alt="" width={28} height={28} className="size-7" />
      <span className="text-2xl font-semibold tracking-tight text-white">Claude Code</span>
    </span>
  );
}

const LOGOS = [
  { name: "Cursor", Logo: CursorLogo },
  { name: "Codex", Logo: CodexLogo },
  { name: "Composio", Logo: ComposioLogo },
  { name: "Claude Code", Logo: ClaudeCodeLogo },
];

// Repeated so a single half of the track is always wider than the viewport, keeping the -50% loop seamless.
const TRACK = [...LOGOS, ...LOGOS, ...LOGOS];

export default function LogoMarquee() {
  return (
    <section className="border-y border-line py-10">
      <p className="mb-8 text-center font-mono text-xs uppercase tracking-[0.2em] text-subtle">
        Content &amp; launches for teams at
      </p>
      <div className="group mask-fade-x relative flex overflow-hidden">
        <ul className="animate-marquee flex w-max shrink-0 items-center">
          {[...TRACK, ...TRACK].map(({ name, Logo }, i) => (
            <li
              key={`${name}-${i}`}
              aria-hidden={i >= TRACK.length}
              className="flex h-12 items-center px-10 opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 md:px-14"
              title={name}
            >
              <Logo />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
