import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogCard from "@/components/cards/BlogCard";
import { getAllPosts, getPostBySlug, getPostSlugs, getRelatedPosts } from "@/lib/blog";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const copy: Record<Locale, { back: string; related: string; none: string }> = {
  en: { back: "<- Back to Blog", related: "Related Posts", none: "No related posts available yet." },
  es: { back: "<- Volver al Blog", related: "Articulos Relacionados", none: "No hay articulos relacionados por el momento." },
};

export async function generateStaticParams() {
  return locales.flatMap((locale) => getPostSlugs(locale).map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const post = await getPostBySlug(locale, slug);
  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
    locale,
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const post = await getPostBySlug(locale, slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(locale, post.slug, post.tags, 3);
  const allPosts = await getAllPosts(locale);
  const cards = relatedPosts
    .map((related) => allPosts.find((postItem) => postItem.slug === related.slug))
    .filter((postItem): postItem is NonNullable<typeof postItem> => Boolean(postItem));

  const text = copy[locale];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-10 px-6 py-14 md:py-20">
      <Link href={`/${locale}/blog`} className="text-sm font-medium text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-100">
        {text.back}
      </Link>

      <article className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-900">
        {post.featuredImage ? (
          <div className="mb-8 overflow-hidden rounded-2xl">
            <Image
              src={post.featuredImage}
              alt={post.title}
              width={1600}
              height={900}
              className="h-auto w-full object-cover"
              sizes="(min-width: 1280px) 768px, (min-width: 768px) 90vw, 100vw"
            />
          </div>
        ) : null}

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">{post.category}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">{post.title}</h1>
        <p className="mt-4 text-sm text-slate-700 dark:text-slate-300">
          {new Date(post.date).toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          - {post.readingTime}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {tag}
            </span>
          ))}
        </div>
        <div
          className="prose prose-lg prose-custom mx-auto mt-8 max-w-3xl leading-relaxed text-white dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <section>
        <h2 className="text-2xl font-semibold">{text.related}</h2>
        <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.length === 0 ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">{text.none}</p>
          ) : (
            cards.map((card) => <BlogCard key={card.slug} post={card} locale={locale} />)
          )}
        </div>
      </section>
    </div>
  );
}
