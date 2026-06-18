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
    title: "Procurement Operations, KPI Reporting & Practical Digital Delivery",
    desc: "A professional profile focused on purchasing operations, reporting, supplier governance and practical digital tools.",
    statementTitle: "About",
    statement:
      "I work in corporate and consulting environments focused on purchasing operations and procurement support. My experience includes KPI monitoring, reporting, supplier governance, audits, compliance follow-up and operational support through tools such as SAP, Coupa, Qlik Sense and Excel.",
    statement2:
      "Alongside my professional work, I explore practical digital tools and AI-supported workflows through initiatives focused on communication, information organization and productivity. My interest is applied, business-oriented and useful in real operations contexts.",
    focusTitle: "Focus Areas",
    focus: [
      "Purchasing operations and procurement process support",
      "KPI monitoring, reporting and operational analytics",
      "Supplier governance, audits and compliance follow-up",
      "Workflow coordination and issue resolution",
      "Digital tools for communication and productivity",
      "Practical uses of AI for productivity",
    ],
    contextTitle: "Professional Context",
    context: [
      "Current purchasing operations scope across Spain and Portugal in a BMW-related environment",
      "Experience in reporting, SAP and Coupa support, process follow-up and issue coordination",
      "Background across automotive, energy operations, public procurement, banking support and technical operations",
      "Practical interest in digital tools and AI to improve productivity, information flow and execution clarity",
    ],
    educationTitle: "Education",
    education: [
      "Bachelor's Degree in Business Administration",
      "Higher Technician in Network Systems Administration (ASIR)",
      "Additional certifications in Generative AI and AI integration for business strategy",
    ],
    closingTitle: "Positioning",
    closing:
      "This portfolio presents a profile built around procurement operations, KPI visibility, process optimization and practical digital improvement, with AI used as a productivity enabler rather than as the center of the profile.",
  },
  es: {
    eyebrow: "Perfil Profesional",
    title: "Operaciones de Procurement, Reporting KPI y Entrega Digital Practica",
    desc: "Perfil profesional centrado en operaciones de compras, reporting, supplier governance y uso practico de herramientas digitales.",
    statementTitle: "Sobre mi",
    statement:
      "Trabajo en entornos corporativos y de consultoria centrado en operaciones de purchasing y soporte a procurement. Mi experiencia incluye seguimiento de KPI, reporting, supplier governance, auditorias, compliance y soporte operativo mediante herramientas como SAP, Coupa, Qlik Sense y Excel.",
    statement2:
      "Paralelamente exploro herramientas digitales y flujos de trabajo apoyados en IA a traves de iniciativas centradas en comunicacion, organizacion de informacion y productividad. Mi interes es aplicado, orientado a negocio y util en contextos operativos reales.",
    focusTitle: "Areas de Enfoque",
    focus: [
      "Operaciones de purchasing y soporte a procesos de procurement",
      "Seguimiento de KPI, reporting y analitica operativa",
      "Supplier governance, auditorias y seguimiento de compliance",
      "Coordinacion de workflows y resolucion de incidencias",
      "Herramientas digitales para comunicacion y productividad",
      "Usos practicos de la IA para productividad",
    ],
    contextTitle: "Contexto Profesional",
    context: [
      "Alcance actual de operaciones de purchasing en Espana y Portugal dentro de un entorno vinculado a BMW",
      "Experiencia en reporting, soporte SAP y Coupa, seguimiento de procesos y coordinacion de incidencias",
      "Trayectoria en automocion, operaciones energeticas, contratacion publica, soporte bancario y operaciones tecnicas",
      "Interes practico en herramientas digitales e IA para mejorar productividad, flujo de informacion y claridad operativa",
    ],
    educationTitle: "Formacion",
    education: [
      "Grado en Administracion y Direccion de Empresas",
      "Tecnico Superior en Administracion de Sistemas en Red (ASIR)",
      "Certificaciones complementarias en IA generativa e integracion de IA en estrategia empresarial",
    ],
    closingTitle: "Posicionamiento",
    closing:
      "Este portfolio presenta un perfil construido alrededor de operaciones de procurement, visibilidad KPI, optimizacion de procesos y mejora digital practica, con la IA utilizada como palanca de productividad y no como centro del perfil.",
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
    <div className="page-shell max-w-5xl space-y-12 py-14 md:py-20">
      <SectionHeader eyebrow={text.eyebrow} title={text.title} description={text.desc} />

      <section className="section-shell rounded-[2rem] p-7 md:p-8">
        <h2 className="text-2xl font-semibold text-white">{text.statementTitle}</h2>
        <p className="text-muted mt-4 leading-7">{text.statement}</p>
        <p className="text-muted mt-3 leading-7">{text.statement2}</p>
      </section>

      <section className="section-shell rounded-[2rem] p-7 md:p-8">
        <h2 className="text-2xl font-semibold text-white">{text.focusTitle}</h2>
        <ul className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
          {text.focus.map((item) => (
            <li key={item} className="card-surface-soft rounded-[1.2rem] px-4 py-3">{item}</li>
          ))}
        </ul>
      </section>

      <section className="section-shell rounded-[2rem] p-7 md:p-8">
        <h2 className="text-2xl font-semibold text-white">{text.contextTitle}</h2>
        <ul className="text-muted mt-4 space-y-2 leading-7">
          {text.context.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="section-shell rounded-[2rem] p-7 md:p-8">
        <h2 className="text-2xl font-semibold text-white">{text.educationTitle}</h2>
        <ul className="text-muted mt-4 space-y-2 leading-7">
          {text.education.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="section-shell-muted rounded-[2rem] p-7 md:p-8">
        <h2 className="text-xl font-semibold text-white">{text.closingTitle}</h2>
        <p className="text-muted mt-3 text-sm leading-7">{text.closing}</p>
      </section>
    </div>
  );
}

