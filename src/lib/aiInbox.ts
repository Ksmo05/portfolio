const AI_INBOX_API_URL = process.env.NEXT_PUBLIC_INBOX_API_URL;

export const CHAT_WIDGET_SOURCE = "portfolio-chat-widget";
export const CONTACT_FORM_SOURCE = "portfolio-vercel";

type ChatReplyResponse = {
  reply?: string;
  message?: unknown;
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

function getInboxApiUrl() {
  if (!AI_INBOX_API_URL) {
    console.error("[aiInbox] Missing NEXT_PUBLIC_INBOX_API_URL");
    return null;
  }

  return AI_INBOX_API_URL;
}

export async function sendChatMessage(message: string) {
  const response = await fetch("https://ai-portfolio-inbox.onrender.com/api/inbox", {
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

  const data = await response.json();

  const reply =
    typeof data?.reply === "string"
      ? data.reply
      : typeof data?.message === "string"
      ? data.message
      : null;

  if (!reply) {
    throw new Error("chat-empty-response");
  }

  return reply;
}

export { AI_INBOX_API_URL };

