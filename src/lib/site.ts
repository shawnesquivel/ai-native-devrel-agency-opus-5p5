import type { IconName } from "@/components/BrandIcon";

const VERCEL_HOST = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL || process.env.NEXT_PUBLIC_VERCEL_URL;

/** The studio name. Change it here and it updates the wordmark, metadata, OG image and llms.txt. */
export const BRAND_NAME = "AgentWin";

/** The one line every section comes back to. */
export const THEME = "Everything that gets you recommended.";

/** The daily engine, in one line. */
export const ENGINE = "Every day the engine ships. It finds trending formats and builds them in your brand voice.";

export const SITE = {
  name: BRAND_NAME,
  url: VERCEL_HOST ? `https://${VERCEL_HOST}` : "http://localhost:3000",
  email: "shawn@amihanventures.ca",
  tagline: "You built something agents want. We make sure agents can find you.",
  eyebrow: "Your full-stack DevRel studio",
  subline:
    "AI solved coding, not distribution. We do everything that gets you recommended by ChatGPT and Claude.",
  description:
    `AI solved coding, not distribution. ${BRAND_NAME} is a full-stack DevRel studio that does everything that gets you recommended by ChatGPT and Claude.`,
};

export const CAL_URL = "https://cal.com/shawn-ai/30min";

export const NAV = [
  { label: "Services", href: "/#services" },
  { label: "Process", href: "/#process" },
  { label: "FAQ", href: "/#faq" },
  { label: "Audit", href: "/#contact" },
];

export type ProblemArt = "answer" | "docs" | "hire";

export const PROBLEMS: { outcome: string; title: string; body: string; art: ProblemArt }[] = [
  {
    outcome: "AI recommendations",
    title: "AI recommends your competitor.",
    body: "Buyers ask an assistant. It searches the web, then names someone else.",
    art: "answer",
  },
  {
    outcome: "Customers",
    title: "Agents can't use your docs.",
    body: "Agents build from your messy documentation. When they get lost, you lose a customer, and never know what to fix.",
    art: "docs",
  },
  {
    outcome: "Speed",
    title: "A DevRel hire takes months.",
    body: "A hire spends months learning your product before shipping. We ship on day one.",
    art: "hire",
  },
];

/** Verified against OpenAI's DevDay 2026 recap (Sep 29, 2026): "our collective 1.2B weekly users". */
export const HOOK_STAT = {
  headline: "1.2B people ask ChatGPT every week.",
  sub: "Your buyers are asking it too.",
  source: "OpenAI, DevDay 2026 recap",
  href: "https://openai.com/index/devday-2026-recap/",
};

export const STEPS = [
  {
    title: "Audit",
    body: "We measure how often AI recommends you, and who it recommends instead.",
  },
  {
    title: "Strategize",
    body: "Our founders build your strategy from scratch: your market, your positioning, your buyers, what's trending, and the gaps your competitors left open. A 4-week plan, not a template.",
  },
  {
    title: "Ship",
    body: "Every day, in your brand voice, across your docs, blog and socials.",
  },
  {
    title: "Compound",
    body: "We track your score daily and re-plan every 4 weeks. Double down on what works, kill what doesn't.",
  },
];

export const SERVICES: { label: string; icon: IconName }[] = [
  { label: "Agent-ready docs", icon: "markdown" },
  { label: "AEO fixes for your site, blog and docs", icon: "aeo" },
  { label: "Explainer videos and blogs", icon: "youtube" },
  { label: "Tutorials", icon: "tutorial" },
  { label: "Boilerplate starter code", icon: "github" },
  { label: "MCP plugins for ChatGPT and Claude", icon: "mcp" },
  { label: "Founder-led content", icon: "x" },
  { label: "Events", icon: "calendar" },
  { label: "Daily AI visibility tracking", icon: "chart" },
];

export const AUDIT = {
  title: "AI visibility audit",
  tag: "Free, live on the call",
  body: "Your before score, plus everything holding you back on AI platforms and socials.",
  icons: ["chatgpt", "claude", "gemini", "grokbot", "hermes", "reddit"] as IconName[],
};

/* Contact funnel: the one form on the page (primary) or book a call (secondary). */
export const FUNNEL = {
  title: "Get your AI visibility audit",
  subline: "Share your site. We'll reach out within 48 hours with next steps.",
  submit: "Share your site",
  success: "Thanks, we'll reach out within 48 hours with next steps.",
  steps: ["Share your site or pick a time", "We audit your AI visibility live on the call", "You leave with your fix list"],
};

