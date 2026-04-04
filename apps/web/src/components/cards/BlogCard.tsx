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
    <article className="card-surface group rounded-[1.75rem] p-6 transition hover:-translate-y-1.5 hover:border-white/18 hover:shadow-[0_34px_90px_-48px_rgba(2,6,23,1)]">
      {post.featuredImage ? (
        <div className="mb-6 overflow-hidden rounded-[1.25rem] border border-white/8">
          <Image
            src={post.featuredImage}
            alt={post.title}
            width={1200}
            height={675}
            className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
          />
        </div>
      ) : null}

      <p className="eyebrow-label text-[0.72rem] font-medium uppercase">{post.category}</p>
      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">{post.title}</h3>
      <p className="text-muted mt-4 text-sm leading-6">{post.description}</p>
      <p className="mt-5 text-xs uppercase tracking-[0.18em] text-slate-500">
        {new Date(post.date).toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        {post.readingTime ? ` · ${post.readingTime}` : ""}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={`${post.slug}-${tag}`} className="pill-chip rounded-full px-2.5 py-1 text-xs">
            {tag}
          </span>
        ))}
      </div>
      <Link
        href={`/${locale}/blog/${post.slug}`}
        className="button-secondary mt-7 inline-flex rounded-full px-4 py-2.5 text-sm font-medium"
      >
        {labels[locale].read}
      </Link>
    </article>
  );
}
