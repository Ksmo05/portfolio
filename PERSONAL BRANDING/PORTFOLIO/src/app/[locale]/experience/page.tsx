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
    desc: "Experience across operations, purchasing support, data follow-up, reporting and process coordination.",
    panel: "This timeline brings together roles that connect operations, process support, data follow-up and exposure to different business environments.",
    btn1: "View Professional Profile",
    btn2: "View Education",
  },
  es: {
    eyebrow: "Experiencia",
    title: "Experiencia Profesional",
    desc: "Experiencia en operaciones, soporte a compras, seguimiento de datos, reporting y coordinacion de procesos.",
    panel: "Esta cronologia reune roles que conectan operaciones, soporte a procesos, seguimiento de datos y experiencia en distintos entornos de negocio.",
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
    <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-14 md:py-20">
      <SectionHeader eyebrow={text.eyebrow} title={text.title} description={text.desc} />
      <ExperienceTimeline entries={entries} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm text-slate-600 dark:text-slate-300">{text.panel}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={`/${locale}/professional-profile`} className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">{text.btn1}</Link>
          <Link href={`/${locale}/education`} className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-600 dark:border-slate-600 dark:text-slate-200">{text.btn2}</Link>
        </div>
      </div>
    </div>
  );
}

