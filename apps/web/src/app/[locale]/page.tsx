import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogCard from "@/components/cards/BlogCard";
import ExperienceSnapshotCard from "@/components/cards/ExperienceSnapshotCard";
import ProjectCard from "@/components/cards/ProjectCard";
import AIInboxSection from "@/components/sections/AIInboxSection";
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
    heroTitle: "Operations, data and digital support professional focused on process improvement, reporting and practical AI.",
    heroSubtitle: "Corporate operations, process coordination, dashboards and digital workflows with a practical business focus.",
    experienceTitle: "Professional Experience Snapshot",
    experienceDesc: "Experience across operations support, procurement workflows, reporting and process coordination.",
    capabilitiesTitle: "Operations, data and digital focus",
    capabilitiesDesc: "Core areas that define my current profile in corporate environments and practical digital work.",
    projectsTitle: "Applied Digital Projects",
    projectsDesc: "Selected initiatives that show how I use digital tools, structured information and practical AI to support communication and efficiency.",
    educationTitle: "Academic Background",
    educationDesc: "Education that supports a business-oriented view of operations, data and digital tools.",
    blogTitle: "Latest Insights",
    blogDesc: "Articles on dashboards, documentation, operations and practical uses of digital tools in business contexts.",
    thinkingTitle: "Current Areas of Interest",
    thinkingDesc: "Topics that connect my professional experience with practical digital improvement.",
    thinkingCards: [
      {
        icon: "OPS",
        title: "Operations and business processes",
        body: "I am interested in how clearer processes, better coordination and structured follow-up improve day-to-day execution.",
      },
      {
        icon: "DATA",
        title: "Data analysis and dashboards",
        body: "Dashboards, reporting and KPI tracking help make information easier to read and more useful for operational decisions.",
      },
      {
        icon: "TOOLS",
        title: "Digital tools and productivity",
        body: "I explore digital tools that help organize information, improve productivity and support smoother workflows.",
      },
      {
        icon: "AI",
        title: "Practical uses of AI",
        body: "My interest in AI is practical: better writing support, information organization and more efficient workflows in everyday work.",
      },
    ],
    toolsTitle: "Tools used in daily work",
    toolsDesc: "SAP, Qlik Sense and Excel support my work in operations, reporting follow-up and process visibility.",
    viewExperience: "View Experience",
    profileButton: "Professional Profile",
    capabilities: ["Operations", "Procurement support", "Reporting", "KPI / Dashboards", "Digital workflows"],
  },
  es: {
    heroTitle: "Profesional de operaciones, datos y soporte digital centrado en mejora de procesos, reporting e IA practica.",
    heroSubtitle: "Operaciones corporativas, coordinacion de procesos, dashboards y workflows digitales con un enfoque practico de negocio.",
    experienceTitle: "Resumen de Experiencia Profesional",
    experienceDesc: "Experiencia en soporte operativo, workflows de compras, reporting y coordinacion de procesos.",
    capabilitiesTitle: "Operaciones, datos y enfoque digital",
    capabilitiesDesc: "Areas clave que definen mi perfil actual en entornos corporativos y trabajo digital practico.",
    projectsTitle: "Proyectos Digitales Aplicados",
    projectsDesc: "Iniciativas seleccionadas que muestran como utilizo herramientas digitales, informacion estructurada e IA practica para apoyar comunicacion y eficiencia.",
    educationTitle: "Formacion Academica",
    educationDesc: "Formacion que respalda una vision de negocio aplicada a operaciones, datos y herramientas digitales.",
    blogTitle: "Ultimos Articulos",
    blogDesc: "Articulos sobre dashboards, documentacion, operaciones y usos practicos de herramientas digitales en contextos de negocio.",
    thinkingTitle: "Areas de Interes",
    thinkingDesc: "Temas que conectan mi experiencia profesional con la mejora digital practica.",
    thinkingCards: [
      {
        icon: "OPS",
        title: "Operaciones y procesos de negocio",
        body: "Me interesa como procesos mas claros, mejor coordinacion y seguimiento estructurado mejoran la ejecucion del trabajo diario.",
      },
      {
        icon: "DATA",
        title: "Analisis de datos y dashboards",
        body: "Los dashboards, el reporting y el seguimiento de KPI ayudan a leer mejor la informacion y a hacerla mas util para la gestion operativa.",
      },
      {
        icon: "TOOLS",
        title: "Herramientas digitales y productividad",
        body: "Exploro herramientas digitales que ayudan a organizar informacion, mejorar productividad y facilitar workflows mas fluidos.",
      },
      {
        icon: "AI",
        title: "Usos practicos de la IA",
        body: "Mi interes por la IA es practico: mejor apoyo a redaccion, organizacion de informacion y workflows mas eficientes en tareas cotidianas.",
      },
    ],
    toolsTitle: "Herramientas del trabajo diario",
    toolsDesc: "SAP, Qlik Sense y Excel apoyan mi trabajo en operaciones, seguimiento de reporting y visibilidad de procesos.",
    viewExperience: "Ver Experiencia",
    profileButton: "Perfil Profesional",
    capabilities: ["Operaciones", "Soporte a compras", "Reporting", "KPI / Dashboards", "Workflows digitales"],
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
    <div className="page-shell space-y-0 py-10 md:py-14">
      <section className="grid items-center gap-12 py-16 md:gap-16 md:py-24 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="animate-fade-up">
          <p className="eyebrow-label text-[0.72rem] font-semibold uppercase">{site.name} · {site.location}</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-white md:text-7xl md:leading-[0.96]">{text.heroTitle}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 md:text-2xl md:leading-9">{text.heroSubtitle}</p>
          <p className="text-muted mt-6 max-w-2xl text-base leading-8 md:text-lg">{getShortBio(locale)}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/${locale}/experience`} className="button-primary rounded-full px-5 py-3 text-sm font-semibold">{text.viewExperience}</Link>
            <Link href={`/${locale}/professional-profile`} className="button-secondary rounded-full px-5 py-3 text-sm font-semibold">{text.profileButton}</Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="mx-auto w-fit rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.03))] p-2 shadow-[0_30px_80px_-36px_rgba(2,6,23,0.95)]">
            <div className="h-56 w-56 overflow-hidden rounded-full border border-white/14 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] md:h-64 md:w-64">
              <Image src="/profile.jpg" alt="Professional portrait of Carlos San Miguel Ortega" width={320} height={320} className="h-full w-full object-cover" priority />
            </div>
          </div>
          <div className="section-shell rounded-[2rem] p-8">
            <p className="eyebrow-label text-[0.72rem] font-semibold uppercase">{text.toolsTitle}</p>
            <p className="text-muted mt-4 text-sm leading-6">{text.toolsDesc}</p>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {tools.map((tool) => (
                <div key={tool.slug} className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] p-3">
                  <div className="flex h-16 items-center justify-center rounded-[1rem] border border-white/8 bg-white/[0.03]">
                    <Image src={tool.logo} alt={`${tool.name} logo`} width={48} height={48} className="h-12 w-12 object-contain" />
                  </div>
                  <span className="mt-3 block text-xs font-medium text-slate-200">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AIInboxSection locale={locale} />

      <section className="py-20 md:py-24">
        <SectionHeader eyebrow={locale === "es" ? "Experiencia" : "Experience"} title={text.experienceTitle} description={text.experienceDesc} />
        <div className="grid gap-6 md:grid-cols-2">
          {experience.map((item) => (
            <ExperienceSnapshotCard key={item.company} company={item.company} logo={item.logo} logoAlt={item.logoAlt} description={item.description} />
          ))}
        </div>
      </section>

      <section className="section-shell-muted rounded-[2rem] px-6 py-20 md:px-8">
        <SectionHeader eyebrow={locale === "es" ? "Areas Clave" : "Key Areas"} title={text.capabilitiesTitle} description={text.capabilitiesDesc} />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {text.capabilities.map((capability) => (
            <article key={capability} className="card-surface-soft rounded-[1.35rem] p-5 text-sm font-medium text-slate-200">{capability}</article>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-24">
        <SectionHeader eyebrow={locale === "es" ? "Proyectos" : "Projects"} title={text.projectsTitle} description={text.projectsDesc} />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} />
          ))}
        </div>
      </section>

      <section className="section-shell-muted rounded-[2rem] px-6 py-20 md:px-8">
        <SectionHeader eyebrow={locale === "es" ? "Formacion" : "Education"} title={text.educationTitle} description={text.educationDesc} />
        <div className="grid gap-6 md:grid-cols-3">
          {education.map((entry) => (
            <article key={entry.title} className="card-surface-soft rounded-[1.6rem] p-6">
              <div className="flex h-16 items-center justify-center rounded-[1rem] border border-white/8 bg-white p-3 shadow-sm">
                <Image src={entry.logo} alt={entry.logoAlt} width={180} height={36} className="max-h-full max-w-full object-contain" />
              </div>
              <p className="eyebrow-label mt-4 text-[0.72rem] font-semibold uppercase">{entry.institutionType}</p>
              <p className="mt-2 text-sm font-medium text-slate-300">{entry.institution}</p>
              <h3 className="mt-3 text-lg font-semibold text-white">{entry.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-24">
        <SectionHeader eyebrow={text.thinkingTitle} title={text.thinkingTitle} description={text.thinkingDesc} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {text.thinkingCards.map((card) => (
            <article key={card.title} className="card-surface-soft rounded-[1.6rem] p-6">
              <p className="text-xl text-slate-300">{card.icon}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{card.title}</h3>
              <p className="text-muted mt-3 text-sm leading-6">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-28">
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
