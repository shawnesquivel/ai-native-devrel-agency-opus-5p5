import type { IconName } from "@/components/BrandIcon";

const VERCEL_HOST = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL || process.env.NEXT_PUBLIC_VERCEL_URL;

/** The studio name. Change it here and it updates the wordmark, metadata, OG image and llms.txt. */
export const BRAND_NAME = "Lode";

/** The one line every section comes back to. */
export const THEME = "Everything that gets you recommended.";

/** The daily engine, in one line. */
export const ENGINE = "Every day the engine ships. It finds trending formats and builds them in your brand voice.";

export const SITE = {
  name: BRAND_NAME,
  url: VERCEL_HOST ? `https://${VERCEL_HOST}` : "http://localhost:3000",
  email: "shawn@amihanventures.ca",
  tagline: "You built something agents want. Now make sure they can find it.",
  eyebrow: "Your full-stack DevRel studio",
  subline:
    "AI solved coding, not distribution. We do everything that gets you recommended by ChatGPT and Claude.",
  description:
    `AI solved coding, not distribution. ${BRAND_NAME} is an AI-native, full-stack DevRel studio that does everything that gets you recommended by ChatGPT and Claude.`,
};

export const CAL_URL = "https://cal.com/shawn-ai/30min";

export const NAV = [
  { label: "Services", href: "/#services" },
  { label: "Process", href: "/#process" },
  { label: "FAQ", href: "/#faq" },
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
    body: "Cursor, Claude Code and Codex build from your docs. When they get lost, adoption fails and you never see why.",
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
    body: "We ask ChatGPT, Claude, Gemini, Grok and Hermes your buyers' questions and check your socials. You get your AI visibility score.",
  },
  {
    title: "Ship",
    body: "Everything that gets you recommended, shipped every day: docs, AEO fixes, videos, tutorials, starter code, MCP plugins, founder posts and events.",
  },
  {
    title: "Measure",
    body: "A monthly, done-for-you report: your AI visibility score, citations, competitors and what ships next.",
  },
  {
    title: "Repeat",
    body: "The engine keeps shipping. It finds trending formats and builds them in your brand voice, so your score keeps climbing.",
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
  { label: "Monthly visibility tracking", icon: "chart" },
];

export const AUDIT = {
  title: "Free AI visibility audit",
  body: "Your before score, plus everything holding you back on AI platforms and socials.",
  icons: ["chatgpt", "claude", "gemini", "grokbot", "hermes", "reddit"] as IconName[],
};

export const PACKAGES = {
  basic: {
    title: "Basic",
    tag: "Great for startups",
    items: [
      "Core AEO fixes to your site, blog and docs",
      "Agent-ready docs",
      "Steady content from the daily engine",
      "Dedicated Slack channel",
      "Monthly AI visibility report",
    ],
  },
  whiteGlove: {
    title: "Full white-glove",
    tag: "For teams ready to scale",
    lead: "Everything in Basic, plus:",
    items: [
      "Dedicated Slack channel with priority turnaround",
      "Direct line to our founders",
      `Tag ${BRAND_NAME} in Slack or MCP for requests`,
      "Explainer videos, tutorials and starter code",
      "MCP apps for ChatGPT and Claude",
      "Ghostwritten founder content",
      "Events: meetups and hackathons",
    ],
  },
  pricing: "Pricing on a call",
};

export const TEAM_INTRO =
  "We've led developer relations inside AI startups. We know what developers trust, what agents read, and what gets a product recommended.";

export const TEAM = [
  { role: "Full-stack engineer", creds: ["Ex-DevRel at Composio", "Cursor Ambassador", "Codex Ambassador"] },
  { role: "Full-stack engineer", creds: ["Founding DevRel at LiteLLM"] },
];


export const CMS: IconName[] = ["framer", "notion", "webflow", "wordpress", "ghost", "sanity"];

export type LogoId = "composio" | "litellm" | "treg" | "freecodecamp" | "cursor" | "grokbot" | "codex" | "chat2db";

/** Order and visibility of the "Our team has worked with" row. Flip `show` to toggle a logo. */
export const LOGOS: { id: LogoId; name: string; show: boolean }[] = [
  { id: "composio", name: "Composio", show: true },
  { id: "litellm", name: "LiteLLM", show: true },
  { id: "treg", name: "Treg", show: true },
  { id: "freecodecamp", name: "freeCodeCamp", show: true },
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
  { value: 5000, suffix: "+", label: "developers taught" },
];

