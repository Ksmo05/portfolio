const AI_INBOX_API_URL = process.env.NEXT_PUBLIC_INBOX_API_URL?.trim() || null;
const DEFAULT_INBOX_API_BASE_URL = "https://ai-portfolio-inbox.onrender.com";

export const CHAT_WIDGET_SOURCE = "portfolio-chat-widget";
export const CONTACT_FORM_SOURCE = "portfolio-vercel";

type ChatReplyResponse = {
  reply?: string;
  message?:
    | string
    | {
        reply_text?: string;
        reply?: string;
      };
};

export type InboxSuccessResponse = {
  ok?: boolean;
  analysis_engine?: string;
  message?: Record<string, unknown>;
  detail?: string;
};

export type ContactFormPayload = {
  name: string;
  email: string | null;
  company: string | null;
  message: string;
  source: string;
};

function normalizeInboxUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export function getInboxApiBaseUrl() {
  if (!AI_INBOX_API_URL) {
    return DEFAULT_INBOX_API_BASE_URL;
  }

  const normalized = normalizeInboxUrl(AI_INBOX_API_URL);

  if (normalized.endsWith("/api/inbox")) {
    return normalized.slice(0, -"/api/inbox".length);
  }

  return normalized;
}

export function getInboxApiEndpoint(path = "/api/inbox") {
  const baseUrl = getInboxApiBaseUrl();
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function postInboxPayload<TResponse>(payload: unknown) {
  const response = await fetch(getInboxApiEndpoint("/api/inbox"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const rawText = await response.text();
  let data: TResponse | null = null;

  if (rawText) {
    try {
      data = JSON.parse(rawText) as TResponse;
    } catch {
      throw new Error("invalid-json-response");
    }
  }

  return {
    response,
    data,
    rawText,
  };
}

export async function sendChatMessage(message: string) {
  const response = await fetch(getInboxApiEndpoint("/api/inbox"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Website Visitor",
      company: null,
      message,
      source: "chat_widget",
    }),
  });

  if (!response.ok) {
    throw new Error("chat-request-failed");
  }

  const data: ChatReplyResponse = await response.json();

  const reply =
  typeof data?.message === "object" &&
  data?.message !== null &&
  typeof data.message.reply_text === "string"
    ? data.message.reply_text
    : typeof data?.reply === "string"
    ? data.reply
    : null;

  if (!reply) {
    throw new Error("chat-empty-response");
  }

  return reply;
}

export { AI_INBOX_API_URL };
