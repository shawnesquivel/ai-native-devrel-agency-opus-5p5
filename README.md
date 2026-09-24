# AI Native DevRel

Landing page for **AI Native DevRel** — DevRel as a subscription. Companies (or their agents) submit requests and get blogs, long-form YouTube, X/LinkedIn content, and cookbooks.

Built with Next.js 16 (App Router), React 19, and Tailwind CSS v4. Dark mode first.

## Pages

- `/` — landing page: hero, brand marquee, how it works, services, API playground, comparison table, selected work, about, FAQ
- `/work` — full portfolio, grouped by format, with embedded X posts

## Request API (sandbox)

The playground on the landing page calls a real route handler. Nothing is persisted yet; it validates the payload and returns a mock ticket. This is the shape the future MCP server (`devrel.create_request`) will wrap.

```bash
# List request types and fields
curl https://<host>/api/v1/requests

# Create a request
curl -X POST https://<host>/api/v1/requests \
  -H "Content-Type: application/json" \
  -d '{"type":"cookbook","title":"GitHub triage agent","audience":"intermediate","priority":"normal"}'
```

| Field      | Required | Values                                                         |
| ---------- | -------- | -------------------------------------------------------------- |
| `type`     | yes      | `blog`, `article`, `shortform`, `longform`, `thread`, `cookbook` |
| `title`    | yes      | string, 3–140 chars                                            |
| `brief`    | no       | string, ≤ 2000 chars                                           |
| `audience` | no       | `beginner`, `intermediate` (default), `advanced`               |
| `priority` | no       | `normal` (default), `rush`                                     |
| `links`    | no       | up to 10 URLs                                                  |

Returns `201` with `{ id, status: "queued", estimated_delivery, deliverables, ... }`, or `422` with validation messages.

## Editing content

- Copy, CTA link, portfolio items, and FAQ: `src/lib/site.ts`
- Request types and validation: `src/lib/requests.ts`
- Brand logos: `public/logos/`

## Development

```bash
npm install
npm run dev
```
