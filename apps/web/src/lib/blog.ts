import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { defaultLocale, type Locale } from "@/lib/i18n";

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  featuredImage: string;
};

export type Post = PostMeta & {
  content: string;
  readingTime: string;
};

function getBlogDirectory(locale: Locale) {
  return path.join(process.cwd(), "src", "content", "blog", locale);
}

function estimateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}

function getHeadingIcon(headingText: string): string {
  const text = headingText.toLowerCase();

  if (/(dashboard|kpi|metric|analytics|reporting)/.test(text)) return "📊";
  if (/(process|system|workflow|sap|governance|implementation)/.test(text)) return "⚙️";
  if (/(insight|recommendation|best practice|guideline|tip)/.test(text)) return "💡";
  if (/(takeaway|summary|final recommendation|operational impact|key)/.test(text)) return "📌";
  if (/(why|concept|explanation|understand|importance)/.test(text)) return "🧠";

  return "";
}

function decorateHeadingsAndCallouts(htmlContent: string): string {
  const withIcons = htmlContent.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (match, level, inner) => {
    const plainText = inner.replace(/<[^>]*>/g, "").trim();
    const icon = getHeadingIcon(plainText);
    if (!icon || plainText.startsWith(icon)) return match;
    return `<h${level}>${icon} ${inner}</h${level}>`;
  });

  return withIcons.replace(/<blockquote>\s*<p>\s*\[!(INSIGHT|TIP)\]\s*([\s\S]*?)<\/p>\s*<\/blockquote>/gi, (_match, type, body) => {
    const normalizedType = String(type).toUpperCase();
    const title = normalizedType === "TIP" ? "📌 Tip" : "💡 Insight";
    const content = String(body).trim();
    return `<div class="callout-box"><p class="callout-title">${title}</p><p>${content}</p></div>`;
  });
}

export function getPostSlugs(locale: Locale = defaultLocale): string[] {
  const blogDirectory = getBlogDirectory(locale);

  return fs
    .readdirSync(blogDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

export async function getPostBySlug(localeOrSlug: Locale | string = defaultLocale, slugArg?: string): Promise<Post | null> {
  const locale = slugArg ? (localeOrSlug as Locale) : defaultLocale;
  const slug = slugArg ?? (localeOrSlug as string);
  const fullPath = path.join(getBlogDirectory(locale), `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = decorateHeadingsAndCallouts(processedContent.toString());

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    tags: data.tags || [],
    category: data.category || (locale === "es" ? "Operaciones y Reporting" : "Operations & Reporting"),
    featuredImage: data.featuredImage || "",
    content: contentHtml,
    readingTime: estimateReadingTime(content),
  };
}

export async function getAllPosts(locale: Locale = defaultLocale): Promise<Post[]> {
  const slugs = getPostSlugs(locale);
  const posts = await Promise.all(slugs.map((slug) => getPostBySlug(locale, slug)));

  return posts
    .filter((post): post is Post => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllPostMeta(locale: Locale = defaultLocale): Array<PostMeta & { readingTime: string }> {
  const slugs = getPostSlugs(locale);

  return slugs
    .map((slug) => {
      const fullPath = path.join(getBlogDirectory(locale), `${slug}.md`);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title,
        description: data.description,
        date: data.date,
        tags: data.tags || [],
        category: data.category || (locale === "es" ? "Operaciones y Reporting" : "Operations & Reporting"),
        featuredImage: data.featuredImage || "",
        readingTime: estimateReadingTime(content),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getRelatedPosts(
  localeOrCurrentSlug: Locale | string,
  currentSlugOrTags: string[] | string,
  tagsOrLimit?: string[] | number,
  limit = 3,
): Promise<PostMeta[]> {
  let locale: Locale = defaultLocale;
  let currentSlug: string;
  let tags: string[];
  let effectiveLimit = limit;

  if (Array.isArray(currentSlugOrTags)) {
    currentSlug = localeOrCurrentSlug as string;
    tags = currentSlugOrTags;
    if (typeof tagsOrLimit === "number") {
      effectiveLimit = tagsOrLimit;
    }
  } else {
    locale = localeOrCurrentSlug as Locale;
    currentSlug = currentSlugOrTags;
    tags = (tagsOrLimit as string[]) ?? [];
  }

  const posts = await getAllPosts(locale);

  return posts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const sharedTags = post.tags.filter((tag) => tags.includes(tag)).length;
      return { post, sharedTags };
    })
    .sort((a, b) => b.sharedTags - a.sharedTags)
    .slice(0, effectiveLimit)
    .map(({ post }) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      tags: post.tags,
      category: post.category,
      featuredImage: post.featuredImage,
    }));
}

export async function getBlogFilters(locale: Locale = defaultLocale) {
  const posts = getAllPostMeta(locale);
  const tags = new Set<string>();
  const categories = new Set<string>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
    categories.add(post.category);
  });

  return {
    tags: Array.from(tags).sort(),
    categories: Array.from(categories).sort(),
  };
}
