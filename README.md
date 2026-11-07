# AgentWin

Landing page for AgentWin, a full-stack DevRel studio. Next.js 16 (App Router), React 19, Tailwind CSS v4, Geist + Geist Mono.

- The studio name (currently "AgentWin") lives in `BRAND_NAME` in `src/lib/site.ts`. It drives the wordmark, the agent's name, metadata, the OG image and `/llms.txt`.
- All copy, logos (toggle with `show`), stats, case cards, quotes and FAQ are in `src/lib/site.ts`.
- Routes: `/`, `/blog`, `/llms.txt`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, `POST /api/lead`.
- Logo sources: `public/logos/` (Composio, Cursor, Codex, Chat2DB, Treg and Grok Bot from the brand kit; RentAHuman from rentahuman.ai; LiteLLM rasterized from the official lockup on litellm.ai, and its monogram from `litellm/proxy/logo_monogram.png` in BerriAI/litellm; Hermes Agent from NousResearch/hermes-agent). Inline marks come from Simple Icons.

```bash
npm install
npm run dev
```

## Lead form

The audit form in the final `#contact` section (the only form on the page) posts to `/api/lead`. The route validates the email and website, drops submissions that fill the hidden honeypot field, rate-limits each IP (5 per 10 minutes, per server instance), and emails the founders through [Resend](https://resend.com).

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | No | none | Resend API key. Without it, leads are logged server-side and the visitor still sees the success message. |
| `LEAD_NOTIFY_TO` | No | `shawnesquivel24@gmail.com` | Who gets lead emails. Comma-separated, e.g. `shawn@…,misbah@…`. |
| `RESEND_FROM` | No | `AgentWin <audit@agentwin.dev>` | Sender. Must be on a domain verified in Resend (agentwin.dev is). Replies go to the lead's submitted email. |

Set them in Vercel under Project Settings → Environment Variables, then redeploy.

## Analytics

`@vercel/analytics` and `@vercel/speed-insights` are mounted in the root layout. Custom events (sent with `track()`):

- `cta_form_view` (`location`: final), `cta_form_submit` (`location`, `status`: success or fail)
- `cta_click` (`location`: hero, nav, packages): clicks on "Get your AI visibility audit" and the other links that scroll to the form
- `book_call_click` (`location`: nav, hero, final, packages, blog)
- `section_view` (`section`: hero, problem, how-it-works, packages, work, faq), once per session
- `demo_toggle` (`phase`: before, after)

Custom events only show in the Vercel dashboard on plans that include them (Pro and up).

## QA

Layout QA (needs a running server and Chrome) screenshots every section at 1440x900 and 390x844. It fails on overlapping or clipped text, horizontal scroll, or any size change in the hero chat.

```bash
npm run build && npm start
npm run qa -- http://localhost:3000 qa-screenshots
```
