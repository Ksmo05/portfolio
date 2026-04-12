"use client";

import { useEffect, useState } from "react";
import { getInboxApiEndpoint } from "@/lib/aiInbox";
import type { InboxDashboardResponse, InboxMessage } from "@/lib/inboxDashboard.types";

export function useInboxDashboardData() {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(getInboxApiEndpoint("/api/messages"), {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = (await res.json()) as {
          items?: InboxMessage[];
          total?: number;
        };

        const normalized: InboxDashboardResponse = {
          messages: data.items ?? [],
          total: typeof data.total === "number" ? data.total : (data.items ?? []).length,
        };

        setMessages(normalized.messages);
        setTotal(normalized.total);
      } catch (err) {
        if (
          (err instanceof DOMException && err.name === "AbortError") ||
          (err instanceof Error && err.name === "AbortError")
        ) {
          return;
        }
        console.error(err);
        setError("Error loading inbox");
      } finally {
        setIsLoading(false);
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, []);

  return { messages, total, isLoading, error };
}
