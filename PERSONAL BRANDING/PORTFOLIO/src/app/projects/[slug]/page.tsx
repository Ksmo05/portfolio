import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SkillBadge from "@/components/sections/SkillBadge";
import { buildMetadata } from "@/lib/metadata";
import { getProjectBySlug, projects } from "@/lib/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return buildMetadata({
      title: "Project Not Found",
      description: "This project page could not be found.",
      path: `/projects/${slug}`,
    });
  }

  return buildMetadata({
    title: `${project.title} | Project`,
    description: project.summary,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10 px-6 py-14 md:py-20">
      <Link href="/projects" className="text-sm font-medium text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-100">
        {"<- Back to Projects"}
      </Link>

      <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <div className="relative aspect-[16/8] w-full border-b border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
          <Image
            src={project.imageSrc}
            alt={project.imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="rounded-lg object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />
        </div>

        <div className="space-y-5 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">Project</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-5xl">{project.title}</h1>
          <p className="max-w-3xl text-slate-600 dark:text-slate-300">{project.summary}</p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {project.videoSrc ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-2xl font-semibold">Project Video Overview</h2>
          <div className="mx-auto my-8 w-full max-w-3xl overflow-hidden rounded-xl border border-slate-200 bg-black shadow-sm dark:border-slate-700">
            <video className="aspect-video w-full object-cover" controls playsInline preload="metadata" aria-label="Project video overview">
              <source src={project.videoSrc} type="video/mp4" />
            </video>
          </div>
        </section>
      ) : null}

      <section className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-900">
        <div>
          <h2 className="text-2xl font-semibold">Overview</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{project.overview}</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Key Activities</h2>
          <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-300">
            {project.keyActivities.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Tools Used</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <SkillBadge key={tool} label={tool} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-xl font-semibold">Operational Impact</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{project.operationalImpact}</p>
        </div>
      </section>
    </div>
  );
}
