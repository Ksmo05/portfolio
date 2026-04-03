"use client";

import { useEffect, useState } from "react";

type InboxMessage = {
  id: string;
  message: string;
  priority: "high" | "medium" | "low";
  category:
    | "question"
    | "suggestion"
    | "project inquiry"
    | "bug report"
    | "general feedback";
  language: "en" | "es";
  lead_score: number;
  created_at: string;
};

export function useInboxDashboardData() {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(
          "https://ai-portfolio-inbox.onrender.com/api/inbox"
        );

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = (await res.json()) as {
          messages?: InboxMessage[];
          total?: number;
        };

        setMessages(data.messages ?? []);
        setTotal(data.total ?? 0);
      } catch (err) {
        console.error(err);
        setError("Error loading inbox");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  return { messages, total, isLoading, error };
}