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
    title: "Operations, Data & Practical Digital Support",
    desc: "A professional profile focused on corporate operations, reporting, process support and practical uses of digital tools.",
    statementTitle: "About",
    statement:
      "I work in corporate and consulting environments supporting operations, Purchasing and Aftersales processes. My experience includes SAP support, reporting follow-up, incident handling, coordination and KPI visibility using tools such as SAP, Qlik Sense and Excel.",
    statement2:
      "Alongside my professional work, I explore digital tools and practical AI workflows through personal initiatives focused on communication, information organization and productivity. My interest is applied and business-oriented rather than purely technical.",
    focusTitle: "Focus Areas",
    focus: [
      "Operations and business processes",
      "Procurement support and workflow coordination",
      "Reporting, data follow-up and KPI dashboards",
      "Documentation control and structured support",
      "Digital tools for communication and productivity",
      "Practical uses of AI for productivity",
    ],
    contextTitle: "Professional Context",
    context: [
      "Support for Purchasing and Aftersales processes in a corporate environment linked to BMW",
      "Experience in reporting, SAP support, process follow-up and issue coordination",
      "Background across automotive, energy operations, public procurement, banking support and technical operations",
      "Practical interest in digital tools and AI to improve productivity and information flows",
    ],
    educationTitle: "Education",
    education: [
      "Bachelor's Degree in Business Administration",
      "Higher Technician in Network Systems Administration (ASIR)",
      "University studies in Cybersecurity, Artificial Intelligence and Big Data",
    ],
    closingTitle: "Positioning",
    closing:
      "This portfolio presents a profile built around operations, reporting, process support and practical digital improvement, with AI used as a tool for productivity rather than as the center of the profile.",
  },
  es: {
    eyebrow: "Perfil Profesional",
    title: "Operaciones, Datos y Soporte Digital Practico",
    desc: "Perfil profesional centrado en operaciones corporativas, reporting, soporte a procesos y usos practicos de herramientas digitales.",
    statementTitle: "Sobre mi",
    statement:
      "Trabajo en entornos corporativos y de consultoria dando soporte a operaciones y a procesos de Purchasing y Aftersales. Mi experiencia incluye soporte SAP, seguimiento de reporting, gestion de incidencias, coordinacion y visibilidad de KPI mediante herramientas como SAP, Qlik Sense y Excel.",
    statement2:
      "Paralelamente exploro herramientas digitales y flujos practicos de IA a traves de iniciativas personales centradas en comunicacion, organizacion de informacion y productividad. Mi interes es aplicado y orientado a negocio, no puramente tecnico.",
    focusTitle: "Areas de Enfoque",
    focus: [
      "Operaciones y procesos de negocio",
      "Soporte a compras y coordinacion de workflows",
      "Reporting, seguimiento de datos y dashboards KPI",
      "Control documental y soporte estructurado",
      "Herramientas digitales para comunicacion y productividad",
      "Usos practicos de la IA para productividad",
    ],
    contextTitle: "Contexto Profesional",
    context: [
      "Soporte a procesos de Purchasing y Aftersales en un entorno corporativo vinculado a BMW",
      "Experiencia en reporting, soporte SAP, seguimiento de procesos y coordinacion de incidencias",
      "Trayectoria en automocion, operaciones energeticas, contratacion publica, soporte bancario y operaciones tecnicas",
      "Interes practico en herramientas digitales e IA para mejorar productividad y flujos de informacion",
    ],
    educationTitle: "Formacion",
    education: [
      "Grado en Administracion y Direccion de Empresas",
      "Tecnico Superior en Administracion de Sistemas en Red (ASIR)",
      "Estudios universitarios en Ciberseguridad, Inteligencia Artificial y Big Data",
    ],
    closingTitle: "Posicionamiento",
    closing:
      "Este portfolio presenta un perfil construido alrededor de operaciones, reporting, soporte a procesos y mejora digital practica, con la IA utilizada como herramienta de productividad y no como centro del perfil.",
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

