export type ChatRole = "assistant" | "user";

export type ChatMessageRecord = {
  id: string;
  role: ChatRole;
  content: string;
};

export type QuickAction = {
  id: string;
  label: string;
  prompt: string;
};

