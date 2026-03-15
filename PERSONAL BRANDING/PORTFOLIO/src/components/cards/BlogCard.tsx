import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/blog";
import type { Locale } from "@/lib/i18n";

type BlogCardProps = {
  post: PostMeta & { readingTime?: string };
  locale?: Locale;
};

const labels: Record<Locale, { read: string }> = {
  en: { read: "Read Article" },
  es: { read: "Leer Articulo" },
};

export default function BlogCard({ post, locale = "en" }: BlogCardProps) {
  return (
    <article className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-slate-900">
      {post.featuredImage ? (
        <div className="mb-5 overflow-hidden rounded-xl">
          <Image
            src={post.featuredImage}
            alt={post.title}
            width={1200}
            height={675}
            className="h-auto w-full object-cover"
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
          />
        </div>
      ) : null}

      <p className="text-xs font-medium uppercase tracking-[0.12em] text-sky-700 dark:text-sky-300">{post.category}</p>
      <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{post.title}</h3>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{post.description}</p>
      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        {new Date(post.date).toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        {post.readingTime ? ` · ${post.readingTime}` : ""}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={`${post.slug}-${tag}`} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {tag}
          </span>
        ))}
      </div>
      <Link
        href={`/${locale}/blog/${post.slug}`}
        className="mt-6 inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-900 dark:border-slate-600 dark:text-slate-200 dark:hover:border-white"
      >
        {labels[locale].read}
      </Link>
    </article>
  );
}
