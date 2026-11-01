import type { IconName } from "@/components/BrandIcon";

const VERCEL_HOST = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL || process.env.NEXT_PUBLIC_VERCEL_URL;

/** The studio name. Change it here and it updates the wordmark, metadata, OG image and llms.txt. */
export const BRAND_NAME = "Lode";

export const SITE = {
  name: BRAND_NAME,
  url: VERCEL_HOST ? `https://${VERCEL_HOST}` : "http://localhost:3000",
  email: "shawn@amihanventures.ca",
  tagline: "You built something agents want. Now make sure they can find it.",
  eyebrow: "Your full-stack DevRel studio",
  subline:
    "AI solved coding, not distribution. We make written and video content so ChatGPT and Claude recommend your product, not your competitors.",
  description:
    "AI solved coding, not distribution. A full-stack DevRel studio for devtools startups: engineers make written and video content so ChatGPT and Claude recommend your product, not your competitors.",
};

export const CAL_URL = "https://cal.com/shawn-ai/30min";

export const NAV = [
  { label: "Services", href: "/#services" },
  { label: "Process", href: "/#process" },
  { label: "FAQ", href: "/#faq" },
];

export const PROBLEMS: { title: string; icons: IconName[] }[] = [
  { title: "Your blog reads like AI slop.", icons: ["article"] },
  { title: "ChatGPT recommends your competitor.", icons: ["chatgpt"] },
  { title: "Your docs confuse coding agents.", icons: ["cursor", "codex"] },
  { title: "Hiring a DevRel takes months.", icons: ["calendar"] },
];

export const STEPS = [
  {
    title: "Audit",
    body: "We ask ChatGPT, Claude and Gemini your buyers' questions and see who gets named.",
  },
  {
    title: "Build",
    body: "Engineers build a real project with your product.",
  },
  {
    title: "Ship",
    body: "One build becomes an explainer video, a technical blog post, a tested docs example and founder posts.",
  },
  {
    title: "Track",
    body: "A monthly, done-for-you AI visibility report: mentions, citations, competitors and what we ship next.",
  },
];

export const PYRAMID = [
  { level: "Top", title: "Founder-led content", body: "Ghostwritten posts in your founders' voice." },
  { level: "Core", title: "Explainer videos + technical blogs", body: "Built from a real project, so the code runs.", core: true },
  { level: "Base", title: "Docs for AI agents", body: "Docs and examples coding agents can read and use." },
];

export const OFFERS = [
  {
    title: "Free AI visibility audit",
    items: ["Answers from three assistants", "Who gets cited, and from where", "What to fix first"],
    pricing: "Free",
  },
  {
    title: "Launch kit",
    items: ["Explainer video", "Shorts", "Launch posts"],
    pricing: "Pricing on a call",
  },
  {
    title: "Monthly DevRel retainer",
    items: ["Docs, videos and blogs every month", "Founder-led posts", "Monthly AI visibility report"],
    pricing: "Pricing on a call",
  },
];

export const TEAM = [
  { role: "Full-stack engineer", creds: ["Ex-DevRel at Composio", "Cursor Ambassador", "Codex Ambassador"] },
  { role: "Full-stack engineer", creds: ["Founding DevRel at LiteLLM"] },
  { role: "Vetted writers", creds: ["Technical writers with real dev backgrounds", "Including university students"] },
];

export type LogoId = "composio" | "litellm" | "treg" | "freecodecamp" | "cursor" | "codex" | "chat2db";

/** Order and visibility of the "Our team has worked with" row. Flip `show` to toggle a logo. */
export const LOGOS: { id: LogoId; name: string; show: boolean }[] = [
  { id: "composio", name: "Composio", show: true },
  { id: "litellm", name: "LiteLLM", show: true },
  { id: "treg", name: "Treg", show: true },
  { id: "freecodecamp", name: "freeCodeCamp", show: true },
  { id: "cursor", name: "Cursor", show: true },
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
    q: "How is this different from an AI content agency?",
    a: "We're engineers. We build a real project with your product first, then write and film from it. Code gets tested, and an engineer reviews every piece.",
  },
  {
    q: "Who writes the content?",
    a: "We do, with a small network of vetted technical writers who have real dev backgrounds. An engineer reviews everything before it ships.",
  },
  {
    q: "How do you measure AI visibility?",
    a: "Each month we ask ChatGPT, Claude and Gemini the questions your buyers ask, and record who gets mentioned and which pages get cited. You get it as a report, with competitors and what we ship next.",
  },
  {
    q: "How fast will we see results?",
    a: "Content ships in the first weeks. AI assistants pick it up on their own schedule, so treat visibility as a multi-month effort. The report shows what moved.",
  },
  {
    q: "How long is the contract?",
    a: "The retainer is month-to-month. A launch kit is a one-off project. The audit is free.",
  },
  {
    q: "What do you need from us?",
    a: "Product access, one technical point of contact, and time to review drafts. For founder posts, a short call so we get your voice right.",
  },
  {
    q: "Do you work outside devtools?",
    a: "Not for now. We only work with devtools startups.",
  },
];
