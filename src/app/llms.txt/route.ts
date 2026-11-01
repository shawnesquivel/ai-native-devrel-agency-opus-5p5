import { AUDIT, CAL_URL, FAQ, OFFERS, POINTS, SERVICES, SITE, STEPS, THEME } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = `# ${SITE.name}

> ${SITE.eyebrow}. ${SITE.tagline}

${SITE.subline}

${POINTS.map((p) => `- ${p.label}: ${p.body}`).join("\n")}

## Services

${THEME}

${SERVICES.map((s) => `- ${s.label}`).join("\n")}

## How it works

${STEPS.map((s, n) => `${n + 1}. ${s.title}: ${s.body}`).join("\n")}

## Ways to work with us

- ${AUDIT.title}: ${AUDIT.body} Free.
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
