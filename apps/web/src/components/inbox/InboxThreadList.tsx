"use client";

import InboxEmptyState from "@/components/inbox/InboxEmptyState";
import InboxListSkeleton from "@/components/inbox/InboxListSkeleton";
import InboxRow from "@/components/inbox/InboxRow";
import type { InboxMessage } from "@/lib/inboxDashboard.types";

type Props = {
  messages: InboxMessage[];
  total: number;
  isLoading: boolean;
  lang: "en" | "es";
};

export default function InboxThreadList({ messages, total, isLoading, lang }: Props) {
  const title = lang === "es" ? "Inbox en tiempo real" : "Live inbox";
  const subtitle =
    lang === "es"
      ? "Mensajes recientes clasificados desde la API del dashboard."
      : "Recent classified messages coming from the dashboard API.";
  const countLabel =
    lang === "es" ? `${total} mensajes` : `${total} messages`;

  if (isLoading) {
    return <InboxListSkeleton />;
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">
            {lang === "es" ? "Mensajes" : "Messages"}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-white/60">{subtitle}</p>
        </div>

        <div className="inline-flex w-fit rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-white/60">
          {countLabel}
        </div>
      </div>

      {messages.length === 0 ? (
        <InboxEmptyState lang={lang} />
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <InboxRow key={message.id} message={message} lang={lang} />
          ))}
        </div>
      )}
    </section>
  );
}
