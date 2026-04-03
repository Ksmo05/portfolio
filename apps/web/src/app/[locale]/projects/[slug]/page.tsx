import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SkillBadge from "@/components/sections/SkillBadge";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/metadata";
import { getProjectBySlug, getProjects } from "@/lib/projects";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const copy: Record<Locale, {
  back: string;
  project: string;
  video: string;
  overview: string;
  activities: string;
  tools: string;
  impact: string;
}> = {
  en: {
    back: "<- Back to Projects",
    project: "Project",
    video: "Project Video Overview",
    overview: "Overview",
    activities: "Key Activities",
    tools: "Tools Used",
    impact: "Operational Impact",
  },
  es: {
    back: "<- Volver a Proyectos",
    project: "Proyecto",
    video: "Vista General en Video del Proyecto",
    overview: "Resumen",
    activities: "Actividades Clave",
    tools: "Herramientas Utilizadas",
    impact: "Impacto Operativo",
  },
};

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    getProjects(locale).map((project) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const project = getProjectBySlug(locale, slug);
  if (!project) return {};

  return buildMetadata({
    title: `${project.title} ${locale === "es" ? "| Proyecto" : "| Project"}`,
    description: project.summary,
    path: `/projects/${project.slug}`,
    locale,
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const project = getProjectBySlug(locale, slug);
  if (!project) notFound();

  const text = copy[locale];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10 px-6 py-14 md:py-20">
      <Link href={`/${locale}/projects`} className="text-sm font-medium text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-100">{text.back}</Link>

      <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <div className="relative aspect-[16/8] w-full border-b border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
          <Image src={project.imageSrc} alt={project.imageAlt} fill priority sizes="(max-width: 1024px) 100vw, 1024px" className="rounded-lg object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />
        </div>

        <div className="space-y-5 p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">{text.project}</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-5xl">{project.title}</h1>
          <p className="max-w-3xl text-slate-600 dark:text-slate-300">{project.summary}</p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">{tag}</span>
            ))}
          </div>
        </div>
      </header>

      {project.videoSrc ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-2xl font-semibold">{text.video}</h2>
          <div className="mx-auto my-8 w-full max-w-3xl overflow-hidden rounded-xl border border-slate-200 bg-black shadow-sm dark:border-slate-700">
            <video
              className="aspect-video w-full object-cover"
              controls
              playsInline
              preload="metadata"
              aria-label={locale === "es" ? "Vista de video del proyecto" : "Project video overview"}
            >
              <source src={project.videoSrc} type="video/mp4" />
            </video>
          </div>
        </section>
      ) : null}

      <section className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-900">
        <div>
          <h2 className="text-2xl font-semibold">{text.overview}</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{project.overview}</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">{text.activities}</h2>
          <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-300">
            {project.keyActivities.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">{text.tools}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <SkillBadge key={tool} label={tool} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-xl font-semibold">{text.impact}</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{project.operationalImpact}</p>
        </div>
      </section>
    </div>
  );
}
