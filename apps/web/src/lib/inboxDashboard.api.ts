import type { InboxDashboardResponse, InboxMessage } from "@/lib/inboxDashboard.types";
import { getInboxApiEndpoint } from "@/lib/aiInbox";

function normalizeMessage(item: Record<string, unknown>, index: number): InboxMessage {
  const priority =
    item.priority === "high" || item.priority === "medium" || item.priority === "low"
      ? item.priority
      : "low";

  const category =
    item.category === "question" ||
    item.category === "suggestion" ||
    item.category === "project inquiry" ||
    item.category === "bug report" ||
    item.category === "general feedback"
      ? item.category
      : "general feedback";

  const language = item.language === "es" || item.language === "en" ? item.language : "en";

  const leadScore =
    typeof item.lead_score === "number"
      ? item.lead_score
      : typeof item.lead_score === "string"
        ? Number(item.lead_score) || 0
        : 0;

  return {
    id: String(item.id ?? `message-${index}`),
    name: typeof item.name === "string" ? item.name : null,
    email: typeof item.email === "string" ? item.email : null,
    company: typeof item.company === "string" ? item.company : null,
    message: typeof item.message === "string" ? item.message : "",
    summary: typeof item.summary === "string" ? item.summary : null,
    priority,
    category,
    language,
    lead_score: leadScore,
    sentiment:
      item.sentiment === "positive" || item.sentiment === "neutral" || item.sentiment === "negative"
        ? item.sentiment
        : null,
    created_at:
      typeof item.created_at === "string" ? item.created_at : new Date().toISOString(),
    theme_label: typeof item.theme_label === "string" ? item.theme_label : null,
    thread_title: typeof item.thread_title === "string" ? item.thread_title : null,
  };
}

function normalizeResponse(data: unknown): InboxDashboardResponse {
  if (!data || typeof data !== "object") {
    return { messages: [], total: 0 };
  }

  const raw = data as Record<string, unknown>;

  const rawMessages =
    Array.isArray(raw.messages)
      ? raw.messages
      : Array.isArray(raw.items)
        ? raw.items
        : Array.isArray(raw.results)
          ? raw.results
          : [];

  const messages = rawMessages
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map(normalizeMessage);

  const total =
    typeof raw.total === "number"
      ? raw.total
      : typeof raw.count === "number"
        ? raw.count
        : messages.length;

  return { messages, total };
}

export async function fetchInboxDashboardData(): Promise<InboxDashboardResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  let response: Response;
  try {
    response = await fetch(getInboxApiEndpoint("/api/messages"), {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      (data && typeof data === "object" && "message" in data && typeof data.message === "string"
        ? data.message
        : null) || `Failed to fetch inbox dashboard data: ${response.status}`,
    );
  }

  return normalizeResponse(data);
}