export const PACKAGES = {
  launch: {
    title: "Launch",
    badge: "Most popular for startups",
    outcome: "Get recommended by ChatGPT and Claude.",
    items: [
      "Founder-built 4-week strategy",
      "Daily content from the engine, in your brand voice",
      "Agent-ready docs and AEO fixes",
      "Your own Slack channel with us",
      "AI visibility score, tracked weekly",
    ],
  },
  scale: {
    title: "Scale",
    tag: "For teams ready to scale",
    note: "Strategy from the founders, not a template.",
    lead: "Everything in Launch, plus:",
    items: [
      "Dedicated Slack channel with priority turnaround",
      "Direct line to our founders",
      `Tag ${BRAND_NAME} in Slack or MCP for requests`,
      "Explainer videos, tutorials and starter code",
      "MCP apps for ChatGPT and Claude",
      "Ghostwritten founder content",
      "Events: meetups and hackathons",
      "Courses and workshops for your developers",
    ],
  },
  pricing: "Pricing on a call",
};

export const TEAM_COPY = {
  title: "We've done this from the inside.",
  intro:
    "Before this studio, we were the DevRel team at fast-growing AI startups. We shipped the launches, wrote the docs, and grew the communities. Now we do it for you.",
  closer: "Strategy from the founders, not a template.",
};

export type TeamChip = { label: string; marks?: ("composio" | "litellm" | "cursor" | "chatgpt")[] };

export const TEAM: { role: string; body: string; chips: TeamChip[] }[] = [
  {
    role: "Shawn · Co-founder",
    body: "Founding engineer turned DevRel at Series A startups. At Composio he wrote product code as MTS and ran growth, so he knows what actually gets developers to sign up.",
    chips: [
      { label: "Ex-DevRel + MTS, Composio", marks: ["composio"] },
      { label: "Cursor + Codex Ambassador", marks: ["cursor", "chatgpt"] },
    ],
  },
  {
    role: "Misbah · Co-founder",
    body: "Founding DevRel at LiteLLM. He built the developer motion from zero: the docs, the tutorials and the community.",
    chips: [{ label: "Founding DevRel, LiteLLM", marks: ["litellm"] }],
  },
];


export const CMS: IconName[] = ["framer", "notion", "webflow", "wordpress", "ghost", "sanity"];

export type LogoId = "composio" | "litellm" | "treg" | "rentahuman" | "cursor" | "grokbot" | "codex" | "chat2db";

/** Order and visibility of the "Our team has worked with" row. Flip `show` to toggle a logo. */
export const LOGOS: { id: LogoId; name: string; show: boolean }[] = [
  { id: "composio", name: "Composio", show: true },
  { id: "litellm", name: "LiteLLM", show: true },
  { id: "treg", name: "Treg", show: true },
  { id: "rentahuman", name: "RentAHuman", show: true },
  { id: "cursor", name: "Cursor", show: true },
  { id: "grokbot", name: "Grok Bot", show: true },
  { id: "codex", name: "Codex", show: false },
  { id: "chat2db", name: "Chat2DB", show: false },
];

export const STATS: { value: number; suffix: string; label: string; href?: string }[] = [
  {
    value: 500,
    suffix: "K+",
    label: "impressions from one hackathon",
    href: "https://www.linkedin.com/posts/shawnesquivel_80-people-showed-up-to-build-canada-activity-7444429338130731008-ftql",
  },
  { value: 180, suffix: "K+", label: "views on one reel", href: "https://www.instagram.com/reels/DNM8aS6y3dh/" },
  {
    value: 95,
    suffix: "K+",
    label: "impressions on a startup explainer",
    href: "https://x.com/AlexanderTw33ts/status/2032550830042394979",
  },
];

/* Hero demo: real databases in the "before", a placeholder for the client in the "after". Not real results. */
export type DemoSource = { title: string; domain: string; icon?: IconName };
export type DemoPick = { name: string; note: string; icon?: IconName };

