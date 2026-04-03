"use client";

import { useEffect, useState } from "react";
import { useInboxDashboardData } from "@/hooks/useInboxDashboardData";
import InboxCharts from "@/components/inbox/InboxCharts";
import InboxKpiCards from "@/components/inbox/InboxKpiCards";
import type { DashboardLang } from "@/lib/inboxDashboardCopy";
import { getDashboardCopy } from "@/lib/inboxDashboardUtils";

export default function InboxDashboard() {
  const [lang, setLang] = useState<DashboardLang>(() => {
    if (typeof window === "undefined") return "en";

    const saved = window.localStorage.getItem("inbox-dashboard-lang");
    return saved === "es" ? "es" : "en";
  });

  const { messages, total, isLoading, error } = useInboxDashboardData();

  const copy = getDashboardCopy(lang);

  // Temporal: hasta conectar threads reales
  const mockThreads = [{}, {}, {}];

  useEffect(() => {
    window.localStorage.setItem("inbox-dashboard-lang", lang);
  }, [lang]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-4 w-24 rounded bg-white/10" />
                <div className="h-10 w-72 rounded bg-white/10" />
                <div className="h-4 w-96 rounded bg-white/10" />
              </div>
              <div className="h-10 w-24 rounded-full bg-white/10" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="h-28 rounded-2xl bg-white/10" />
              <div className="h-28 rounded-2xl bg-white/10" />
              <div className="h-28 rounded-2xl bg-white/10" />
              <div className="h-28 rounded-2xl bg-white/10" />
            </div>

            <div className="h-80 rounded-2xl bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-red-300">Dashboard error</p>
          <p className="text-sm text-red-200/80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">
            {copy.heroEyebrow}
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-white">
            {copy.heroTitle}
          </h1>
          <p className="mt-3 max-w-3xl text-white/70">
            {copy.heroDescription}
          </p>
        </div>

        <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => setLang("en")}
            className={`rounded-full px-3 py-1 text-sm ${
              lang === "en" ? "bg-white text-slate-900" : "text-white/70"
            }`}
          >
            EN
          </button>

          <button
            onClick={() => setLang("es")}
            className={`rounded-full px-3 py-1 text-sm ${
              lang === "es" ? "bg-white text-slate-900" : "text-white/70"
            }`}
          >
            ES
          </button>
        </div>
      </div>

      <InboxKpiCards
        messages={messages}
        threads={mockThreads}
        lang={lang}
        
      />

      <InboxCharts messages={messages} lang={lang} />
    </div>
  );
}