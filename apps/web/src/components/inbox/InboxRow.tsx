"use client";

import type { InboxMessage } from "@/lib/inboxDashboard.types";

type Props = {
  message: InboxMessage;
  lang: "en" | "es";
};

const priorityStyles: Record<InboxMessage["priority"], string> = {
  high: "border-rose-400/20 bg-rose-400/10 text-rose-200",
  medium: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  low: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
};

const categoryStyles: Record<InboxMessage["category"], string> = {
  question: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  suggestion: "border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-200",
  "project inquiry": "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
  "bug report": "border-rose-400/20 bg-rose-400/10 text-rose-200",
  "general feedback": "border-white/10 bg-white/10 text-white/75",
};

function formatDate(value: string, lang: "en" | "es") {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return lang === "es" ? "Fecha no disponible" : "Date unavailable";
  }

  return new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatLanguage(language: InboxMessage["language"], lang: "en" | "es") {
  if (language === "es") {
    return lang === "es" ? "Espanol" : "Spanish";
  }

  return lang === "es" ? "Ingles" : "English";
}

function formatPriority(priority: InboxMessage["priority"]) {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

function formatCategory(category: InboxMessage["category"]) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export default function InboxRow({ message, lang }: Props) {
  const messageText =
    typeof message.message === "string" && message.message.trim().length > 0
      ? message.message.trim()
      : lang === "es"
        ? "Mensaje no disponible."
        : "Message unavailable.";

  const dateLabel = formatDate(message.created_at, lang);
  const languageLabel = formatLanguage(message.language, lang);

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition-colors hover:border-white/20 hover:bg-white/[0.06]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] ${priorityStyles[message.priority]}`}
            >
              {formatPriority(message.priority)}
            </span>
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${categoryStyles[message.category]}`}
            >
              {formatCategory(message.category)}
            </span>
          </div>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/88">{messageText}</p>
        </div>

        <div className="grid min-w-[220px] grid-cols-2 gap-3 text-xs text-white/60 sm:grid-cols-3 lg:grid-cols-1 lg:text-right">
          <div>
            <p className="uppercase tracking-[0.14em] text-white/40">
              {lang === "es" ? "Fecha" : "Date"}
            </p>
            <p className="mt-1 text-sm text-white/80">{dateLabel}</p>
          </div>
          <div>
            <p className="uppercase tracking-[0.14em] text-white/40">
              {lang === "es" ? "Idioma" : "Language"}
            </p>
            <p className="mt-1 text-sm text-white/80">{languageLabel}</p>
          </div>
          <div>
            <p className="uppercase tracking-[0.14em] text-white/40">Lead score</p>
            <p className="mt-1 text-sm font-medium text-white/90">
              {Number.isFinite(message.lead_score) ? message.lead_score : 0}/5
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
