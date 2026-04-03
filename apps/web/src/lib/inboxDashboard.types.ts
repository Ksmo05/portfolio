export type InboxMessagePriority = "high" | "medium" | "low";

export type InboxMessageCategory =
  | "question"
  | "suggestion"
  | "project inquiry"
  | "bug report"
  | "general feedback";

export type InboxMessageLanguage = "en" | "es";

export type InboxMessage = {
  id: string;
  name: string | null;
  email: string | null;
  company: string | null;
  message: string;
  summary: string | null;
  priority: InboxMessagePriority;
  category: InboxMessageCategory;
  language: InboxMessageLanguage;
  lead_score: number;
  sentiment: "positive" | "neutral" | "negative" | null;
  created_at: string;
  theme_label: string | null;
  thread_title: string | null;
};

export type InboxDashboardResponse = {
  messages: InboxMessage[];
  total: number;
};
