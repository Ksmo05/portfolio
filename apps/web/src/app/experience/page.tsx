import type { Metadata } from "next";
import Link from "next/link";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import SectionHeader from "@/components/sections/SectionHeader";
import { experienceEntries } from "@/lib/experience";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Professional Experience | Carlos San Miguel",
  description:
    "Professional timeline across operations support, procurement workflows, reporting, incident handling and process coordination.",
  path: "/experience",
});

export default function ExperiencePage() {
  return (
    <div className="page-shell space-y-10 py-14 md:py-20">
      <SectionHeader
        eyebrow="Experience"
        title="Professional Experience"
        description="Experience across operations support, procurement workflows, reporting, incident handling and process coordination."
      />

      <ExperienceTimeline entries={experienceEntries} />

      <div className="section-shell rounded-[2rem] p-6 md:p-8">
        <p className="text-muted text-sm leading-7">
          This timeline brings together roles focused on operational support, documentation, reporting, customer or user assistance and coordination across different business environments.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/professional-profile"
            className="button-primary rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            View Professional Profile
          </Link>
          <Link
            href="/education"
            className="button-secondary rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            View Education
          </Link>
        </div>
      </div>
    </div>
  );
}

