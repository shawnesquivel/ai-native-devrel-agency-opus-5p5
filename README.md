# AI Native DevRel

Landing page and MCP server for **AI Native DevRel**, DevRel as a subscription. Companies (or their agents) submit requests and get blogs, long-form YouTube, X/LinkedIn content, and cookbooks.

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, Supabase, and the MCP SDK v2 via `mcp-handler`.

## Pages

- `/`: landing page (hero, brand marquee, how it works, services, API playground, comparison, work, about, FAQ)
- `/work`: full portfolio with embedded X posts
- `/mcp`: setup instructions clients follow to connect Cursor, Claude Code, or Codex

## MCP server

`/api/mcp` exposes `create_request`, `list_requests`, and `get_request` over Streamable HTTP, authenticated with per-client API keys. New requests are stored in Supabase and posted to Slack. Full spec, safeguards, and data flow: [docs/mcp-server.md](docs/mcp-server.md).

### Going live

1. Create a Supabase project, then apply the schema:

   ```bash
   npx supabase login
   npx supabase link --project-ref <project-ref>
   npx supabase db push
   ```

2. In Vercel project settings, add `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and optionally `SLACK_WEBHOOK_URL` and `DEVREL_DAILY_REQUEST_LIMIT` (see `.env.example`). Redeploy.
3. Issue a key for each client and send them the printed setup:

   ```bash
   npm run keys:create -- "Acme Inc" --url https://your-domain
   ```

Manage the queue in the Supabase Table Editor: update `requests.status` and `requests.deliverable_url` as work moves along (clients see both through their agent). Revoke a key by setting `clients.revoked_at`; raise a client's cap with `clients.daily_request_limit`.

## Request API

`POST /api/v1/requests` accepts the same fields as `create_request`. With `Authorization: Bearer <API key>` the request is stored; without one it's a sandbox that validates and echoes (used by the landing-page playground). `GET /api/v1/requests` describes the fields.

## Development

```bash
npm install
npm run dev
```

Tests:

```bash
npm test                 # unit tests
npx supabase start       # needs Docker
npm run test:e2e         # builds the app and drives /api/mcp with the official MCP client
```

Content (copy, CTA link, portfolio, FAQ) lives in `src/lib/site.ts`; request types in `src/lib/request-types.ts`; logos in `public/logos/`.
