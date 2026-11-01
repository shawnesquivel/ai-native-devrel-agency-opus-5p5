# Lode

Landing page for a full-stack DevRel studio for devtools startups. Next.js 16 (App Router), React 19, Tailwind CSS v4, Geist + Geist Mono.

- The studio name (currently "Lode") lives in `BRAND_NAME` in `src/lib/site.ts`. It drives the wordmark, metadata, OG image and `/llms.txt`.
- All copy, logos (toggle with `show`), stats, videos and FAQ are in `src/lib/site.ts`.
- Routes: `/`, `/blog`, `/llms.txt`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image`.
- Logo sources: `public/logos/` (Composio, Cursor, Codex, Chat2DB and Treg from the brand kit; freeCodeCamp from freeCodeCamp/design-style-guide; LiteLLM rasterized from the official lockup on litellm.ai).

```bash
npm install
npm run dev
```

Layout QA (needs a running server and Chrome): screenshots every section at 1440x900 and 390x844 and fails on overlapping or clipped text, or horizontal scroll.

```bash
npm run build && npm start
npm run qa -- http://localhost:3000 qa-screenshots
```
