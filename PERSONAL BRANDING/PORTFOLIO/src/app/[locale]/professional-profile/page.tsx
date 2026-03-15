import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SectionHeader from "@/components/sections/SectionHeader";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

const copy: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    desc: string;
    statementTitle: string;
    statement: string;
    statement2: string;
    focusTitle: string;
    focus: string[];
    contextTitle: string;
    context: string[];
    educationTitle: string;
    education: string[];
    closingTitle: string;
    closing: string;
  }
> = {
  en: {
    eyebrow: "Professional Profile",
    title: "Operations, Data & Digital Projects",
    desc: "A professional profile focused on operations, data, digital tools and practical uses of technology.",
    statementTitle: "About",
    statement:
      "I work in operations and consulting environments supporting Purchasing and Aftersales processes, with experience in data analysis, vendor management and KPI tracking using tools such as SAP, Qlik Sense and Excel.",
    statement2:
      "Alongside my professional work, I explore digital tools, web content and AI-assisted workflows through personal projects. I am especially interested in how technology can improve processes, productivity and information management.",
    focusTitle: "Focus Areas",
    focus: [
      "Operations and business processes",
      "Purchasing and vendor coordination",
      "Data analysis and KPI dashboards",
      "Process digitalization",
      "Digital tools and web content",
      "Practical uses of AI for productivity",
    ],
    contextTitle: "Professional Context",
    context: [
      "Consulting support for Purchasing and Aftersales processes",
      "Data tracking, KPI follow-up and reporting in business environments",
      "Experience across automotive consulting, energy operations, public procurement and banking support",
      "Personal interest in digital tools, web content and practical AI workflows",
    ],
    educationTitle: "Education",
    education: [
      "Bachelor's Degree in Business Administration",
      "Higher Technician in Network Systems Administration (ASIR)",
      "University studies in Cybersecurity, Artificial Intelligence and Big Data",
    ],
    closingTitle: "Positioning",
    closing:
      "This portfolio presents a profile built around operations, data, process improvement and personal digital projects, with a practical interest in how technology can support everyday work.",
  },
  es: {
    eyebrow: "Perfil Profesional",
    title: "Operaciones, Datos y Proyectos Digitales",
    desc: "Perfil profesional centrado en operaciones, datos, herramientas digitales y usos practicos de la tecnologia.",
    statementTitle: "Sobre mi",
    statement:
      "Trabajo en entornos de operaciones y consultoria dando soporte a procesos de Purchasing y Aftersales, con experiencia en analisis de datos, gestion de proveedores y seguimiento de KPI mediante herramientas como SAP, Qlik Sense y Excel.",
    statement2:
      "Paralelamente exploro herramientas digitales, contenido web y flujos de trabajo asistidos por IA a traves de proyectos personales. Me interesa especialmente como la tecnologia puede mejorar procesos, productividad y gestion de la informacion.",
    focusTitle: "Areas de Enfoque",
    focus: [
      "Operaciones y procesos de negocio",
      "Compras y coordinacion de proveedores",
      "Analisis de datos y dashboards KPI",
      "Digitalizacion de procesos",
      "Herramientas digitales y contenido web",
      "Usos practicos de la IA para productividad",
    ],
    contextTitle: "Contexto Profesional",
    context: [
      "Soporte de consultoria para procesos de Purchasing y Aftersales",
      "Seguimiento de datos, KPI y reporting en entornos de negocio",
      "Experiencia en consultoria de automocion, operaciones energeticas, contratacion publica y soporte bancario",
      "Interes personal en herramientas digitales, contenido web y flujos practicos de IA",
    ],
    educationTitle: "Formacion",
    education: [
      "Grado en Administracion y Direccion de Empresas",
      "Tecnico Superior en Administracion de Sistemas en Red (ASIR)",
      "Estudios universitarios en Ciberseguridad, Inteligencia Artificial y Big Data",
    ],
    closingTitle: "Posicionamiento",
    closing:
      "Este portfolio presenta un perfil construido alrededor de operaciones, datos, mejora de procesos y proyectos digitales personales, con un interes practico por como la tecnologia puede apoyar el trabajo del dia a dia.",
  },
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildMetadata({
    title: locale === "es" ? "Perfil Profesional | Carlos San Miguel" : "Professional Profile | Carlos San Miguel",
    description: copy[locale].desc,
    path: "/professional-profile",
    locale,
  });
}

export default async function ProfessionalProfilePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const text = copy[locale];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-12 px-6 py-14 md:py-20">
      <SectionHeader eyebrow={text.eyebrow} title={text.title} description={text.desc} />

      <section className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold">{text.statementTitle}</h2>
        <p className="mt-4 text-slate-600 dark:text-slate-300">{text.statement}</p>
        <p className="mt-3 text-slate-600 dark:text-slate-300">{text.statement2}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold">{text.focusTitle}</h2>
        <ul className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-2">
          {text.focus.map((item) => (
            <li key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold">{text.contextTitle}</h2>
        <ul className="mt-4 space-y-2 text-slate-600 dark:text-slate-300">
          {text.context.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold">{text.educationTitle}</h2>
        <ul className="mt-4 space-y-2 text-slate-600 dark:text-slate-300">
          {text.education.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-7 dark:border-slate-700 dark:bg-slate-800/60">
        <h2 className="text-xl font-semibold">{text.closingTitle}</h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{text.closing}</p>
      </section>
    </div>
  );
}

