import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogCard from "@/components/cards/BlogCard";
import ExperienceSnapshotCard from "@/components/cards/ExperienceSnapshotCard";
import ProjectCard from "@/components/cards/ProjectCard";
import SectionHeader from "@/components/sections/SectionHeader";
import SkillBadge from "@/components/sections/SkillBadge";
import { getAllPosts } from "@/lib/blog";
import { getEducationEntries } from "@/lib/education";
import { getExperienceSnapshot } from "@/lib/experience";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/metadata";
import { getProjects } from "@/lib/projects";
import { getShortBio, getSiteConfig, toolStack } from "@/lib/site";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const copy: Record<Locale, {
  heroTitle: string;
  heroSubtitle: string;
  experienceTitle: string;
  experienceDesc: string;
  capabilitiesTitle: string;
  capabilitiesDesc: string;
  projectsTitle: string;
  projectsDesc: string;
  educationTitle: string;
  educationDesc: string;
  blogTitle: string;
  blogDesc: string;
  thinkingTitle: string;
  thinkingDesc: string;
  thinkingCards: Array<{ icon: string; title: string; body: string }>;
  toolsTitle: string;
  toolsDesc: string;
  viewExperience: string;
  profileButton: string;
  capabilities: string[];
}> = {
  en: {
    heroTitle: "Operations & Business Support Specialist",
    heroSubtitle: "Purchasing Processes, Reporting and Dealer Network Performance",
    experienceTitle: "Professional Experience Snapshot",
    experienceDesc: "Role-based highlights across purchasing operations, reporting workflows, and operational coordination.",
    capabilitiesTitle: "Core Capabilities",
    capabilitiesDesc: "Professional capabilities developed through operational execution, reporting discipline, and structured process control.",
    projectsTitle: "Featured Projects",
    projectsDesc: "Representative operational projects demonstrating reporting structure, process discipline, and business support execution.",
    educationTitle: "Academic Background",
    educationDesc: "Education supporting operational thinking, structured analysis, and business execution.",
    blogTitle: "Latest Insights",
    blogDesc: "Operational articles on dashboards, documentation standards, and structured knowledge transfer.",
    thinkingTitle: "Operational Thinking",
    thinkingDesc: "How I approach operational challenges in business environments.",
    thinkingCards: [
      {
        icon: "📊",
        title: "Operational Visibility",
        body: "Dashboards and structured reporting create continuous visibility over performance signals, helping detect bottlenecks early and prioritize corrective actions.",
      },
      {
        icon: "⚙️",
        title: "Process Clarity",
        body: "Clear workflows and practical documentation reduce ambiguity, improve consistency across teams, and lower operational friction in day-to-day execution.",
      },
      {
        icon: "📈",
        title: "Data-Driven Engagement",
        body: "Data analysis supports more persuasive operational conversations, increasing alignment and participation in initiatives such as performance campaigns and process changes.",
      },
      {
        icon: "🧠",
        title: "Structured Knowledge",
        body: "Well-structured training and documentation strengthen knowledge transfer, preserve operational know-how, and provide stability as teams and priorities evolve.",
      },
    ],
    toolsTitle: "Operational Tool Environment",
    toolsDesc: "Core systems used in daily operational contexts.",
    viewExperience: "View Experience",
    profileButton: "Professional Profile",
    capabilities: ["Purchasing Operations", "Operational Reporting", "Vendor Coordination", "Business Support Processes", "Operational Documentation"],
  },
  es: {
    heroTitle: "Especialista en Operaciones y Soporte de Negocio",
    heroSubtitle: "Procesos de Compras, Reporting y Rendimiento de Red de Concesionarios",
    experienceTitle: "Resumen de Experiencia Profesional",
    experienceDesc: "Hitos por rol en operaciones de compras, reporting y coordinacion operativa.",
    capabilitiesTitle: "Capacidades Clave",
    capabilitiesDesc: "Capacidades profesionales desarrolladas mediante ejecucion operativa, disciplina de reporting y control de procesos.",
    projectsTitle: "Proyectos Destacados",
    projectsDesc: "Proyectos operativos representativos que muestran estructura de reporting, disciplina de procesos y ejecucion de soporte de negocio.",
    educationTitle: "Formacion Academica",
    educationDesc: "Formacion que respalda pensamiento operativo, analisis estructurado y ejecucion de negocio.",
    blogTitle: "Ultimos Articulos",
    blogDesc: "Articulos operativos sobre dashboards, estandares documentales y transferencia de conocimiento.",
    thinkingTitle: "Pensamiento Operativo",
    thinkingDesc: "Como abordo desafios operativos en entornos de negocio.",
    thinkingCards: [
      {
        icon: "📊",
        title: "Visibilidad Operativa",
        body: "Los dashboards y el reporting estructurado aportan visibilidad continua del rendimiento, permitiendo detectar cuellos de botella y priorizar acciones correctivas.",
      },
      {
        icon: "⚙️",
        title: "Claridad de Proceso",
        body: "Flujos claros y documentacion practica reducen ambiguedad, mejoran consistencia entre equipos y disminuyen friccion operativa en la ejecucion diaria.",
      },
      {
        icon: "📈",
        title: "Impulso Basado en Datos",
        body: "El analisis de datos facilita conversaciones operativas mas solidas, aumentando alineacion y participacion en iniciativas y programas de mejora.",
      },
      {
        icon: "🧠",
        title: "Conocimiento Estructurado",
        body: "Materiales formativos y documentacion bien estructurados refuerzan transferencia de conocimiento y estabilidad operativa a lo largo del tiempo.",
      },
    ],
    toolsTitle: "Entorno de Herramientas Operativas",
    toolsDesc: "Sistemas clave utilizados en entornos operativos diarios.",
    viewExperience: "Ver Experiencia",
    profileButton: "Perfil Profesional",
    capabilities: ["Operaciones de Compras", "Reporting Operativo", "Coordinacion de Proveedores", "Procesos de Soporte de Negocio", "Documentacion Operativa"],
  },
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const site = getSiteConfig(locale);
  return buildMetadata({
    title: site.title,
    description: site.description,
    path: "/",
    locale,
  });
}

