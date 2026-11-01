import { AUDIT, CAL_URL, CMS, ENGINE, FAQ, PACKAGES, SERVICES, SITE, STEPS, THEME } from "@/lib/site";
import { ICON_LABELS } from "@/components/BrandIcon";

export const dynamic = "force-static";

export function GET() {
  const body = `# ${SITE.name}

> ${SITE.eyebrow}. ${SITE.tagline}

${SITE.subline}

${ENGINE}

## Services

${THEME}

${SERVICES.map((s) => `- ${s.label}`).join("\n")}

## How it works

${STEPS.map((s, n) => `${n + 1}. ${s.title}: ${s.body}`).join("\n")}

## Ways to work with us

- ${AUDIT.title}: ${AUDIT.body} Free.
- ${PACKAGES.basic.title} (${PACKAGES.basic.tag.toLowerCase()}): ${PACKAGES.basic.items.join(", ")}. ${PACKAGES.pricing}.
- ${PACKAGES.whiteGlove.title} (${PACKAGES.whiteGlove.tag.toLowerCase()}): ${PACKAGES.whiteGlove.lead} ${PACKAGES.whiteGlove.items.join(", ")}. ${PACKAGES.pricing}.

## Works with your stack

- We publish straight into your blog CMS: ${CMS.map((c) => ICON_LABELS[c]).join(", ")}.
- Tag ${SITE.name} in your Slack channel or through MCP to request content.

## FAQ

${FAQ.map((f) => `- ${f.q} ${f.a}`).join("\n")}

## Contact

- Book a call: ${CAL_URL}
- Email: ${SITE.email}
- Site: ${SITE.url}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
