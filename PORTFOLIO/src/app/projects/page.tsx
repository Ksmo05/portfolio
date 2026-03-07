import type { Metadata } from "next";
import ProjectCard from "@/components/cards/ProjectCard";
import SectionHeader from "@/components/sections/SectionHeader";
import { buildMetadata } from "@/lib/metadata";
import { projects } from "@/lib/projects";

export const metadata: Metadata = buildMetadata({
  title: "Projects | Carlos San Miguel Ortega",
  description:
    "Real operational projects at RPC covering purchasing support, dealership performance reporting, and training content development.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-14 md:py-20">
      <SectionHeader
        eyebrow="Current Projects"
        title="Operational Projects at RPC"
        description="Real projects focused on purchasing operations support, dealership performance reporting, and training content development."
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="grid gap-4 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-3">
          <p className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">Direct contribution to day-to-day operational execution.</p>
          <p className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">Structured reporting and coordination across business teams.</p>
          <p className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">Process discipline aligned with corporate standards and business needs.</p>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
