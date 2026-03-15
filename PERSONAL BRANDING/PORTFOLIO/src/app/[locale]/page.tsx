import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogCard from "@/components/cards/BlogCard";
import ExperienceSnapshotCard from "@/components/cards/ExperienceSnapshotCard";
import ProjectCard from "@/components/cards/ProjectCard";
import SectionHeader from "@/components/sections/SectionHeader";
import { getAllPosts } from "@/lib/blog";
import { getEducationEntries } from "@/lib/education";
import { getExperienceSnapshot } from "@/lib/experience";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/metadata";
import { getProjects } from "@/lib/projects";
import { getShortBio, getSiteConfig } from "@/lib/site";
import { tools } from "@/lib/tools";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const copy: Record<
  Locale,
  {
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
  }
> = {
  en: {
    heroTitle: "Operations and data professional exploring digital projects, process optimization and practical applications of AI.",
    heroSubtitle: "Purchasing, KPI tracking and digital tools with a practical business focus.",
    experienceTitle: "Professional Experience Snapshot",
    experienceDesc: "Experience across operations, purchasing support, KPI follow-up and process coordination.",
    capabilitiesTitle: "Operations, data and digital focus",
    capabilitiesDesc: "Core areas that define my current profile and the direction I am developing.",
    projectsTitle: "Personal Digital Projects",
    projectsDesc: "Personal and exploratory projects related to digital tools, web content, productivity and practical uses of AI.",
    educationTitle: "Academic Background",
    educationDesc: "Education that supports a business-oriented view of operations, data and digital tools.",
    blogTitle: "Latest Insights",
    blogDesc: "Articles on dashboards, documentation, operations and practical uses of digital tools in business contexts.",
    thinkingTitle: "Current Areas of Interest",
    thinkingDesc: "Topics that connect my professional experience with my personal digital exploration.",
    thinkingCards: [
      {
        icon: "OPS",
        title: "Operations and business processes",
        body: "I am interested in how clearer processes, better coordination and structured follow-up improve day-to-day execution.",
      },
      {
        icon: "DATA",
        title: "Data analysis and dashboards",
        body: "Dashboards and KPI tracking help make information easier to read and more useful for operational decisions.",
      },
      {
        icon: "TOOLS",
        title: "Digital tools and productivity",
        body: "I explore digital tools that help organize information, improve productivity and make work more manageable.",
      },
      {
        icon: "AI",
        title: "Practical uses of AI",
        body: "My interest in AI is practical: content support, information organization and more efficient workflows in everyday work.",
      },
    ],
    toolsTitle: "Tools used in daily work",
    toolsDesc: "SAP, Qlik Sense and Excel are central to my work in operations, data follow-up and process visibility.",
    viewExperience: "View Experience",
    profileButton: "Professional Profile",
    capabilities: ["Operations", "Purchasing", "Data analysis", "KPI / Dashboards", "Process digitalization"],
  },
  es: {
    heroTitle: "Profesional de operaciones y datos explorando proyectos digitales, optimizacion de procesos y aplicaciones practicas de IA.",
    heroSubtitle: "Compras, seguimiento de KPI y herramientas digitales con un enfoque practico de negocio.",
    experienceTitle: "Resumen de Experiencia Profesional",
    experienceDesc: "Experiencia en operaciones, soporte a compras, seguimiento de KPI y coordinacion de procesos.",
    capabilitiesTitle: "Operaciones, datos y enfoque digital",
    capabilitiesDesc: "Areas clave que definen mi perfil actual y la direccion en la que estoy evolucionando.",
    projectsTitle: "Proyectos Digitales Personales",
    projectsDesc: "Proyectos personales y exploratorios relacionados con herramientas digitales, contenido web, productividad y usos practicos de la IA.",
    educationTitle: "Formacion Academica",
    educationDesc: "Formacion que respalda una vision de negocio aplicada a operaciones, datos y herramientas digitales.",
    blogTitle: "Ultimos Articulos",
    blogDesc: "Articulos sobre dashboards, documentacion, operaciones y usos practicos de herramientas digitales en contextos de negocio.",
    thinkingTitle: "Areas de Interes",
    thinkingDesc: "Temas que conectan mi experiencia profesional con mi exploracion digital personal.",
    thinkingCards: [
      {
        icon: "OPS",
        title: "Operaciones y procesos de negocio",
        body: "Me interesa como procesos mas claros, mejor coordinacion y seguimiento estructurado mejoran la ejecucion del trabajo diario.",
      },
      {
        icon: "DATA",
        title: "Analisis de datos y dashboards",
        body: "Los dashboards y el seguimiento de KPI ayudan a leer mejor la informacion y a hacerla mas util para la gestion operativa.",
      },
      {
        icon: "TOOLS",
        title: "Herramientas digitales y productividad",
        body: "Exploro herramientas digitales que ayudan a organizar informacion, mejorar productividad y hacer el trabajo mas manejable.",
      },
      {
        icon: "AI",
        title: "Usos practicos de la IA",
        body: "Mi interes por la IA es practico: apoyo al contenido, organizacion de informacion y flujos de trabajo mas eficientes en tareas cotidianas.",
      },
    ],
    toolsTitle: "Herramientas del trabajo diario",
    toolsDesc: "SAP, Qlik Sense y Excel son herramientas centrales en mi trabajo de operaciones, seguimiento de datos y visibilidad de procesos.",
    viewExperience: "Ver Experiencia",
    profileButton: "Perfil Profesional",
    capabilities: ["Operaciones", "Compras", "Analisis de datos", "KPI / Dashboards", "Digitalizacion de procesos"],
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
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {tools.map((tool) => (
                <div key={tool.slug} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2">
                  <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-white/5 border border-white/10">
                    <Image src={tool.logo} alt={`${tool.name} logo`} width={48} height={48} className="w-12 h-12 object-contain" />
                  </div>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{tool.name}</span>
                </div>
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
        <SectionHeader eyebrow={locale === "es" ? "Areas Clave" : "Key Areas"} title={text.capabilitiesTitle} description={text.capabilitiesDesc} />
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