export default async function LocalizedHomePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const text = copy[locale];
  const site = getSiteConfig(locale);
  const posts = (await getAllPosts(locale)).slice(0, 3);
  const projects = getProjects(locale).slice(0, 3);
  const experience = getExperienceSnapshot(locale);
  const education = getEducationEntries(locale);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-0 px-6 py-10 md:py-12">
      <section className="grid items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="animate-fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">{site.name} · {site.location}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-6xl">{text.heroTitle}</h1>
          <p className="mt-4 max-w-2xl text-xl text-slate-700 dark:text-slate-200">{text.heroSubtitle}</p>
          <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">{getShortBio(locale)}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/${locale}/experience`} className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">{text.viewExperience}</Link>
            <Link href={`/${locale}/professional-profile`} className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-600 dark:border-slate-600 dark:text-slate-200">{text.profileButton}</Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="mx-auto w-fit rounded-full bg-gradient-to-b from-slate-200 to-slate-300 p-1.5 dark:from-slate-700 dark:to-slate-600">
            <div className="h-52 w-52 overflow-hidden rounded-full border-4 border-white shadow-xl dark:border-slate-900">
              <Image src="/profile.jpg" alt="Professional portrait of Carlos San Miguel Ortega" width={320} height={320} className="h-full w-full object-cover" priority />
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{text.toolsTitle}</p>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{text.toolsDesc}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {toolStack.map((tool) => (
                <SkillBadge key={tool} label={tool} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <SectionHeader eyebrow={locale === "es" ? "Experiencia" : "Experience"} title={text.experienceTitle} description={text.experienceDesc} />
        <div className="grid gap-6 md:grid-cols-2">
          {experience.map((item) => (
            <ExperienceSnapshotCard key={item.company} company={item.company} logo={item.logo} logoAlt={item.logoAlt} description={item.description} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-neutral-50 px-6 py-20 dark:bg-neutral-900">
        <SectionHeader eyebrow={locale === "es" ? "Capacidades" : "Capabilities"} title={text.capabilitiesTitle} description={text.capabilitiesDesc} />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {text.capabilities.map((capability) => (
            <article key={capability} className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">{capability}</article>
          ))}
        </div>
      </section>

      <section className="py-20">
        <SectionHeader eyebrow={locale === "es" ? "Proyectos" : "Projects"} title={text.projectsTitle} description={text.projectsDesc} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-neutral-50 px-6 py-20 dark:bg-neutral-900">
        <SectionHeader eyebrow={locale === "es" ? "Formacion" : "Education"} title={text.educationTitle} description={text.educationDesc} />
        <div className="grid gap-6 md:grid-cols-3">
          {education.map((entry) => (
            <article key={entry.title} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-slate-900">
              <div className="flex h-16 items-center justify-center rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                <Image src={entry.logo} alt={entry.logoAlt} width={180} height={36} className="max-h-full max-w-full object-contain" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">{entry.institutionType}</p>
              <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">{entry.institution}</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{entry.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="py-20">
        <SectionHeader eyebrow={text.thinkingTitle} title={text.thinkingTitle} description={text.thinkingDesc} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {text.thinkingCards.map((card) => (
            <article key={card.title} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-slate-900">
              <p className="text-xl">{card.icon}</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">{card.title}</h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-24">
        <SectionHeader eyebrow="Blog" title={text.blogTitle} description={text.blogDesc} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
