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
    <div className="page-shell space-y-10 py-14 md:py-20">
      <SectionHeader eyebrow={text.eyebrow} title={text.title} description={text.desc} />

      <div className="grid gap-6 md:grid-cols-3">
        {entries.map((entry) => (
          <article key={entry.title} className="card-surface rounded-[1.6rem] p-6">
            <div className="flex h-16 items-center justify-center rounded-[1rem] bg-white p-3">
              <Image src={entry.logo} alt={entry.logoAlt} width={240} height={64} className="object-contain max-h-full max-w-full h-full w-auto" />
            </div>
            <p className="eyebrow-label mt-4 text-[0.72rem] font-semibold uppercase">{entry.institutionType}</p>
            <p className="mt-2 text-sm font-medium text-slate-300">{entry.institution}</p>
            <h2 className="mt-3 text-lg font-semibold text-white">{entry.title}</h2>
            <p className="text-muted mt-3 text-sm leading-6">{entry.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
