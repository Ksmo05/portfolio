import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogFilter from "@/components/blog/BlogFilter";
import SectionHeader from "@/components/sections/SectionHeader";
import { getAllPostMeta, getBlogFilters } from "@/lib/blog";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ locale: string }> };

const copy: Record<Locale, { title: string; desc: string; eyebrow: string; pageTitle: string }> = {
  en: {
    pageTitle: "Blog",
    eyebrow: "Knowledge Hub",
    title: "Operations and Reporting Blog",
    desc: "Practical articles for professionals improving operational visibility, KPI communication, and process coordination across business teams.",
  },
  es: {
    pageTitle: "Blog",
    eyebrow: "Repositorio de Conocimiento",
    title: "Blog de Operaciones y Reporting",
    desc: "Articulos practicos para profesionales que mejoran visibilidad operativa, comunicacion KPI y coordinacion de procesos.",
  },
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return buildMetadata({
    title: copy[locale].pageTitle,
    description: copy[locale].desc,
    path: "/blog",
    locale,
  });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const posts = getAllPostMeta(locale);
  const { tags, categories } = await getBlogFilters(locale);
  const text = copy[locale];

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-14 md:py-20">
      <SectionHeader eyebrow={text.eyebrow} title={text.title} description={text.desc} />
      <BlogFilter posts={posts} tags={tags} categories={categories} locale={locale} />
    </div>
  );
}