/* Hero demo. Placeholders only: no real names or results. */
export const DEMO = {
  question: "What's the best [category] tool for [use case]?",
  before: ["[Competitor A]", "[Competitor B]", "[Competitor C]"],
  after: {
    pick: "[Your product]",
    reason: "Recommended for [use case]",
    cites: ["your docs", "your tutorial"],
    rest: ["[Competitor A]", "[Competitor B]"],
  },
};

export const VIDEOS = [
  {
    id: "hIh2O9OL69o",
    title: "Build an AI Agent in Telegram with Vercel, Cursor, Composio",
    channel: "freeCodeCamp",
    thumb: "/media/yt-hIh2O9OL69o.jpg",
  },
  { id: "3b25TnusP7I", title: "Gumloop Skills Explained", channel: "Gumloop", thumb: "/media/yt-3b25TnusP7I.jpg" },
  {
    id: "CB8A0jtHzbU",
    title: "AI for SQL Databases (Chat2DB + Claude 4)",
    channel: "Chat2DB",
    thumb: "/media/yt-CB8A0jtHzbU.jpg",
  },
];

export const POSTS = [
  {
    title: "Composio plugin for Cursor",
    href: "https://x.com/composio/status/2075271401263476808",
  },
  {
    title: "Composio on Warp",
    href: "https://x.com/composio/status/2076653097338724843",
  },
  {
    title: "RentAHuman explainer",
    href: "https://x.com/AlexanderTw33ts/status/2032550830042394979",
  },
];

export const FAQ = [
  {
    q: `What is ${BRAND_NAME}?`,
    a: "A full-stack DevRel studio. We do everything that gets you recommended: agent-ready docs, AEO fixes, videos, tutorials, starter code, MCP plugins, founder content and events, tracked monthly. Every day the engine ships.",
  },
  {
    q: "Are you AI native?",
    a: "Yes. Our engine runs on agents: it finds trending formats every day and builds them in your brand voice. Engineers and our own review agents check every piece before it ships.",
  },
  {
    q: "How is this different from an AI content agency?",
    a: "We're engineers. We build with your product, so the code in every tutorial, starter and docs example runs. Every piece is reviewed.",
  },
  {
    q: "Who makes the content?",
    a: "Our engine drafts, our engineers build and edit. Every piece is reviewed by an engineer and by our own review agents.",
  },
  {
    q: "Can you build an MCP app for ChatGPT and Claude?",
    a: "Yes, on the white-glove package. We build your MCP server and plugin so your product works natively inside ChatGPT and Claude. We follow the platforms' best practices, because approval can take months when teams don't. We've done this at Composio.",
  },
  {
    q: "Do you publish to our CMS?",
    a: "Yes. We publish straight into the blog CMS you already use, like Framer, Notion, Webflow, WordPress, Ghost or Sanity.",
  },
  {
    q: "Can we request content ourselves?",
    a: `Yes. On white-glove, tag ${BRAND_NAME} in your Slack channel or through MCP when inspiration strikes, and the request goes into the engine. On Basic, ask us in your dedicated Slack channel.`,
  },
  {
    q: "How do you measure AI visibility?",
    a: "We ask the major AI assistants the questions your buyers ask, and record who gets named and which pages get cited. That becomes your AI visibility score, reported monthly with competitors and what ships next.",
  },
  {
    q: "How fast will we see results?",
    a: "Content ships from day one. AI assistants pick it up on their own schedule, so treat visibility as a multi-month effort. The report shows what moved.",
  },
  {
    q: "What's the difference between Basic and white-glove?",
    a: `Basic covers core AEO fixes, agent-ready docs, steady content, a dedicated Slack channel and the monthly report. White-glove adds priority turnaround in Slack, a direct line to our founders, requests by tagging ${BRAND_NAME}, videos, tutorials, starter code, MCP apps, founder content and events.`,
  },
  {
    q: "How long is the contract?",
    a: "Basic and white-glove are month-to-month. The audit is free.",
  },
  {
    q: "What do you need from us?",
    a: "Product access, one technical point of contact, and time to review drafts. For founder posts, a short call so we get your voice right.",
  },
  {
    q: "Who do you work with?",
    a: "Everyone from small pre-revenue teams to YC startups to enterprises.",
  },
];
