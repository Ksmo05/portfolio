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
    <div className="page-shell max-w-5xl space-y-10 py-14 md:py-20">
      <Link href="/projects" className="eyebrow-label text-sm font-medium hover:text-white">
        {"<- Back to Projects"}
      </Link>

      <header className="section-shell overflow-hidden rounded-[2rem]">
        <div className="relative aspect-[16/8] w-full border-b border-white/8 bg-slate-950/40">
          <Image
            src={project.imageSrc}
            alt={project.imageAlt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="rounded-lg object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-[#020617]/18 to-transparent" />
        </div>

        <div className="space-y-5 p-8 md:p-10">
          <p className="eyebrow-label text-[0.72rem] font-semibold uppercase">Project</p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">{project.title}</h1>
          <p className="text-muted max-w-3xl leading-7">{project.summary}</p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="pill-chip rounded-full px-3 py-1 text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {project.videoSrc ? (
        <section className="section-shell rounded-[2rem] p-8 md:p-10">
          <h2 className="text-2xl font-semibold text-white">Project Video Overview</h2>
          <div className="mx-auto my-8 w-full max-w-3xl overflow-hidden rounded-[1.25rem] border border-white/8 bg-black shadow-sm">
            <video className="aspect-video w-full object-cover" controls playsInline preload="metadata" aria-label="Project video overview">
              <source src={project.videoSrc} type="video/mp4" />
            </video>
          </div>
        </section>
      ) : null}

      <section className="section-shell space-y-8 rounded-[2rem] p-8 md:p-10">
        <div>
          <h2 className="text-2xl font-semibold text-white">Overview</h2>
          <p className="text-muted mt-3 leading-7">{project.overview}</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white">Key Activities</h2>
          <ul className="text-muted mt-3 space-y-2 leading-7">
            {project.keyActivities.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white">Tools Used</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <SkillBadge key={tool} label={tool} />
            ))}
          </div>
        </div>

        <div className="section-shell-muted rounded-[1.5rem] p-5">
          <h2 className="text-xl font-semibold text-white">Operational Impact</h2>
          <p className="text-muted mt-2 leading-7">{project.operationalImpact}</p>
        </div>
      </section>
    </div>
  );
}
