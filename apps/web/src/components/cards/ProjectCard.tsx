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
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-slate-900">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-neutral-200 bg-slate-100 dark:border-neutral-800 dark:bg-slate-800">
        <Image
          src={project.imageSrc}
          alt={project.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-lg object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent" />
      </div>

      <div className="flex h-full flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">{text.project}</p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{project.title}</h3>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{project.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {tag}
            </span>
          ))}
          {project.tools.slice(0, 2).map((tool) => (
            <span key={tool} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300">
              {tool}
            </span>
          ))}
        </div>

        <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">
          <span className="font-semibold">{text.impact}</span> {project.operationalImpact}
        </p>

        <div className="mt-auto pt-6">
          <Link
            href={`/${locale}/projects/${project.slug}`}
            className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition group-hover:border-slate-900 dark:border-slate-600 dark:text-slate-200 dark:group-hover:border-white"
          >
            {text.button}
          </Link>
        </div>
      </div>
    </article>
  );
}
