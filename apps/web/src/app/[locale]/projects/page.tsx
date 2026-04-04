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
    title: "Applied Digital Projects",
    desc: "Selected initiatives that show how I use digital tools, structured information and practical AI to support communication and efficiency.",
    bullets: [
      "Projects used to communicate ideas, organize information and support useful workflows.",
      "A practical mix of digital communication, productivity tools and operational thinking.",
      "Presented as applied initiatives, not as a purely technical showcase.",
    ],
  },
  es: {
    eyebrow: "Proyectos",
    title: "Proyectos Digitales Aplicados",
    desc: "Iniciativas seleccionadas que muestran como utilizo herramientas digitales, informacion estructurada e IA practica para apoyar comunicacion y eficiencia.",
    bullets: [
      "Proyectos utilizados para comunicar ideas, organizar informacion y apoyar workflows utiles.",
      "Una combinacion practica de comunicacion digital, herramientas de productividad y enfoque operativo.",
      "Presentados como iniciativas aplicadas, no como una muestra de ingenieria de software pura.",
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
    <div className="page-shell space-y-10 py-14 md:py-20">
      <SectionHeader eyebrow={text.eyebrow} title={text.title} description={text.desc} />

      <section className="section-shell-muted rounded-[2rem] p-6 md:p-8">
        <div className="grid gap-4 text-sm text-slate-300 md:grid-cols-3">
          {text.bullets.map((item) => (
            <p key={item} className="card-surface-soft rounded-[1.35rem] p-4">{item}</p>
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

