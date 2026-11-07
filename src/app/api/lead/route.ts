import { BRAND_NAME } from "@/lib/site";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

/* Best-effort per-instance rate limit. Serverless instances don't share memory, so this only stops bursts. */
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function normalizeSite(raw: string) {
  const value = raw.trim();
  if (!value || value.length > 300) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

const escape = (v: string) => v.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never see this field, so a value means a bot. Pretend it worked.
  if (typeof body.company_url === "string" && body.company_url.trim()) return Response.json({ ok: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (limited(ip)) {
    return Response.json({ ok: false, error: "Too many requests. Try again in a few minutes." }, { status: 429 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const website = normalizeSite(typeof body.website === "string" ? body.website : "");
  const source = typeof body.source === "string" ? body.source.slice(0, 40) : "unknown";
  if (!EMAIL.test(email) || email.length > 200) {
    return Response.json({ ok: false, error: "Enter a valid work email." }, { status: 400 });
  }
  if (!website) {
    return Response.json({ ok: false, error: "Enter your startup's website." }, { status: 400 });
  }

  const lead = { email, website, source, at: new Date().toISOString() };
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[lead] RESEND_API_KEY not set; lead not emailed", lead);
    return Response.json({ ok: true });
  }

  const to = (process.env.LEAD_NOTIFY_TO || "shawnesquivel24@gmail.com")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  const from = process.env.RESEND_FROM || `${BRAND_NAME} <audit@agentwin.dev>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject: `New ${BRAND_NAME} lead: ${new URL(website).hostname}`,
      text: `Work email: ${email}\nWebsite: ${website}\nForm: ${source}\nAt: ${lead.at}`,
      html: `<p><strong>Work email:</strong> ${escape(email)}<br><strong>Website:</strong> <a href="${escape(website)}">${escape(website)}</a><br><strong>Form:</strong> ${escape(source)}<br><strong>At:</strong> ${lead.at}</p>`,
    }),
  }).catch((error: unknown) => {
    console.error("[lead] Resend request failed", error, lead);
    return null;
  });

  if (!res?.ok) {
    console.error("[lead] Resend rejected the email", res?.status, await res?.text().catch(() => ""), lead);
    return Response.json({ ok: false, error: "Something went wrong. Email us or book a call instead." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
