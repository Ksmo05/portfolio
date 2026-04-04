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
    <div className="page-shell max-w-5xl space-y-10 py-14 md:py-20">
      <Link href={`/${locale}/projects`} className="eyebrow-label text-sm font-medium hover:text-white">{text.back}</Link>

      <header className="section-shell overflow-hidden rounded-[2rem]">
        <div className="relative aspect-[16/8] w-full border-b border-white/8 bg-slate-950/40">
          <Image src={project.imageSrc} alt={project.imageAlt} fill priority sizes="(max-width: 1024px) 100vw, 1024px" className="rounded-lg object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-[#020617]/18 to-transparent" />
        </div>

        <div className="space-y-5 p-8 md:p-10">
          <p className="eyebrow-label text-[0.72rem] font-semibold uppercase">{text.project}</p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">{project.title}</h1>
          <p className="text-muted max-w-3xl leading-7">{project.summary}</p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="pill-chip rounded-full px-3 py-1 text-xs font-medium">{tag}</span>
            ))}
          </div>
        </div>
      </header>

      {project.videoSrc ? (
        <section className="section-shell rounded-[2rem] p-8 md:p-10">
          <h2 className="text-2xl font-semibold text-white">{text.video}</h2>
          <div className="mx-auto my-8 w-full max-w-3xl overflow-hidden rounded-[1.25rem] border border-white/8 bg-black shadow-sm">
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

      <section className="section-shell space-y-8 rounded-[2rem] p-8 md:p-10">
        <div>
          <h2 className="text-2xl font-semibold text-white">{text.overview}</h2>
          <p className="text-muted mt-3 leading-7">{project.overview}</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white">{text.activities}</h2>
          <ul className="text-muted mt-3 space-y-2 leading-7">
            {project.keyActivities.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white">{text.tools}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tools.map((tool) => (
              <SkillBadge key={tool} label={tool} />
            ))}
          </div>
        </div>

        <div className="section-shell-muted rounded-[1.5rem] p-5">
          <h2 className="text-xl font-semibold text-white">{text.impact}</h2>
          <p className="text-muted mt-2 leading-7">{project.operationalImpact}</p>
        </div>
      </section>
    </div>
  );
}
