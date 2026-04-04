import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ExperienceTimeline from "@/components/sections/ExperienceTimeline";
import SectionHeader from "@/components/sections/SectionHeader";
import { getExperienceEntries } from "@/lib/experience";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

const copy: Record<Locale, { eyebrow: string; title: string; desc: string; panel: string; btn1: string; btn2: string }> = {
  en: {
    eyebrow: "Experience",
    title: "Professional Experience",
    desc: "Experience across operations support, procurement workflows, reporting, incident handling and process coordination.",
    panel: "This timeline brings together roles focused on operational support, documentation, reporting, customer or user assistance and coordination across different business environments.",
    btn1: "View Professional Profile",
    btn2: "View Education",
  },
  es: {
    eyebrow: "Experiencia",
    title: "Experiencia Profesional",
    desc: "Experiencia en soporte operativo, workflows de compras, reporting, gestion de incidencias y coordinacion de procesos.",
    panel: "Esta cronologia reune roles centrados en soporte operativo, documentacion, reporting, atencion a usuarios o clientes y coordinacion en distintos entornos de negocio.",
    btn1: "Ver Perfil Profesional",
    btn2: "Ver Formacion",
  },
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildMetadata({
    title: locale === "es" ? "Experiencia Profesional | Carlos San Miguel" : "Professional Experience | Carlos San Miguel",
    description: copy[locale].desc,
    path: "/experience",
    locale,
  });
}

export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const text = copy[locale];
  const entries = getExperienceEntries(locale);

  return (
    <div className="page-shell space-y-10 py-14 md:py-20">
      <SectionHeader eyebrow={text.eyebrow} title={text.title} description={text.desc} />
      <ExperienceTimeline entries={entries} />
      <div className="section-shell rounded-[2rem] p-6 md:p-8">
        <p className="text-muted text-sm leading-7">{text.panel}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/${locale}/professional-profile`} className="button-primary rounded-full px-5 py-2.5 text-sm font-semibold">{text.btn1}</Link>
          <Link href={`/${locale}/education`} className="button-secondary rounded-full px-5 py-2.5 text-sm font-semibold">{text.btn2}</Link>
        </div>
      </div>
    </div>
  );
}