export const DEMO = {
  question: "best database for my nextjs app",
  before: {
    sources: [
      { title: "Use Supabase with Next.js", domain: "supabase.com/docs", icon: "supabase" },
      { title: "Neon vs PlanetScale: which Postgres to pick", domain: "neon.com/blog", icon: "neon" },
      { title: "Best Postgres for Next.js in 2026?", domain: "reddit.com/r/nextjs", icon: "reddit" },
    ] as DemoSource[],
    answer: [
      { text: "I recommend " },
      { text: "Supabase", strong: true },
      { text: " for Postgres with auth built in, " },
      { text: "Neon", strong: true },
      { text: " if you want serverless branching, and " },
      { text: "PlanetScale", strong: true },
      { text: " for a managed cluster at scale." },
    ],
    picks: [
      { name: "Supabase", note: "Postgres with auth", icon: "supabase" },
      { name: "Neon", note: "Serverless branching", icon: "neon" },
      { name: "PlanetScale", note: "Managed at scale", icon: "planetscale" },
    ] as DemoPick[],
  },
  after: {
    sources: [
      { title: "[Your product] Next.js guide", domain: "yourproduct.com/docs/nextjs" },
      { title: "Neon vs PlanetScale: which Postgres to pick", domain: "neon.com/blog", icon: "neon" },
      { title: "Best Postgres for Next.js in 2026?", domain: "reddit.com/r/nextjs", icon: "reddit" },
    ] as DemoSource[],
    answer: [
      { text: "I would use " },
      { text: "[Your product]", strong: true },
      { text: " for a Next.js app that needs serverless Postgres. Their Next.js guide covers the pooler, Drizzle setup, and preview branches on one page." },
    ],
    cite: "[Your product] docs · Next.js guide",
    picks: [
      { name: "[Your product]", note: "Cited: Next.js guide" },
      { name: "Supabase", note: "Postgres with auth", icon: "supabase" },
      { name: "Neon", note: "Serverless branching", icon: "neon" },
      { name: "PlanetScale", note: "Managed at scale", icon: "planetscale" },
    ] as DemoPick[],
  },
};

/* "Make Something Agents Want": verbatim quotes, trimmed only with an ellipsis. */
/* Titles verified against each X bio on Nov 6, 2026; avatars are their X profile photos, saved in public/quotes/.
   The YC quote is unsigned copy from YC's event page, so it closes the rotation and people lead. */
export const QUOTES: { quote: string; name: string; title?: string; avatar: string; href: string }[] = [
  {
    quote: "…increasingly all of us are realizing it's make something agents want.",
    name: "Garry Tan",
    title: "Y Combinator President & CEO",
    avatar: "/quotes/garrytan.jpg",
    href: "https://www.youtube.com/watch?v=vl7HiMdGfjo",
  },
  {
    quote: "Agentic traffic growing so fast that bots have now passed human traffic online for the first time in the Internet's history.",
    name: "Matthew Prince",
    title: "Cloudflare co-founder & CEO",
    avatar: "/quotes/eastdakota.jpg",
    href: "https://x.com/eastdakota/status/2062212701414187452",
  },
  {
    quote: "Agents are motivating so many healthy software habits. Open APIs, documentation (skills), tests (evals), Unix (CLIs)…",
    name: "Guillermo Rauch",
    title: "Vercel CEO",
    avatar: "/quotes/rauchg.jpg",
    href: "https://x.com/rauchg/status/2067936390285807940",
  },
  {
    quote: "Spoiler alert: most bot traffic to docs now comes from AI crawlers.",
    name: "Lee Robinson",
    title: "Product at SpaceX",
    avatar: "/quotes/leerob.jpg",
    href: "https://leerob.com/docs",
  },
  {
    quote: "People will want agents to buy stuff for them. It will be one of the main use cases.",
    name: "Paul Graham",
    title: "Y Combinator co-founder",
    avatar: "/quotes/paulg.jpg",
    href: "https://x.com/paulg/status/2108011311229747525",
  },
  {
    quote:
      "Bot and agent traffic on the web now is greater than human traffic. If you're running a dev tools company, ecommerce store, or even a website, you are increasingly thinking about building for agents.",
    name: "Y Combinator",
    avatar: "/quotes/ycombinator.png",
    href: "https://events.ycombinator.com/MakeSomethingAgentsWant",
  },
];

/* Results: case cards. Only verified numbers; Chat2DB shows deliverables without view counts. */
export type WorkCase = {
  company: string;
  logo: "composio" | "rentahuman" | "cursor" | "chat2db" | "treg";
  platform: IconName;
  title: string;
  href: string;
  thumb?: string;
  deliverables: [string, string];
};

