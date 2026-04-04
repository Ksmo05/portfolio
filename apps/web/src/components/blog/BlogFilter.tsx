"use client";

import { useMemo, useState } from "react";
import BlogCard from "@/components/cards/BlogCard";
import type { PostMeta } from "@/lib/blog";
import type { Locale } from "@/lib/i18n";

type BlogFilterProps = {
  posts: Array<PostMeta & { readingTime: string }>;
  tags: string[];
  categories: string[];
  locale?: Locale;
};

const labels: Record<Locale, {
  filterCategory: string;
  filterTag: string;
  all: string;
  noMatch: string;
}> = {
  en: {
    filterCategory: "Filter by category",
    filterTag: "Filter by tag",
    all: "All",
    noMatch: "No posts match this filter combination.",
  },
  es: {
    filterCategory: "Filtrar por categoria",
    filterTag: "Filtrar por etiqueta",
    all: "Todos",
    noMatch: "No hay articulos que coincidan con esta combinacion de filtros.",
  },
};

export default function BlogFilter({ posts, tags, categories, locale = "en" }: BlogFilterProps) {
  const copy = labels[locale];
  const [selectedTag, setSelectedTag] = useState<string>(copy.all);
  const [selectedCategory, setSelectedCategory] = useState<string>(copy.all);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesTag = selectedTag === copy.all || post.tags.includes(selectedTag);
      const matchesCategory = selectedCategory === copy.all || post.category === selectedCategory;
      return matchesTag && matchesCategory;
    });
  }, [posts, selectedTag, selectedCategory, copy.all]);

  return (
    <div>
      <div className="section-shell-muted mb-10 grid gap-4 rounded-[1.75rem] p-5 md:grid-cols-2 md:p-6">
        <label className="text-sm font-medium text-slate-200">
          {copy.filterCategory}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-2 w-full rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-slate-100 outline-none"
          >
            <option value={copy.all}>{copy.all}</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-200">
          {copy.filterTag}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="mt-2 w-full rounded-[1rem] border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-slate-100 outline-none"
          >
            <option value={copy.all}>{copy.all}</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filteredPosts.length === 0 ? (
        <p className="section-shell-muted rounded-[1.75rem] border border-dashed p-8 text-center text-slate-300">
          {copy.noMatch}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
