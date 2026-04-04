import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { Project } from "@/lib/projects";

type ProjectCardProps = {
  project: Project;
  locale?: Locale;
};

const copy: Record<Locale, { project: string; impact: string; button: string }> = {
  en: { project: "Project", impact: "Operational impact:", button: "View Project Details" },
  es: { project: "Proyecto", impact: "Impacto operativo:", button: "Ver Detalle del Proyecto" },
};

export default function ProjectCard({ project, locale = "en" }: ProjectCardProps) {
  const text = copy[locale];

  return (
    <article className="card-surface group flex h-full flex-col overflow-hidden rounded-[1.75rem] transition duration-300 hover:-translate-y-1.5 hover:border-white/18 hover:shadow-[0_34px_90px_-48px_rgba(2,6,23,1)]">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-white/8 bg-slate-950/40">
        <Image
          src={project.imageSrc}
          alt={project.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-lg object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-[#020617]/18 to-transparent" />
      </div>

      <div className="flex h-full flex-col p-6 md:p-7">
        <p className="eyebrow-label text-[0.72rem] font-semibold uppercase">{text.project}</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">{project.title}</h3>
        <p className="text-muted mt-4 text-sm leading-6">{project.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="pill-chip rounded-full px-3 py-1 text-xs font-medium">
              {tag}
            </span>
          ))}
          {project.tools.slice(0, 2).map((tool) => (
            <span key={tool} className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs font-medium text-slate-300">
              {tool}
            </span>
          ))}
        </div>

        <p className="mt-5 text-sm leading-6 text-slate-200">
          <span className="font-semibold text-white">{text.impact}</span> <span className="text-muted">{project.operationalImpact}</span>
        </p>

        <div className="mt-auto pt-6">
          <Link
            href={`/${locale}/projects/${project.slug}`}
            className="button-secondary inline-flex rounded-full px-4 py-2.5 text-sm font-medium"
          >
            {text.button}
          </Link>
        </div>
      </div>
    </article>
  );
}
