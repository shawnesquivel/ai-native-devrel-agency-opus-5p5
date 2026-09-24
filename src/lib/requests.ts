export const REQUEST_TYPES = {
  blog: {
    label: "Blog post",
    description: "SEO/AEO-optimized technical blog post (1,200–2,000 words).",
    deliverables: ["Markdown draft", "Cover image", "Code snippets tested end-to-end"],
    turnaroundDays: 3,
  },
  article: {
    label: "Long-form article",
    description: "Deep-dive guide or launch article with diagrams (2,500+ words).",
    deliverables: ["Markdown draft", "Diagrams", "Companion repo"],
    turnaroundDays: 5,
  },
  shortform: {
    label: "Short-form video",
    description: "Vertical 30–90s video for X, Reels, Shorts, and TikTok.",
    deliverables: ["Edited vertical video", "Captions", "Post copy"],
    turnaroundDays: 3,
  },
  longform: {
    label: "Long-form video",
    description: "10–30 minute YouTube tutorial, scripted, recorded, and edited.",
    deliverables: ["Edited 16:9 video", "Thumbnail", "Chapters + description"],
    turnaroundDays: 7,
  },
  thread: {
    label: "X / LinkedIn thread",
    description: "Launch thread or developer-activation post with visuals.",
    deliverables: ["Thread copy", "Screenshots / GIFs", "Posting schedule"],
    turnaroundDays: 2,
  },
  cookbook: {
    label: "Cookbook",
    description: "Runnable example app or notebook that shows your API in action.",
    deliverables: ["GitHub repo or notebook", "README walkthrough", "Tested on latest SDK"],
    turnaroundDays: 5,
  },
} as const;

export type RequestType = keyof typeof REQUEST_TYPES;

export const AUDIENCES = ["beginner", "intermediate", "advanced"] as const;
export type Audience = (typeof AUDIENCES)[number];

export const PRIORITIES = ["normal", "rush"] as const;
export type Priority = (typeof PRIORITIES)[number];

export type CreateRequestInput = {
  type: RequestType;
  title: string;
  brief?: string;
  audience?: Audience;
  priority?: Priority;
  links?: string[];
};

export type DevRelRequest = {
  id: string;
  object: "request";
  livemode: false;
  status: "queued";
  type: RequestType;
  title: string;
  brief: string | null;
  audience: Audience;
  priority: Priority;
  links: string[];
  deliverables: readonly string[];
  estimated_delivery: string;
  created_at: string;
};

export function isRequestType(value: unknown): value is RequestType {
  return typeof value === "string" && value in REQUEST_TYPES;
}

export function validateCreateRequest(
  body: unknown,
): { ok: true; data: CreateRequestInput } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  if (typeof body !== "object" || body === null) {
    return { ok: false, errors: ["Body must be a JSON object."] };
  }
  const b = body as Record<string, unknown>;

  if (!isRequestType(b.type)) {
    errors.push(`"type" must be one of: ${Object.keys(REQUEST_TYPES).join(", ")}.`);
  }
  if (typeof b.title !== "string" || b.title.trim().length < 3) {
    errors.push(`"title" is required (min 3 characters).`);
  } else if (b.title.length > 140) {
    errors.push(`"title" must be 140 characters or fewer.`);
  }
  if (b.brief !== undefined && (typeof b.brief !== "string" || b.brief.length > 2000)) {
    errors.push(`"brief" must be a string of 2000 characters or fewer.`);
  }
  if (b.audience !== undefined && !AUDIENCES.includes(b.audience as Audience)) {
    errors.push(`"audience" must be one of: ${AUDIENCES.join(", ")}.`);
  }
  if (b.priority !== undefined && !PRIORITIES.includes(b.priority as Priority)) {
    errors.push(`"priority" must be one of: ${PRIORITIES.join(", ")}.`);
  }
  if (
    b.links !== undefined &&
    (!Array.isArray(b.links) || b.links.length > 10 || b.links.some((l) => typeof l !== "string"))
  ) {
    errors.push(`"links" must be an array of up to 10 URLs.`);
  }

  if (errors.length) return { ok: false, errors };
  return { ok: true, data: b as unknown as CreateRequestInput };
}

export function createRequest(input: CreateRequestInput, now = new Date()): DevRelRequest {
  const spec = REQUEST_TYPES[input.type];
  const priority = input.priority ?? "normal";
  const days = priority === "rush" ? Math.max(1, Math.ceil(spec.turnaroundDays / 2)) : spec.turnaroundDays;
  const eta = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return {
    id: `req_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`,
    object: "request",
    livemode: false,
    status: "queued",
    type: input.type,
    title: input.title.trim(),
    brief: input.brief?.trim() || null,
    audience: input.audience ?? "intermediate",
    priority,
    links: input.links ?? [],
    deliverables: spec.deliverables,
    estimated_delivery: eta.toISOString(),
    created_at: now.toISOString(),
  };
}
