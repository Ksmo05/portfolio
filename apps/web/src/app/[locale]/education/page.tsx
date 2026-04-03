import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import SectionHeader from "@/components/sections/SectionHeader";
import { getEducationEntries } from "@/lib/education";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

const copy: Record<Locale, { eyebrow: string; title: string; desc: string }> = {
  en: {
    eyebrow: "Academic Background",
    title: "Education",
    desc: "Formal education and continuing studies that support structured operational thinking and analytical execution.",
  },
  es: {
    eyebrow: "Trayectoria Academica",
    title: "Formacion",
    desc: "Formacion reglada y estudios complementarios que respaldan pensamiento operativo estructurado y ejecucion analitica.",
  },
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return buildMetadata({
    title: locale === "es" ? "Formacion | Carlos San Miguel Ortega" : "Education | Carlos San Miguel Ortega",
    description: copy[locale].desc,
    path: "/education",
    locale,
  });
}

export default async function EducationPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const text = copy[locale];
  const entries = getEducationEntries(locale);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-14 md:py-20">
      <SectionHeader eyebrow={text.eyebrow} title={text.title} description={text.desc} />

      <div className="grid gap-6 md:grid-cols-3">
        {entries.map((entry) => (
          <article key={entry.title} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-slate-900">
            <div className="bg-white rounded-lg p-3 flex items-center justify-center h-16">
              <Image src={entry.logo} alt={entry.logoAlt} width={240} height={64} className="object-contain max-h-full max-w-full h-full w-auto" />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">{entry.institutionType}</p>
            <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">{entry.institution}</p>
            <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{entry.title}</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{entry.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
