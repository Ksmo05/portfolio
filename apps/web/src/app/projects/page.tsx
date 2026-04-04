import type { Metadata } from "next";
import ProjectCard from "@/components/cards/ProjectCard";
import SectionHeader from "@/components/sections/SectionHeader";
import { buildMetadata } from "@/lib/metadata";
import { projects } from "@/lib/projects";

export const metadata: Metadata = buildMetadata({
  title: "Projects | Carlos San Miguel",
  description:
    "Applied projects related to digital tools, information organization, productivity and practical uses of AI.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-14 md:py-20">
      <SectionHeader
        eyebrow="Projects"
        title="Applied Digital Projects"
        description="Selected initiatives that show how I use digital tools, structured information and practical AI to support communication and efficiency."
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="grid gap-4 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-3">
          <p className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">Projects used to communicate ideas, organize information and support useful workflows.</p>
          <p className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">A practical mix of digital communication, productivity tools and operational thinking.</p>
          <p className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">Presented as applied initiatives, not as a purely technical showcase.</p>
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

