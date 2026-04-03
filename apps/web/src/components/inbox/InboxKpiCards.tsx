"use client";

import { getDashboardCopy } from "@/lib/inboxDashboardUtils";
import type { DashboardLang } from "@/lib/inboxDashboardCopy";

type MessageItem = {
  lead_score?: number;
  language?: string;
};

type ThreadItem = unknown;

type InboxKpiCardsProps = {
  messages: MessageItem[];
  threads: ThreadItem[];
  lang: DashboardLang;
};

export default function InboxKpiCards({
  messages,
  threads,
  lang,
}: InboxKpiCardsProps) {
  const copy = getDashboardCopy(lang);

  const avgLeadScore =
    messages.length > 0
      ? (
          messages.reduce((acc, item) => acc + (item.lead_score ?? 0), 0) /
          messages.length
        ).toFixed(1)
      : "0.0";

  const languageSet = new Set(
    messages.map((message) => message.language).filter(Boolean)
  );

  const cards = [
    {
      label: copy.totalMessages,
      value: messages.length,
    },
    {
      label: copy.totalThreads,
      value: threads.length,
    },
    {
      label: copy.avgLeadScore,
      value: avgLeadScore,
    },
    {
      label: copy.languages,
      value: Array.from(languageSet).join(" / ") || "-",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">
            {card.label}
          </p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}