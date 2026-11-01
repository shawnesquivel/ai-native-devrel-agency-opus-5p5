import { CAL_URL, FAQ, OFFERS, PYRAMID, SITE, STEPS } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = `# ${SITE.name}

> ${SITE.eyebrow}. ${SITE.tagline} Full-stack developer relations for devtools startups, done for you.

${SITE.subline} We work with devtools startups only.

## Services

${PYRAMID.slice()
  .reverse()
  .map((l) => `- ${l.level}: ${l.title}. ${l.body}`)
  .join("\n")}
- Add-on: Events. Meetups and hackathons for your developer community.
- Included: AI visibility tracking, done for you and sent as a monthly report (mentions, citations, competitors, what we ship next).

## How it works

${STEPS.map((s, n) => `${n + 1}. ${s.title}: ${s.body}`).join("\n")}

## Ways to work with us

${OFFERS.map((o) => `- ${o.title}: ${o.items.join(", ")}. ${o.pricing}.`).join("\n")}

## FAQ

${FAQ.map((f) => `- ${f.q} ${f.a}`).join("\n")}

## Contact

- Book a call: ${CAL_URL}
- Email: ${SITE.email}
- Site: ${SITE.url}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
