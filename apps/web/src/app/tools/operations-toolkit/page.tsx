import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Operations Toolkit Overview",
  description:
    "Overview of practical operational workflow blocks for reporting, purchasing coordination, and documentation follow-up.",
  path: "/tools/operations-toolkit",
});

export default function OperationsToolkitPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-14 md:py-20">
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">Operational Guide</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-5xl">
          Operations Toolkit Overview
        </h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          This page summarizes practical workflow blocks used in operational environments: KPI reporting routines, purchasing follow-up, supplier coordination, and documentation control.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {[
          "KPI reporting structure and cadence planning",
          "Purchase order tracking and exception follow-up",
          "Vendor communication templates and ownership",
          "Documentation validation checkpoints and escalation",
        ].map((item) => (
          <div key={item} className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {item}
          </div>
        ))}
      </section>
    </div>
  );
}
