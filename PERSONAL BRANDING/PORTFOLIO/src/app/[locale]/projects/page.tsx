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
    eyebrow: "Projects",
    title: "Personal Digital Projects",
    desc: "Personal and exploratory projects related to digital tools, web content, productivity and practical uses of AI.",
    bullets: [
      "Projects developed to present ideas, interests and useful digital workflows.",
      "A practical mix of web content, productivity tools and information organization.",
      "Focused on realistic exploration rather than advanced technical development.",
    ],
  },
  es: {
    eyebrow: "Proyectos",
    title: "Proyectos Digitales Personales",
    desc: "Proyectos personales y exploratorios relacionados con herramientas digitales, contenido web, productividad y usos practicos de la IA.",
    bullets: [
      "Proyectos desarrollados para presentar ideas, intereses y flujos digitales utiles.",
      "Una combinacion practica de contenido web, herramientas de productividad y organizacion de informacion.",
      "Enfocados en exploracion realista, no en desarrollo tecnico avanzado.",
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
    title: locale === "es" ? "Proyectos | Carlos San Miguel" : "Projects | Carlos San Miguel",
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

