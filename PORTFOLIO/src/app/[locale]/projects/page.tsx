import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectCard from "@/components/cards/ProjectCard";
import SectionHeader from "@/components/sections/SectionHeader";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/metadata";
import { getProjects } from "@/lib/projects";

type Props = { params: Promise<{ locale: string }> };

const copy: Record<Locale, { eyebrow: string; title: string; desc: string; bullets: string[] }> = {
  en: {
    eyebrow: "Current Projects",
    title: "Operational Projects at RPC",
    desc: "Real projects focused on purchasing operations support, dealership performance reporting, and training content development.",
    bullets: [
      "Direct contribution to day-to-day operational execution.",
      "Structured reporting and coordination across business teams.",
      "Process discipline aligned with corporate standards and business needs.",
    ],
  },
  es: {
    eyebrow: "Proyectos Actuales",
    title: "Proyectos Operativos en RPC",
    desc: "Proyectos reales centrados en soporte a operaciones de compras, reporting comercial de concesionarios y desarrollo de contenido formativo.",
    bullets: [
      "Contribucion directa a la ejecucion operativa diaria.",
      "Reporting estructurado y coordinacion entre equipos de negocio.",
      "Disciplina de proceso alineada con estandares corporativos y necesidades operativas.",
    ],
  },
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildMetadata({
    title: locale === "es" ? "Proyectos | Carlos San Miguel Ortega" : "Projects | Carlos San Miguel Ortega",
    description: copy[locale].desc,
    path: "/projects",
    locale,
  });
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const text = copy[locale];
  const projects = getProjects(locale);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-14 md:py-20">
      <SectionHeader eyebrow={text.eyebrow} title={text.title} description={text.desc} />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <div className="grid gap-4 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-3">
          {text.bullets.map((item) => (
            <p key={item} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">{item}</p>
          ))}
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} locale={locale} />
        ))}
      </div>
    </div>
  );
}