export const WORK: WorkCase[] = [
  {
    company: "Composio",
    logo: "composio",
    platform: "youtube",
    title: "Build an AI Agent in Telegram with Vercel, Cursor, Composio",
    href: "https://www.youtube.com/watch?v=hIh2O9OL69o",
    thumb: "/media/yt-hIh2O9OL69o.jpg",
    deliverables: ["Boilerplate code", "1hr educational content"],
  },
  {
    company: "RentAHuman",
    logo: "rentahuman",
    platform: "x",
    title: "RentAHuman launch explainer",
    href: "https://x.com/AlexanderTw33ts/status/2032550830042394979",
    thumb: "/media/x-rentahuman.jpg",
    deliverables: ["Launch post", "95K+ impressions"],
  },
  {
    company: "Treg",
    logo: "treg",
    platform: "x",
    title: "Claude Code + Treg tutorial series",
    href: "https://x.com/shawnbuilds/status/2106405013111328977",
    thumb: "/media/x-treg-jev.jpg",
    /* Verified totals across Shawn's own Treg posts. */
    deliverables: ["15 videos + X articles", "49K+ views"],
  },
  {
    company: "Composio",
    logo: "composio",
    platform: "x",
    title: "Composio is now available as a Cursor plugin",
    href: "https://x.com/composio/status/2075271401263476808",
    thumb: "/media/x-composio-cursor.jpg",
    deliverables: ["Cursor plugin", "Launch video"],
  },
  {
    company: "Cursor",
    logo: "cursor",
    platform: "linkedin",
    title: "Cursor hackathon: 80 people showed up to build Canada",
    href: "https://www.linkedin.com/posts/shawnesquivel_80-people-showed-up-to-build-canada-activity-7444429338130731008-ftql",
    deliverables: ["Hackathon", "500K+ impressions"],
  },
  {
    company: "Chat2DB",
    logo: "chat2db",
    platform: "youtube",
    title: "AI for SQL Databases (Chat2DB + Claude 4)",
    href: "https://www.youtube.com/watch?v=CB8A0jtHzbU",
    thumb: "/media/yt-CB8A0jtHzbU.jpg",
    deliverables: ["Tutorial video", "Claude integration demo"],
  },
];

export const FAQ = [
  {
    q: `What is ${BRAND_NAME}?`,
    a: "A full-stack DevRel studio. We do everything that gets you recommended: docs, AEO fixes, videos, tutorials, starter code, MCP plugins, founder content and events.",
  },
  {
    q: `Why ${BRAND_NAME}?`,
    a: "AI agents now decide which tools their users pick. We help you win them.",
  },
  {
    q: "Are you AI native?",
    a: "Yes. Our engine runs on agents and ships daily in your brand voice. Engineers and our review agents check every piece.",
  },
  {
    q: "How is this different from an AI content agency?",
    a: "We're engineers. We build with your product, so the code in every tutorial, starter and docs example runs.",
  },
  {
    q: "Can you build an MCP app for ChatGPT and Claude?",
    a: "Yes, on Scale. We build your MCP server and plugin to the platforms' best practices, as we did at Composio.",
  },
  {
    q: "Do you publish to our CMS?",
    a: "Yes. We publish straight into your CMS: Framer, Notion, Webflow, WordPress, Ghost or Sanity.",
  },
  {
    q: "Can we request content ourselves?",
    a: `Yes. On Scale, tag ${BRAND_NAME} in Slack or through MCP. On Launch, ask us in your Slack channel.`,
  },
  {
    q: "How does it work?",
    a: "Audit, strategize, ship, compound. We measure your AI visibility, our founders build a 4-week plan, we ship daily and re-plan every 4 weeks.",
  },
  {
    q: "How do you measure AI visibility?",
    a: "We ask the major AI assistants your buyers' questions every day and record who gets named and cited. That's your AI visibility score.",
  },
  {
    q: "How fast will we see results?",
    a: "Content ships from day one. AI assistants pick it up on their own schedule, so expect a multi-month effort.",
  },
  {
    q: "What's the difference between Launch and Scale?",
    a: "Launch: strategy, daily content, docs and AEO fixes, Slack and a weekly score. Scale adds priority turnaround, founder access, videos, MCP apps, events and courses.",
  },
  {
    q: "How long is the contract?",
    a: "Month-to-month. The AI visibility audit is free, live on the call.",
  },
  {
    q: "How do we get started?",
    a: "Share your site or book a call. We audit your AI visibility live, and you leave with your fix list.",
  },
  {
    q: "What do you need from us?",
    a: "Product access, one technical contact and time to review drafts. For founder posts, a short call to get your voice right.",
  },
  {
    q: "Who do you work with?",
    a: "Everyone from small pre-revenue teams to YC startups to enterprises.",
  },
];
