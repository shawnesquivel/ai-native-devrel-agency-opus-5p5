import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { LogoId } from "@/lib/site";
import { LOGOS } from "@/lib/site";
import { i } from "./ui";

const img = "h-auto select-none brightness-0";

const ART: Record<LogoId, ReactNode> = {
  composio: <Image src="/logos/composio.svg" alt="" width={135} height={26} unoptimized className={img} />,
  litellm: <Image src="/logos/litellm.png" alt="" width={132} height={25} unoptimized className={img} />,
  treg: (
    <span className="flex items-center gap-2">
      <Image src="/logos/treg-mark.svg" alt="" width={24} height={24} unoptimized className={img} />
      <span className="font-mono text-[22px] font-bold leading-none tracking-[-0.04em] text-black">treg</span>
    </span>
  ),
  rentahuman: (
    <span className="flex items-center gap-2">
      <Image src="/logos/rentahuman.svg" alt="" width={24} height={24} unoptimized className={img} />
      <span className="text-[19px] font-semibold leading-none tracking-[-0.02em] text-black">RentAHuman</span>
    </span>
  ),
  cursor: <Image src="/logos/cursor.svg" alt="" width={110} height={26} unoptimized className={img} />,
  codex: (
    <span className="flex items-center gap-2">
      <Image src="/logos/codex-mark.svg" alt="" width={24} height={24} unoptimized className={img} />
      <Image src="/logos/codex-wordmark.svg" alt="" width={88} height={22} unoptimized className={img} />
    </span>
  ),
  grokbot: (
    <span className="flex items-center gap-2">
      <Image src="/logos/grokbot-mark.svg" alt="" width={24} height={24} unoptimized className={img} />
      <span className="text-[19px] font-semibold leading-none tracking-[-0.02em] text-black">Grok Bot</span>
    </span>
  ),
  chat2db: <Image src="/logos/chat2db.svg" alt="" width={137} height={24} unoptimized className={img} />,
};

export default function Logos() {
  const shown = LOGOS.filter((l) => l.show);
  return (
    <ul
      className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-3 lg:grid-cols-[repeat(var(--n),minmax(0,1fr))]"
      style={{ "--n": shown.length } as CSSProperties}
    >
      {shown.map((logo, n) => (
        <li
          key={logo.id}
          data-reveal
          style={i(n)}
          className={`flex h-24 items-center justify-center border-b border-r border-line px-4 ${
            n === shown.length - 1 && shown.length % 2 === 1 ? "col-span-2 sm:col-span-1" : ""
          }`}
        >
          <span
            role="img"
            aria-label={logo.name}
            className="flex origin-center scale-[0.85] items-center opacity-70 transition-opacity duration-300 hover:opacity-100 sm:scale-100"
          >
            {ART[logo.id]}
          </span>
        </li>
      ))}
    </ul>
  );
}
