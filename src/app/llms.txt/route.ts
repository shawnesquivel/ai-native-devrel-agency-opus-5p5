import { AUDIT, CAL_URL, CMS, FAQ, FUNNEL, PACKAGES, SERVICES, SITE, STEPS, THEME } from "@/lib/site";
import { ICON_LABELS } from "@/components/BrandIcon";

export const dynamic = "force-static";

export function GET() {
  const body = `# ${SITE.name}

> ${SITE.eyebrow}. ${SITE.tagline}

${SITE.subline}

## Services

${THEME}

${SERVICES.map((s) => `- ${s.label}`).join("\n")}

## How it works

${STEPS.map((s, n) => `${n + 1}. ${s.title}: ${s.body}`).join("\n")}

## Ways to work with us

- ${AUDIT.title} (${AUDIT.tag.toLowerCase()}): ${AUDIT.body}
- ${PACKAGES.launch.title} (${PACKAGES.launch.badge.toLowerCase()}): ${PACKAGES.launch.outcome} ${PACKAGES.launch.items.join(", ")}. ${PACKAGES.pricing}.
- ${PACKAGES.scale.title} (${PACKAGES.scale.tag.toLowerCase()}): ${PACKAGES.scale.note} ${PACKAGES.scale.lead} ${PACKAGES.scale.items.join(", ")}. ${PACKAGES.pricing}.

## Get started

${FUNNEL.steps.map((step, n) => `${n + 1}. ${step}`).join("\n")}

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
