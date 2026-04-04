const AI_INBOX_API_URL = process.env.NEXT_PUBLIC_INBOX_API_URL?.trim() || null;

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

export type ChatHistoryItem = {
  role: "assistant" | "user";
  content: string;
};

function normalizeInboxUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export function getInboxApiBaseUrl() {
  if (!AI_INBOX_API_URL) {
    throw new Error("missing-inbox-api-url");
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

export async function sendChatMessage(message: string, history: ChatHistoryItem[] = []) {
  const { response, data } = await postInboxPayload<ChatReplyResponse>({
    name: "Website Visitor",
    company: null,
    message,
    source: CHAT_WIDGET_SOURCE,
    messages: history,
  });

  if (!response.ok) {
    throw new Error("chat-request-failed");
  }

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
