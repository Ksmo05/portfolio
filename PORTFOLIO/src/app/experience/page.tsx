import type { Metadata } from "next";
import Link from "next/link";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import SectionHeader from "@/components/sections/SectionHeader";
import { experienceEntries } from "@/lib/experience";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Professional Experience | Carlos San Miguel Ortega",
  description:
    "Professional timeline across purchasing operations, reporting support, procurement administration, and customer operations.",
  path: "/experience",
});

export default function ExperiencePage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-14 md:py-20">
      <SectionHeader
        eyebrow="Career Path"
        title="Professional Experience"
        description="Operational experience across purchasing workflows, reporting support, procurement administration, and customer-facing operations."
      />

      <ExperienceTimeline entries={experienceEntries} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          This timeline complements the project portfolio and academic background with concrete role-based operational experience.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/professional-profile"
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            View Professional Profile
          </Link>
          <Link
            href="/education"
            className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-600 dark:border-slate-600 dark:text-slate-200"
          >
            View Education
          </Link>
        </div>
      </div>
    </div>
  );
}
