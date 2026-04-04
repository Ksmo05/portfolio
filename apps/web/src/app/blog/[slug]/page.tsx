import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogCard from "@/components/cards/BlogCard";
import { getAllPosts, getPostBySlug, getPostSlugs, getRelatedPosts } from "@/lib/blog";
import { buildMetadata } from "@/lib/metadata";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: "Post Not Found",
      description: "This article could not be found.",
      path: `/blog/${slug}`,
    });
  }

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.slug, post.tags, 3);
  const allPosts = await getAllPosts();
  const cards = relatedPosts
    .map((related) => allPosts.find((postItem) => postItem.slug === related.slug))
    .filter((postItem): postItem is NonNullable<typeof postItem> => Boolean(postItem));

  return (
    <div className="page-shell max-w-4xl space-y-10 py-14 md:py-20">
      <Link href="/blog" className="eyebrow-label text-sm font-medium hover:text-white">
        {"<- Back to Blog"}
      </Link>

      <article className="section-shell rounded-[2rem] p-8 md:p-10">
        {post.featuredImage ? (
          <div className="mb-8 overflow-hidden rounded-[1.5rem] border border-white/8">
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

        <p className="eyebrow-label text-[0.72rem] font-semibold uppercase">{post.category}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">{post.title}</h1>
        <p className="mt-4 text-sm uppercase tracking-[0.18em] text-slate-500">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          - {post.readingTime}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="pill-chip rounded-full px-3 py-1 text-xs font-medium">
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
        <h2 className="text-2xl font-semibold text-white">Related Posts</h2>
        <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.length === 0 ? (
            <p className="text-sm text-slate-300">No related posts available yet.</p>
          ) : (
            cards.map((card) => <BlogCard key={card.slug} post={card} />)
          )}
        </div>
      </section>
    </div>
  );
}
