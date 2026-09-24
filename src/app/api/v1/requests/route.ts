import { AUDIENCES, PRIORITIES, REQUEST_TYPES, createRequest, validateCreateRequest } from "@/lib/requests";

export function GET() {
  return Response.json({
    object: "list",
    endpoint: "POST /api/v1/requests",
    request_types: Object.entries(REQUEST_TYPES).map(([type, spec]) => ({
      type,
      label: spec.label,
      description: spec.description,
      deliverables: spec.deliverables,
      turnaround_days: spec.turnaroundDays,
    })),
    fields: {
      type: { required: true, enum: Object.keys(REQUEST_TYPES) },
      title: { required: true, type: "string", max: 140 },
      brief: { required: false, type: "string", max: 2000 },
      audience: { required: false, enum: AUDIENCES, default: "intermediate" },
      priority: { required: false, enum: PRIORITIES, default: "normal" },
      links: { required: false, type: "string[]", max: 10 },
    },
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: { type: "invalid_request", messages: ["Body must be valid JSON."] } },
      { status: 400 },
    );
  }

  const result = validateCreateRequest(body);
  if (!result.ok) {
    return Response.json(
      { error: { type: "invalid_request", messages: result.errors } },
      { status: 422 },
    );
  }

  return Response.json(createRequest(result.data), { status: 201 });
}
