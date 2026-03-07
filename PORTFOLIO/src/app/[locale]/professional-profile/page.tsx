import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SectionHeader from "@/components/sections/SectionHeader";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

const copy: Record<Locale, {
  eyebrow: string;
  title: string;
  desc: string;
  statement: string;
  statement2: string;
  focusTitle: string;
  focus: string[];
  industryTitle: string;
  industries: string[];
  educationTitle: string;
  education: string[];
  disclaimerTitle: string;
  disclaimer: string;
}> = {
  en: {
    eyebrow: "Portfolio Purpose",
    title: "Professional Profile",
    desc: "A structured presentation of experience, education, and operational capabilities.",
    statement: "This website presents an overview of my professional experience, operational projects, and academic background.",
    statement2: "It serves as a structured representation of my work across business operations, purchasing coordination, reporting systems, and process-oriented environments.",
    focusTitle: "Professional Focus",
    focus: ["Digital operations", "Purchasing operations", "Operational reporting and dashboards", "Vendor coordination", "Business support processes", "Documentation and operational control"],
    industryTitle: "Industry Experience",
    industries: ["Automotive consulting projects", "Energy sector operations", "Public administration procurement", "Banking customer support operations"],
    educationTitle: "Education",
    education: ["Bachelor's Degree in Business Administration", "Higher Technician in Network Systems Administration (ASIR)", "University studies in Cybersecurity, Artificial Intelligence and Big Data"],
    disclaimerTitle: "Disclaimer",
    disclaimer: "This website is intended as a professional portfolio demonstrating experience, projects, and academic background rather than a direct contact channel.",
  },
  es: {
    eyebrow: "Proposito del Portfolio",
    title: "Perfil Profesional",
    desc: "Presentacion estructurada de experiencia, formacion y capacidades operativas.",
    statement: "Este sitio web presenta una vision general de mi experiencia profesional, proyectos operativos y trayectoria academica.",
    statement2: "Sirve como representacion estructurada de mi trabajo en operaciones de negocio, coordinacion de compras, sistemas de reporting y entornos orientados a procesos.",
    focusTitle: "Enfoque Profesional",
    focus: ["Operaciones digitales", "Operaciones de compras", "Reporting operativo y dashboards", "Coordinacion de proveedores", "Procesos de soporte de negocio", "Documentacion y control operativo"],
    industryTitle: "Experiencia Sectorial",
    industries: ["Proyectos de consultoria en automocion", "Operaciones en sector energetico", "Contratacion publica en administracion", "Operaciones de soporte al cliente en banca"],
    educationTitle: "Formacion",
    education: ["Grado en Administracion y Direccion de Empresas", "Tecnico Superior en Administracion de Sistemas en Red (ASIR)", "Estudios universitarios en Ciberseguridad, Inteligencia Artificial y Big Data"],
    disclaimerTitle: "Aviso",
    disclaimer: "Este sitio web esta concebido como portfolio profesional para mostrar experiencia, proyectos y formacion academica, y no como canal directo de contacto.",
  },
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildMetadata({
    title: locale === "es" ? "Perfil Profesional | Carlos San Miguel Ortega" : "Professional Profile | Carlos San Miguel Ortega",
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
        <h2 className="text-2xl font-semibold">{locale === "es" ? "Declaracion Profesional" : "Professional Statement"}</h2>
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
        <h2 className="text-2xl font-semibold">{text.industryTitle}</h2>
        <ul className="mt-4 space-y-2 text-slate-600 dark:text-slate-300">
          {text.industries.map((item) => (
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
        <h2 className="text-xl font-semibold">{text.disclaimerTitle}</h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{text.disclaimer}</p>
      </section>
    </div>
  );
}
